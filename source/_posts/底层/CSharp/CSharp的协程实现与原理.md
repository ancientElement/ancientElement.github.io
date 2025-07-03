---
title: CSharp的协程实现与原理
date: 2024-03-02 13:38
tags:
  - 随手记
  - 所想
---
## Reference

[【迭代器模式】深入理解协程 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/356632347)
[Unity协程的原理与应用 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/279383752)
[[C#进阶]C#实现类似Unity的协程 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/106741659)

## 概述

引用自：[Unity协程的原理与应用 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/279383752)

>函数调用的本质是压栈，协程的唤醒也一样，调用`IEnumerator.MoveNext()`时会把协程方法体压入当前的函数调用栈中执行，运行到`yield return`后再弹栈。

在应用层面，协程将一个**循环执行**的概念变化成为一个**顺序执行**的概念，并且可以等待一个**阻塞任务**的执行而不卡死主线程，当然如果在协程里面写**死循环**还是会卡死主线程。因为协程本质上还是在**主线程**中执行的。

![](/images/posts/Pasted%20image%2020240302165328.png)
<center>图1 协程的三大将</center>

了解协程我们首先要了解**迭代器**，引用自：[【迭代器模式】深入理解协程 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/356632347)

> **迭代器**（iterator）有时又称**光标**（cursor）是程序设计的软件设计模式，可在容器对象（container，例如链表或数组）上遍访的接口，设计人员无需关心容器对象的内存分配的实现细节。

可以理解为对一个链表遍历，每次调用`MoveNext`相当于移动到这个链表的**子元素**，但是这不仅仅可以是一个链表，可以是数组、字典巴拉巴拉，是任何**继承**了**IEnumerator**的类。

```C#
using System.Runtime.InteropServices;

namespace System.Collections{
  [ComVisible(true)]
  [Guid("496B0ABF-CDEE-11d3-88E8-00902754C43A")]
  public interface IEnumerator{
    object Current { get; }
    
    bool MoveNext();
    void Reset();
  }
}
```

迭代器中，调用`MoveNext`可以执行到下一个`yiled return`,`current`就是`yiled retuen` 的值。

关于`yield`要更加深入了解一点，可以看看**深入理解C#**，其中第六章`6.1`的标题是**6.1：手写迭代器的痛苦**。`yield`就是为了简化迭代器的书写的语法糖。

## 实现

在了解了迭代器是什么，之后其实我们的目标就非常明确了：我们要在**主线程**上每一帧对所有迭代器进行**迭代**。这样在高速的CPU运行速度下，就像在**并行**一样。

但是为了更好的书写等到逻辑我们还要实现`Coroutine`和`IWait`。

`Coroutine`是对迭代器的一个包装，通过这个`Coroutine`可以由我们自己决定到底是`等待`还是`IEnumerator.MoveNext`。

`IWait`是等到的接口，继承这个接口必须要实现`public bool Tick(float dt);`函数来返回当前是否等待结束。

```C#
namespace 实现协程  
{  
    public interface IWait  
    {  
        public bool Tick(float dt);  
    }  
  
    public class WaitForSeconds : IWait  
    {  
        private float m_waitTime;  
  
        public WaitForSeconds(float time)  
        {  
            m_waitTime = time;  
        }  
  
        public bool Tick(float dt)  
        {  
            m_waitTime -= dt;  
            return m_waitTime <= 0;  
        }  
    }  
  
    public class WaitForNextFrame : IWait  
    {  
        private int m_frameCount;  
  
        public WaitForNextFrame()  
        {            m_frameCount = 1;        }  
        public bool Tick(float dt)  
        {  
            m_frameCount -= 1;  
            return m_frameCount <= 0;  
        }  
    }  
  
    public class WaitForFrame : IWait  
    {  
        private int m_frameCount;  
  
        public WaitForFrame(int frameCount)  
        {  
            m_frameCount = frameCount;  
        }  
  
        public bool Tick(float dt)  
        {  
            m_frameCount -= 1;  
            return m_frameCount <= 0;  
        }  
    }  
}
```

```C#
using System.Collections;  
  
namespace 实现协程  
{  
    public class Coroutine  
    {  
        private IEnumerator m_enumerator;  
  
        public Coroutine(IEnumerator enumerator)  
        {  
            m_enumerator = enumerator;  
        }  
  
        public bool MoveNext(float dt)  
        {  
            if (m_enumerator == null)  
            {  
                return false;  
            }  
  
            //看下有没有等待接口  
            var waitComplete = false;  
  
            //空无需等待  
            if (m_enumerator.Current == null)  
            {  
                waitComplete = true;  
            }  
            else  
            {  
                var wait = m_enumerator.Current as IWait;  
                if (wait != null)  
                {  
                    waitComplete = wait.Tick(dt);  
                }  
            }  
  
            if (waitComplete)  
            {  
                //我等待时间结束了 可以迭代下一个元素了  
                return m_enumerator.MoveNext();  
            }  
            else  
            {  
                //我还要继续等待 告诉管理器我下一个循环还要走 但是本身没有迭代  
                return true;  
            }  
        }  
  
        public void Stop()  
        {  
            m_enumerator = null;  
        }  
    }  
}
```

最后是协程管理器，管理所有的协程，通过`OnUpdate`函数，每帧都迭代所有协程，协程本身能否在本帧迭代，取决于`m_enumerator.Current`是不是`IWait`。

```C#
using System.Collections;  
using System.Collections.Generic;  
using TMPro;  
using Unity.VisualScripting;  
  
namespace 实现协程  
{  
    public class CoroutineMgr  
    {  
        public LinkedList<Coroutine> m_coroutines;  
        public LinkedList<Coroutine> m_coroutinesToStop;  
  
        public CoroutineMgr()  
        {            m_coroutines = new LinkedList<Coroutine>();            m_coroutinesToStop = new LinkedList<Coroutine>();        }  
        public Coroutine StartCoroutine(IEnumerator enumerator)  
        {  
            var coroutine = new Coroutine(enumerator);  
            m_coroutines.AddLast(coroutine);  
            return coroutine;  
        }  
  
        public void StopCoroutine(Coroutine coroutine)  
        {  
            m_coroutinesToStop.AddLast(coroutine);  
        }  
  
        public void OnUpdate(float dt)  
        {  
            var node = m_coroutines.First;  
            while (node != null)  
            {  
                bool wantMoveNext = false;  
                var coroutine = node.Value;  
                  
                if (!m_coroutinesToStop.Contains(coroutine))  
                {  
                    wantMoveNext = coroutine.MoveNext(dt);  
                }  
  
                if (!wantMoveNext)  
                {  
                    m_coroutines.Remove(node);  
                }  
  
                node = node.Next;  
            }  
        }  
    }  
}
```
