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

不知道这样会不会造成内存泄漏