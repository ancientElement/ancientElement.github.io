---
title: 令人崩溃的DrawCall与优化
date: 2024-03-05 20:03
tags:
  - 随手记
  - DrawCall
  - 合批
  - Batches
  - 所想
---
## Reference

[Unity基础：DrawCall从入门到精通 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/352715430)文章很长

[什么是DrawCall? - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/602785764)

https://www.cnblogs.com/zerobeyond/p/17739766.html

[游戏图形批量渲染及优化：Unity静态合批技术 - GameRes游资网](https://www.gameres.com/876479.html)

[【Unity游戏开发】合批优化汇总 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/356211912)讲的比较好

## 什么是DrawCall

我们先来翻译翻译，**绘制调用**，没错就是CUP向GPU调图形渲染的**命令**。

>`DrawCall`本身的含义其实很简单，就是CPU调用图像**应用编程接口(API)**，如OpenGL中的`glDrawElecments`命令或者是`DirectX`中的`DrawIndexedPrimitive`命令，来**命令GPU**进行渲染的操作。

**Batches**通常被我们称为绘图调用（Draw Call）。这些是**简单**的绘制命令，例如，在此处绘制此对象，然后在此处绘制另一个对象。这主要是关于**使用**当前全局渲染状态绘制**相同着色器**、**相似参数**的对象。

### 提交DrawCall的步骤：

1. **准备数据（Prepare Data）**：在CPU上准备渲染所需的数据，例如**顶点坐标**、**法线**、**纹理坐标**等。
    
2. **设置渲染状态（Set Render State）**：设置**渲染状态**，包括**渲染目标**、**深度测试**、**混合模式**、**着色器程序**等。
    
3. **绘制调用（Draw Call）**：通过API调用（如OpenGL或DirectX）发起绘制命令，告诉GPU如何绘制准备好的数据。

## 命令缓存区

CPU的`DrawCall`，并不会**直接**给到GPU，可能是因为两者运行速度不一致，在两者之间有一个命令缓冲全区。

> 其实现在我已经看到过很多由于速度不一致而设计的缓冲区，例如：**寄存器**、**消息队列**
> 所以我才大胆猜测，还有内存
> 
> 实际上也是效率问题引起的，如果CPU只有等待GPU处理完一个命令才给下一个命令效率太低下了。

![fc6tc](/images/posts/fc6tc.png)
<center> 图1 命令缓冲区</center>

## SetPasses

上图中**黄色**的方框"渲染模型A"就是**DrawCell**，红色的方框是**SetPasses**。

>但是，**SetPasses**描述了一种更昂贵的操作：**材质更改**。更改材质很**昂贵**，因为我们必须设置一个**新的渲染状态**。其中包括**着色器参数**和**管线设置**，例如**Alpha Blending**，**Z-Test**，**Z-Writing**。

所以材质的更改也是一个性能上的大问题。我们要尽量使用相同的材质避免**SetPasses**产生更大的消耗。在共享材质的情况下我们的**SetPasses**只用提交一次。

![rj58x](/images/posts/rj58x.webp)
<center>图2 Unity中的**Batch(DrawCall)**和**SetPass**</center>

最后，你可以并且应该使用**Unity Frame Debugger**。该工具将为你显示当前视图正在发出的特Draw Call（Batches）。你可以点击_Window → Analysis → Frame Debugger_菜单打开它。
## 批处理

提交**大量很小**的DrawCall会造成CPU的性能瓶颈，即CPU把时间都花费在**准备DrawCall**的工作上了。那么很显然的一个优化方法就是把很多小的DrawCall**合并**成一个**大的DrawCall**，这就是**批处理**。

游戏开发人员使用**批处理**将**相似对象**的渲染分组到**同一个Draw Call**中。这样，CPU只需支付**一次DrawCall**即可渲染**多个对象**。

在批处理中，**相似**定义为在不同的对象上使用**相同的材质**。如果完成此步骤，则可以完成最复杂的步骤。

## 技术1：静态批处理

一下皆引用自：[Unity基础：DrawCall从入门到精通 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/352715430)

适用于**不会**在运行时**改变**的网格，Unity编辑器在**构建阶段**将多个**静态网格**合并成**一个网格**，并生成一个合并后的网格文件。这样可以显著减少Draw Call的数量，但缺点是无法在**运行时动态修改**这些网格。这样将静态物体的网格进行合并，就只需要**一次DrawCall**。

在Player Setting，如图所示。选择您要启用的目标平台，打开Static Batching。

![kima4](/images/posts/kima4.webp)
<center>图3 静态合批</center>

更准确地说，Unity将查找启用了**batching static**标志的对象。然后，Unity将尝试**合并公用材质**的对象。

Unity静态批处理通过**创建**包含各个网格的**巨大网格**来工作。但是Unity也会保持**原始网格**的完整，因此我们仍然能够单独渲染它们。
这样我们可以仅绘制可见视野内的对象，而丢弃不可见的对象，使得**视锥裁切**正常工作。

通过将所有网格都放在一个网格中，我们就可以在不更改渲染状态的情况下全部绘制它们。

静态批处理的主要**限制**是每批可以具有**的顶点和索引的数量**，通常为每个**64k**，可以在[此处](https://link.zhihu.com/?target=https%3A//docs.unity3d.com/Manual/DrawCallBatching.html)检查限制更新（如果有）。

静态批处理的缺点是**增加了内存使用量**。如果您有100个石头，每个石头模型占用1MB，则可以预期内存使用量将超过**100MB**。发生这种情况的原因是，巨大的批处理网格将所有石头一起包含在一个网格中。

但是，内存使用对你来说不是问题。毕竟，你可以查看我的[Unity可寻址对象教程](https://link.zhihu.com/?target=https%3A//thegamedev.guru/unity-addressables/tutorial-learn-the-basics/)，该[教程](https://link.zhihu.com/?target=https%3A//thegamedev.guru/unity-addressables/tutorial-learn-the-basics/)将帮助你节省大量内存。

## 技术2：Unity GPU Instancing

GUP Instancing 可以用于绘制非静态的对象，因为它通过传递一个transform给GPU而得到绘制，相同的物体仍然只有一次DrawCall。

这是针对每种材质激活GPU Instancing设置，如下所示。

![2x52a](/images/posts/2x52a.webp)
<center>图4 GPU Instancing</center>

Unity GPU Instancing：材质设置

GPU实例化让你可以非常高效地绘制**相同**的网格几次。Unity通过向GPU传递转一个**Transform列表**来做到这一点。毕竟，每块石头都有自己的位置，旋转和缩放。

与静态批处理相比，这是一项强大的技术，因为它不会激增**内存使用量**，并且不需要对象是静态的。

![nuxt0](/images/posts/nuxt0.jpg)

<center>图5 GPU Instancing</center>

要使用GPU Instancing，你只需要在材质检视面板中启用它即可。如果你有多个具有相同网格和材质的对象，那么Unity对它们将自动进行批处理。

但是，创建Transform列表会**降低性能**。如果在游戏过程中没有物体移动/旋转/缩放，则只需支付一次此开销。但是，如果对象**每帧都更改一次**，则需要**每帧支付一次开销**。

**推荐一个插件：**[GPUInstance](https://link.zhihu.com/?target=https%3A//assetstore.unity.com/packages/tools/utilities/gpu-instancer-117566)比Unity默认的要好用的多。
## 技术3：动态批处理

适用于需要在运行时动态修改的网格，Unity会在**运行时**动态合并具有**相同材质**的网格，以减少Draw Call的数量。动态批处理不需要预先合并网格，而是在**运行时**根据需要动态合并网格，因此适用于需要**动态创建**、**销毁**或**修改**的网格。

但是，请记住，Unity动态批处理**受到更加严格的限制**。你只能将其应用于具有少于**300个顶点**和**900个顶点**属性（_颜色，UV_等）的网格。材质也应使用single-pass着色器。[此处](https://link.zhihu.com/?target=https%3A//docs.unity3d.com/Manual/DrawCallBatching.html)有完整的限制列表。

出现此限制的**原因**是在运行时创建这些批处理的CPU**性能成本**。与单独发出绘图调用相比，超过300个顶点很难证明批量CPU的成本合理。

不仅如此，动态批处理**非常不可预测**。你无法真正确定对象将如何被批处理。结果通常会随着帧的变化而变化。打开Unity Frame Debugger并查看结果，在每帧之间动态批处理的结果发生巨大变化是令人困惑的。

我认为，这应该是你的不得已的方法。但是，嘿，它仍然是一种有用的工具，请不要忽略它。

## 技术4：Unity运行时批处理API

Unity使你可以访问**2个强大的API**，以在**运行时**合并网格。

假设你正在开车。在车的内部，你会看到一些元素，例如座椅，把手，挡风玻璃和你收藏的咖啡杯。你可以在比赛开始之前设定这些元素。

一旦你做出选择并开始比赛，这些元素就会在你的赛车中**变成静态**的（无法再次更改）。让我解释一：

车内部的物品、零件都变成**相对静态**的了。

但是，Unity认为所有这些都是动态的。这就是为什么在这种情况下无法进行静态批处理的原因。

尽管如此，我们仍然可以通过使用**静态批处理API**，**手动**创建合批。

最简单的方法是使用[StaticBatchingUtility.Combine](https://link.zhihu.com/?target=https%3A//docs.unity3d.com/ScriptReference/StaticBatchingUtility.Combine.html)。该函数传入一个**根游戏对象**，并将遍历其所有子对象并将其几何形状**合并**为一个大块。一个**容易遗漏**的限制是，要批处理的所有子网格的导入设置必须允许开启`_CPU read/write_`。

第二种方法是使用[Mesh.CombineMeshes](https://link.zhihu.com/?target=https%3A//docs.unity3d.com/ScriptReference/Mesh.CombineMeshes.html)。此函数间接获取网格列表并创建组合的网格。然后，你可以将该网格分配给mesh filter渲染。

我简化了这两种功能的解释。查看文档以获取有关如何使用它们的详细信息。

在下图中，您将看到我如何应用**StaticBatchingUtility** API的功能在运行时将一些动态坦克批合并为一个网格。

![1p3on](/images/posts/1p3on.webp)
<center>图6 批处理API</center>

## 静态合批与动态合批对比

### 静态合批

**优点：**

1. **性能高效：** 静态合批将多个渲染对象的顶点数据合并成一个大的顶点缓冲区，减少了状态切换和数据传输的开销，从而提高了渲染性能。
2. **减少 DrawCall 调用：** 合并多个渲染对象可以减少 API 调用次数，降低 CPU 开销，提高渲染效率。
3. **减少资源消耗：** 合并顶点数据后，可以减少顶点缓冲区的数量和内存占用，节约资源。

**缺点：**

1. **限制性强：** 静态合批适用于不经常变化的渲染对象，一旦合并后的顶点数据发生变化，就需要重新生成合并后的顶点缓冲区，会增加额外的开销。
2. **内存占用：** 如果需要合并大量渲染对象，可能会占用较多的内存，特别是对于大型场景而言。

### 动态合批

**优点：**

1. **灵活性强：** 动态合批可以处理频繁变化的渲染对象，能够实时更新顶点数据而不需要重新生成合并后的顶点缓冲区。
2. **节省内存：** 由于动态合批不需要在内存中保存合并后的顶点数据，因此节省了内存空间。
3. **适应性强：** 适用于需要动态添加、删除、修改渲染对象的场景，例如粒子系统、动态网格等。

**缺点：**

1. **性能开销：** 动态合批需要在每一帧重新计算合并后的顶点数据，可能会增加 CPU 开销，特别是当渲染对象数量较多时。
2. **DrawCall 调用频繁：** 每次更新渲染对象都需要进行一次合批操作，可能会增加 API 调用次数，降低渲染效率。
3. **实现复杂：** 实现动态合批需要考虑更多的细节，例如合并策略、更新频率等，相对而言比较复杂。

综上所述，静态合批适用于渲染对象不经常变化且数量较多的场景，而动态合批适用于需要频繁更新渲染对象且数量较少的场景。选择合适的合批方式需要根据具体的需求和场景来决定。