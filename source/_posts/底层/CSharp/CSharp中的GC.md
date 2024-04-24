---
title: CSharp中的GC
date: 2024-01-28
tags:
  - 随手记
  - GC
  - 垃圾回收
  - 所想
---
>转载请标明出处
## Reference

[C#垃圾回收机制(GC) - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/560421474)

[C#基础：.NET中GC的运行机制 - .NET开发菜鸟 - 博客园 (cnblogs.com)](https://www.cnblogs.com/dotnet261010/p/12330503.html)

## 浅谈GC

### 出现契机

>原来是**手动内存管理**和**自动内存管理**的争端

在C/C++时代,手动内存管理是必要的，忙碌的程序员们会回收他们自己一个又一个不需要再使用的对象。可能是与当时价格昂贵的内存等硬件配置有关。

>大略看下来有与Unity中的**Addressable**资源管理有点类似了

在`JAVA`语言中就开始了自动的内存管理，为了解放程序员，让程序员更加注重在逻辑编写上。

当然`.net`紧随其后。

### GC的原理

#### **一、Mark-Compact 标记压缩算法**

堆中有很多的**对象**，并且堆中**新申请**地对象地址在**高字节**，堆中复杂的**引用关系**组成了一张复杂的**图**，于是乎我们需要**遍历**这张网，**遍历到的元素**说明**被引用了**，**标记他**，而**未遍历到的**元素在遍历结束后**清理他**。清理完成之后这个**堆是离散的了**，内存**不连续**，我们需要重新将所有对象**紧紧的挨在一起**，也就是压缩，压缩好之后，就清理出了一大片内存空间。

那么我们如何遍历呢？学过图这个数据结构都会知道**广度优先**和**深度优先**遍历算法。这里就不细讲了，但是我们遍历需要一个**入口**。

这就是**roots**，可以有很多入口，因为这个**图**，不一定就是完全**连通图**，那么这个roots**怎么得到**呢？

 >这个没有看到哪里有讲过😓，后面找到再看吧
 >并且这样**遍历**、**压缩**一来，性能消耗就成了大问题

#### **二、 Generational 分代算法**

上面提到堆中**新申请**地对象地址在**高字节**，这样我们就可以对堆中的内存对象进行一个年龄划分。如图所示：

![yiobq](/images/posts/yiobq.png)
 <center>图1 分代算法</center>

并且我们有一下几个假设条件：
1、大量**新创建的**对象生命周期都比较**短**，而较**老的对象**生命周期会更**长**  
2、对**部分内存**进行回收比基于**全部内存**的回收操作要**快**  
3、新创建的对象之间**关联程度**通常**较强**。heap分配的对象是**连续的**，关联度较强有利于提高CPU cache的命中率

Heap分为3个代龄区域，相应的GC有3种方式：**Gen 0 collections**, **Gen 1 collections**, **Gen 2 collections**。

如果Gen 0 heap内存**达到阀值**，则触发**0代GC**，**0代GC**后Gen 0中**幸存的对象**进入Gen1。
如果Gen 1的内存**达到阀值**，则进行**1代GC**，**1代GC**将**Gen 0 heap**和**Gen 1 heap**一起进行回收，**幸存的对象**进入Gen2。
以此类推。

Gen 0和Gen 1比**较小**，这两个代龄加起来总是保持在**16M左右**；Gen2的大小由**应用程序**确定，可能达到几G，因此0代和1代GC的**成本非常低**，2代GC称为**fullGC**，通常成本**很高**。粗略的计算0代和1代GC应当能在**几毫秒**到**几十毫秒**之间完成，Gen 2 heap比较大时**fullGC**可能需要花费**几秒**时间。大致上来讲.NET应用运行期间2代、1代和0代GC的频率应当大致为1:10:100。

#### **三、Finalization Queue和Freachable Queue**

> Finalization Queue 保存**含有Finalize方法**的对象的**指针**的**队列**
> Freachable Queue  **触发**里面指针指向的对象的**Finalize** 方法

这两个队列和.net对象所提供的Finalize方法有关。

引用自[C#垃圾回收机制(GC) - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/560421474)

这两个队列并不用于存储真正的对象，而是存储一组指向对象的指针。当程序中使用了new操作符在Managed Heap上分配空间时，GC会对其进行分析，如果该对象**含有Finalize方法**则在**Finalization Queue**中添加一个**指向该对象的指针**。在GC被启动以后，经过Mark阶段分辨出哪些是垃圾。再在垃圾中搜索，如果发现垃圾中有被Finalization Queue中的指针所指向的对象，则将这个对象从垃圾中分离出来，并将指向它的指针移动到Freachable Queue中。这个过程被称为是对象的复生（Resurrection），本来死去的对象就这样被救活了。为什么要救活它呢？因为这个对象的Finalize方法还没有被执行，所以不能让它死去。Freachable Queue平时不做什么事，但是一旦里面被添加了指针之后，它就会去触发所指对象的Finalize方法执行，之后将这个指针从队列中剔除，这是对象就可以安静的死去了。

**ReRegisterForFinalize**和**SuppressFinalize**

>ReRegisterForFinalize：请求系统完成对象的Finalize方法
>SuppressFinalize： 请求系统不要完成对象的Finalize方法

`.net framework`的System.GC类提供了控制Finalize的两个方法，ReRegisterForFinalize和SuppressFinalize。前者是请求系统完成对象的Finalize方法，后者是请求系统不要完成对象的Finalize方法。ReRegisterForFinalize方法其实就是将指向对象的指针重新添加到Finalization Queue中。这就出现了一个很有趣的现象，因为在Finalization Queue中的对象可以复生，如果在对象的Finalize方法中调用ReRegisterForFinalize方法，这样就形成了一个在堆上永远不会死去的对象，像凤凰涅槃一样每次死的时候都可以复生。

**.NET的GC机制有这样两个问题：**

首先，GC并不是能释放所有的资源。它不能自动释放**非托管资源**。

>**托管资源：**
>Net中的所有类型都是（直接或间接）从System.Object类型派生的。
>CTS中的类型被分成两大类——引用类型（reference type，又叫托管类型[managed type]），分配在内存堆上，值类型分配在栈上。
>值类型在栈里，先进后出，值类型变量的生命有先后顺序，这个确保了值类型变量在推出作用域以前会释放资源。比引用类型更简单和高效。堆栈是从高地址往低地址分配内存。
>引用类型分配在托管堆(Managed Heap)上，声明一个变量在栈上保存，当使用new创建对象时，会把对象的地址存储在这个变量里。托管堆相反，从低地址往高地址分配内存，如图

第二，GC并不是实时性的，这将会造成系统**性能**上的瓶颈和**不确定性**。

GC并不是实时性的，这会造成系统性能上的瓶颈和不确定性。所以有了**IDisposable**接口，IDisposable接口定义了Dispose方法，这个方法用来供程序员显式调用以**释放非托管资源**。使用using 语句可以简化资源管理。

>**非托管资源：**
>`ApplicationContext`,`Brush,Component`,`ComponentDesigner`,`Container`,`Context`,`Cursor`,`FileStrea`,`Font`,`Icon`,`Image`,`Matrix`,`Object`,`OdbcDataReader`,`OleDBDataReader`,`Pen`,`Regex`,`Socket`,`StreamWriter`,`Timer`,`Tooltip` ,文件句柄,GDI资源,数据库连接等等资源。可能在使用的时候很多都没有注意到！

示例：

当你用Dispose方法释放未托管对象的时候，应该调用GC.SuppressFinalize。如果对象正在终结队列(finalization queue),GC.SuppressFinalize会阻止GC调用Finalize方法。因为Finalize方法的调用会牺牲部分性能。如果你的Dispose方法已经对委托管资源作了清理，就没必要让GC再调用对象的Finalize方法(MSDN)。

## GC的时机

1. **内存压力（Memory Pressure）**：当系统中的内存**资源变得紧张**时，CLR会触发垃圾回收以释放不再使用的内存。这通常发生在系统**内存使用量**超过**一定阈值**时。
    
2. **分代回收（Generational Collection）**：CLR使用**分代回收**策略来管理对象的生命周期。通常情况下，垃圾回收会更**频繁**地发生在**年轻代（Generation 0）中**，而对于长时间存活的对象，则会被提升到更老的代（Generation 1和Generation 2），垃圾回收的频率会相对**较低**。
    
3. **空闲时机（Idle Time）**：CLR在系统处于空闲状态时可能会执行垃圾回收操作，以最小化对应用程序的影响。
    
4. **显式触发（Explicit Trigger）**：开发人员可以通过调用`GC.Collect()`方法来显式触发垃圾回收，但并不推荐频繁地使用该方法，因为它可能会影响应用程序的性能。

## 内存泄漏

[@.NET程序员，请了解这8种.NET 内存泄露方式！ - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/269299903)

事件没有取消订阅

非托管类型为Dispose

匿名函数中引用了该类的成员

## XLua复杂值类型（struct）gc优化指南

https://blog.csdn.net/yhx956058885/article/details/108871278

对struct的传递默认是引用类型，