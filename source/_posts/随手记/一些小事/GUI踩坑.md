---
title: GUI踩坑
date: 2024-04-10 22:11
tags:
  - 随手记
---
在Unity的IMGUI中如果你要使得一个Box的背景改变颜色,像如下这么写大概率是错误的

```csharp
GUI.backgroundColor = Color.gray;  
GUI.Box(rect,"");
```

如果你给他指定一个样式,那么就会正确

```csharp
GUI.backgroundColor = Color.gray;  
GUI.Box(rect,"","Button");
```

或者你想要画一个色块,可以使用

```csharp
EditorGUI.DrwaRect(rect,Color);
```
