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

但是