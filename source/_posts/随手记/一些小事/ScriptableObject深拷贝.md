---
title: ScriptableObject深拷贝
date: 2024-04-26 00:16
tags:
  - 深拷贝
---
深拷贝ScriptableObject可以使用Object.Instantiate

```csharp
public static StandardClip CopyClip(AETimelineAsset asset, int trackIndex, int clipIndex)  
{  
    StandardClip clip, newClip;  
        var tempAsset = Object.Instantiate(asset);  
        newClip = tempAsset.Tracks[trackIndex].Clips[clipIndex];  
    }    return newClip;  
}
```

但是不知道这样会不会造成内存泄漏?

答案是会,在这种情况下，如果父对象的引用没有被持有，但是它的成员对象的引用被持有了，会导致父对象无法被垃圾回收，从而可能造成内存泄漏。示例中，即使 `tempAsset` 是一个临时变量，在函数返回后会被销毁，但是 `newClip` 对象仍然保留了对 `tempAsset` 的引用，因为它是从 `tempAsset` 中获取的。

要解决这个问题，可以在提取 `newClip` 对象时将其完全分离。

比如将`newClip`深拷贝。

### 方案一

`StandardClip`并不是继承自`Object`的对象不能使用`Object.Instantiate(StandardClip)`。

那我们可以将他定义为ScriptableObject。

**可行性分析**

可行，因为使用工厂模式，所有的`clip track`，的创建都是在工厂中进行，修改起来方便

后期如果使用`ScriptableObject`嵌套有问题修改起来也方便

**引出问题**

![](images/posts/Pasted%20image%2020240426005653.png)

无法展开`Clip`，意味着无法修改数据后**即时保存**。

但是如果能够找到他的**父亲ScriptableObject**也不是无法解决

### 方案二

自定义深拷贝函数

不好实现



