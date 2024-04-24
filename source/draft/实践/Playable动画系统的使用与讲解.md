---
title: Playable动画系统
date: 2024-02-25
tags:
  - 实践
  - Playable
---
## 动画根节点


![](/images/posts/Pasted%20image%2020240225135604.png)

### AnimAdpter

`public class AnimAdpter : PlayableBehaviour`

`AnimAdapt`是一个`PlayableBehaviour`，是`Playable`真正起作用的地方。

我们不直接在这里写功能，而是只在这里调用`AnimBehaviour`中**对应**的函数。
### AnimBehaviour 

`public abstract class AnimBehaviour`

这并**不是**`PlayableBehavior`的派生类。

`protected Playable m_adapterPlayable;`

我们采用**适配器模式**将`m_adapterPlayable`作为`AnimBehaviour`的成员，并且实现`PlayableBehaviour`中的

```C#
PrepareFrame(Playable playable, FrameData info)
OnGraphStop(Playable playable)
```

方法，我们将`AnimBehaviour`**伪装**成了一个`PlayableBehaviour`，这样就可以用我们**自定义**的类来实现`Playable`。

因为实际上我们运行的还是`PlayableBehaviour`，只不过我们不用**直接继承**的方式，而是让`PlayableBehaviour`来调用我们的`AnimBehaviour`。

## 动画组件

### 单一动画节点

这个节点非常简单只需要用到一个`AnimationClipPlayable`，就可以了，在初始化的时候将`AnimationClipPlayable`添加成为我们适配器的子节点。

并且在`Enable`和`Disable`函数中对应地开启播放和停止播放。

### 混合器节点


### BlendTree1D节点

### BlendTree2D节点

## 动画资源文件
