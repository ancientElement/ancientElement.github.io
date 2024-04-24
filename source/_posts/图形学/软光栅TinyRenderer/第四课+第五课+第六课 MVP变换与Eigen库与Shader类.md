---
title: 第四课+第五课+第六课 MVP变换与Eigen库与Shader类
date: 2024-03-12
tags:
  - 软光栅TinyRenderer
---
![](/images/posts/Pasted%20image%2020240312151201.png)
<!--more-->
## Reference

[Lesson 6: Shaders for the software renderer · ssloy/tinyrenderer Wiki (github.com)](https://github.com/ssloy/tinyrenderer/wiki/Lesson-6:-Shaders-for-the-software-renderer)
https://www.bilibili.com/video/BV1X7411F744/
[从零开始的TinyRenderer(6)——着色（光照模型） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/642944600)
[从零开始的TinyRenderer（5）——移动相机与代码重构 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/639983888)
[C++矩阵库Eigen的用法 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/414383770)
## 简要概述

> 这三课放在一起写比较好
> **第四第五课**没啥实际要写的内容
> 主要是理解**MVP变换**，我的评价是最好去看**Games101**，讲的比这个详细
> 那么为什么用**Eigen**，因为他的源代码的矩阵库在我这里报错不知道什么原因
> 最后写好之后，重构代码，使用Shader的**vertext**返回一个屏幕坐标，使用**segment**计算一个颜色

具体MVP推导我的博客里面呢，也有可以直接搜到。

下面有几个问题可以看一下，是我犯下的一些错误：

1.flaot的值 导致撕裂 要四舍五入
2.egine的vector和matrix值不能输多了 报错
3.egine的值不能默认隐式转换 报错
4.灯光的反向和法线反向一定要normalize 不然全是黑色
5.视口变换 矩阵不要打错了
6.定义好右手坐标系
7.检测viewcamera矩阵不要写错了，特别注意-forword方向
8.检查barycentric不要把返回的 $\alpha$ $\beta$ $\gamma$ 顺序搞错了   

更加详细的内容，待会再写，现在太晚了

## 仿射变换

之前的学习中我们从未对模型的坐标做过转换，仅仅是将模型的顶点的xy轴映射到屏幕上，所以我们的摄像机是固定的在z轴负反向。现在我们需要移动这些顶点的位置了，就要对他们做变换。

对应Games101的课程：[Lecture 03 Transformation_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1X7411F744?p=3&vd_source=0facd4aab4af4ac2b725f78a049c12b0)

这里我就不讲了，我代码提交中的第三课做了一下几个变换。

大家可以尝试自己做一下。

如果你发现老师的`矩阵.cpp+h`文件在你哪里无法使用，请下载eigen，并且学习：[C++矩阵库Eigen的用法 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/414383770)

![](/images/posts/Pasted%20image%2020240312141404.png)

## ViewPort矩阵-本地坐标->屏幕坐标

Games101对应点：
https://www.bilibili.com/video/BV1X7411F744?t=1265.0&p=5

其实没什么好推导的，`一个缩放矩阵 x 一个位移矩阵`就可以了
## Projection矩阵-透视

Games101对应点：
https://www.bilibili.com/video/BV1X7411F744?t=2693.9&p=4

不同的是，老师这里的代码只用到了距离相机的z轴距离，而没有近平面和远平面，需要推导可以看我的博客：
[MVPP变换推导之透视变换Perspective | AncientElement (gitee.io)](https://ancientelement.gitee.io/2024/03/09/%E9%9A%8F%E6%89%8B%E8%AE%B0/MVPP%E5%8F%98%E6%8D%A2%E6%8E%A8%E5%AF%BC%E4%B9%8B%E9%80%8F%E8%A7%86%E5%8F%98%E6%8D%A2Perspective/)

这里我就不多bibi了
## ViewCamera矩阵-移动你的摄像机


Games101对应点：
https://www.bilibili.com/video/BV1X7411F744?t=1461.7&p=4

我的推导：
[MVPV变换之视图变换ViveCamera | AncientElement (gitee.io)](https://ancientelement.gitee.io/2024/03/09/%E9%9A%8F%E6%89%8B%E8%AE%B0/MVPV%E5%8F%98%E6%8D%A2%E4%B9%8B%E8%A7%86%E5%9B%BE%E5%8F%98%E6%8D%A2ViveCamera/)

要注意，相机的forword轴要对齐的是-z轴

## 代码重构

建立`gl.h+cpp`编写**trainagle**代码，和保存**viewcamera**、**projection**、**viewport**矩阵的转换代码，同时`.h`文件中还要有`Shader`这个接口类，写法请参照**源代码**。
`mian.c`中只编写**加载模型**、定义**光源位置**、**相机位置**代码。

如果你和我一样用了**Eigen**，你如果不知道如何更改，请拷贝我的源文件中的`tagimage.h+cpp、model.h+cpp`文件。

好，可以开始了。

首先我们要明确，在**绘制模型**的时候，我们是一个**面**一个**面**的来绘制的，**一个**面对应**三个**顶点，**三个**顶点对应他包围盒中`x*y`个**片元**(当然是三角形剔除以后的)。

在顶点阶段，我们必须要返回一个**每个顶点的屏幕坐标**(也就是经过MVP变换)，这样triangle的时候才知道你在屏幕上的**包围盒**在
哪里，你的**深度**，并且存储一些顶点的信息，供片元阶段使用，比如，world_pos、uv等等。

```C++
//iface: 第几个面  
//ivertex: 第几个顶点  
//return: 屏幕空间坐标  
virtual Eigen::Vector4f vertex(int iface, int ivertex) = 0;
```

```C++
//遍历三角形  
for (int i = 0; i < model->nfaces(); i++)  
{  
    //--顶点阶段--  
    for (int j = 0; j < 3; j++)  
    {  
        screen_croods[j] = shader->vertex(i, j);  
    }  
    //--片元阶段--  
    triangle(screen_croods, *image, shader, z_buffer);  
}
```

我们**每三个顶点的信息**可以供给这三个顶点中所有的片元使用，那么我们每一个**片元**都只能使用相同的三个信息吗。

不，我们有**重心坐标**。

>检查**barycentric**不要把返回的 $\alpha$ $\beta$ $\gamma$ 顺序搞错了   

使用重心坐标对三个顶点的信息插值，可以插值顶点UV、顶点法线与光的点乘(兰伯特)等等。

```C++
//barycentric: 重心坐标  
//color: 颜色ref  
//return: 是否抛弃这个对象  
virtual bool fragment(Vector3f barycentric, TGAColor& color) = 0;
```

在**triangle**里面我们这样调用他：

```C++
//深度测试  
if (cur_z > z_buffer[x][y])  
{  
    TGAColor color;  
    bool discard = shader->fragment(uvw, color);  
    if (!discard)  
    {  
        z_buffer[x][y] = cur_z;  
        image.set(x, y, color);  
    }  
}
```

OK，下面就可以写Shader类了。

## Shader类

一个简单的漫反射Shader

```C++
//着色器  
class GroundShader : public Shader  
{  
public:  
    Vector3f ndl; //法线与光方向  
    virtual Eigen::Vector4f vertex(int iface, int ivertex) override  
    {  
        Vector3f v = model->vert(iface, ivertex);  
        Vector3f n = model->normal(iface, ivertex).normalized();  
        ndl[ivertex] = max(.0f, n.dot(light_dir));  
        return m_viewport * m_projection * m_viewcamera * Vector4f(v[0], v[1], v[2], 1.);  
    }  
  
    virtual bool fragment(Vector3f barycentric, TGAColor& color) override  
    {  
        float intensity = ndl.dot(barycentric);  
        if (intensity > .85) intensity = 1;  
        else if (intensity > .60) intensity = .80;  
        else if (intensity > .45) intensity = .60;  
        else if (intensity > .30) intensity = .45;  
        else if (intensity > .15) intensity = .30;  
        else intensity = 0;  
        color = TGAColor(255, 155, 0) * intensity;  
        return false;  
    }  
};
```

一个简单的漫反射Shader+纹理

```C++
class SimpleShader : public Shader  
{  
public:  
    Vector3f ndl; //法线与光方向  
    Matrix<float, 2, 3> uv; //uv  
    virtual Eigen::Vector4f vertex(int iface, int ivertex) override  
    {  
        //顶点  
        Vector3f v = model->vert(iface, ivertex);  
        //法线  
        Vector3f n = model->normal(iface, ivertex).normalized();  
        ndl[ivertex] = max(.0f, n.dot(light_dir));  
        //纹理  
        uv(0, ivertex) = model->uv(iface, ivertex)[0];  
        uv(1, ivertex) = model->uv(iface, ivertex)[1];  
        return m_viewport * m_projection * m_viewcamera * Vector4f(v[0], v[1], v[2], 1.);  
    }  
  
    virtual bool fragment(Vector3f barycentric, TGAColor& color) override  
    {  
        float intensity = ndl.dot(barycentric);  
        Vector2f tempUV = uv * barycentric;  
        color = model->diffuse(tempUV);  
        color = color * intensity;  
        return false;  
    }  
};
```

![](/images/posts/Pasted%20image%2020240312135033.png)