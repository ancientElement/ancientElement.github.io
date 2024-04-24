---
title: UGUI
date: 2024-04-08 16:42
tags:
  - 资源创建
---
## Reference

>作者: https://github.com/lwwhb
>文章地址: [Unity2022_SUNTAIL_Stylized_Fantasy_Village_Optimization/Documents/2022年3月15日 第玖讲 预制体.md](https://github.com/lwwhb/Unity2022_SUNTAIL_Stylized_Fantasy_Village_Optimization/blob/main/Documents/2022%E5%B9%B43%E6%9C%8815%E6%97%A5%20%E7%AC%AC%E7%8E%96%E8%AE%B2%20%E9%A2%84%E5%88%B6%E4%BD%93.md)

## Unity UI性能的四类问题

1. Canvas Re-batch 时间过长
2. Canvas Over-dirty, Re-batch次数过多
3. 生成网格顶点时间过长
4. Fill-rate overutilization(片元着色器利用率过高)

## Canvas画布

​**Canvas**负责管理UGUI元素，负责UI渲染网格的生成与更新，并向GPU发送**DrawCall**指令。

## Canvas Re-batch过程

由于Canvas会在一开始合批一次,如果之后所有UI都不**移动**了且没有**遮挡关系**,就不会触发Re-batch。

1. 根据UI元素**深度关系**进行排序
2. 检查UI元素的**覆盖关系**

覆盖关系改变会触发Re-batch

3. 检查UI元素材质并进行**合批**

## UGUI渲染细节

- UGUI中渲染是在Transparent**半透明渲染队列**中完成的，半透明队列的绘制顺序是从后往前画，由于UI元素做Alpha Blend,我们在做UI时很难保障每一个像素不被重画，UI的**Overdraw**太高，这会造成**片元着色器利用率过高**，造成GPU负担。
- UI SpriteAtlas**图集利用率不高**的情况下，大量**完全透明**的像素被采样也会导致像素被重绘，造成片元着色器利用率过高；同时纹理采样器浪费了大量采样在无效的像素上，导致需要采样的图集像素不能尽快的被采样，造成纹理采样器的填充率过低，同样也会带来性能问题。

## Re-Build过程

这里不太了解

- 在WillRenderCanvases事件调用PerformUpdate::CanvasUpdateRegistry接口
    - 通过ICanvasElement.Rebuild方法重新构建Dirty的Layout组件
    - 通过ClippingRegistry.Cullf方法，任何已注册的裁剪组件Clipping Compnents(Such as Masks)的对象进行裁剪剔除操作
    - 任何Dirty的 Graphics Compnents都会被要求重新生成图形元素
- Layout Rebuild
    - UI元素位置、大小、颜色发生变化
    - 优先计算靠近Root节点，并根据层级深度排序
- Graphic Rebuild
    - 顶点数据被标记成Dirty
    - 材质或贴图数据被标记成Dirty

## 使用Canvas的基本准则：

- 将所有可能打断合批的层移到**最下边的图层**，尽量避免UI元素出现**重叠区域**
- 可以拆分使用多个同级或嵌套的Canvas来减少Canvas的Rebatch复杂度
- 拆分动态和静态对象放到不同Canvas下。
- 不使用**Layout组件**
- Canvas的RenderMode尽量**Overlay**模式，减少Camera调用的开销

## UGUI射线（Raycaster）优化：

- 必要的需要**交互UI组件**才开启“Raycast Target”
- 开启“Raycast Targets”的UI组件**越少**，**层级越浅，性能越好**
- 对于复杂的控件，尽量在**根节点**开启“Raycast Target”
- 对于嵌套的Canvas，OverrideSorting属性会打断射线，可以降低层级遍历的成本

## UI字体

- 避免**字体框**重叠，造成合批打断
    
- 字体网格重建
    - **UIText**组件发生变化时
    - **父级对象**发生变化时
    - UIText组件或其父对象**enable/disable**时(直接用Canvasdisable)

- TrueTypeFontImporter

[Font assets - Unity 手册 (unity3d.com)](https://docs.unity3d.com/cn/2020.3/Manual/class-Font.html)
[TrueTypeFontImporter - Unity 脚本 API](https://docs.unity.cn/cn/2021.3/ScriptReference/TrueTypeFontImporter.html)
    - 支持TTF和OTF字体文件格式导入

- **动态字体**与**字体图集**
    
    - 运行时，根据UIText组件内容，动态生成字体图集，只会保存当前Actived状态的 UIText控件中的字符
    - 不同的字体库维护不同的Texture图集
    - 字体Size、大小写、粗体、斜体等各种风格都会保存在**不同的字体图集**中（有无必要，影响图集利用效率，一些利用不多的**特殊字体**可以采用图片代替或使用Custom Font，Font Assets Creater创建静态字体资源）
    - 当前Font Texture不包含UIText需要显示的字体时，当前Font Texture需要重建(**字体大小**)
    - 如果当前图集太小，系统也会尝试重建，并加入需要使用的字形，文字图集只增不减
    - 利用**Font.RequestCharacterInTexture**可以有效降低启动时间

- UI控件优化注意事项
    
    - 不需要交互的UI元素一定要关闭**Raycast Target**选项
    - 如果是较大的背景图的UI元素建议也要使用Sprite的**九宫格**拉伸处理，充分减小UI Sprite大小，提高UI Atlas**图集利用率**
    - 对于不可见的UI元素，一定**不要使用**材质的**透明度**控制显隐，因为那样UI网格依然在绘制，也不要采用**active/deactive UI**控件进行显隐，因为那样会带来gc和重建开销(**使用Canvas Disable**)
    - 使用全屏的UI界面时，要注意隐藏其背后的所有内容，给GPU休息机会。
    - 在使用非全屏但模态对话框时，建议使用**OnDemandRendering**接口，对渲染进行降频。
    - 优化裁剪UI Shader，根据实际使用需求移除多余特性关键字。

- 滚动视图**Scroll View**优化(很容易引起性能问题由于有大量子UI,经常变化)
    
    - 使用**RectMask2d**组件裁剪
    - 使用**基于位置**的对象池作为实例化缓存