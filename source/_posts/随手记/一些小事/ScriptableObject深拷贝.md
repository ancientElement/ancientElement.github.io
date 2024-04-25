---
title: ScriptableObject深拷贝
date: 2024-04-26 00:16
tags:
  - 深拷贝
---
深拷贝ScriptableObject可以使用Object.Instantiate

```csharp
var tempAsset = Object.Instantiate(asset);  
newClip = tempAsset.Tracks[trackIndex].Clips[clipIndex];
```

不知道这样会不会造成内存泄漏?

在C#中,父对象的引用没有被持有但是他的成员对象的引用被持有了,会不会造成内存泄漏,例如下面: 

```csharp
public static StandardClip CopyClip(AETimelineAsset asset, int trackIndex, int clipIndex)  
{  
    StandardClip clip, newClip;  
        var tempAsset = Object.Instantiate(asset);  
        newClip = tempAsset.Tracks[trackIndex].Clips[clipIndex];  
    }    return newClip;  
}
```