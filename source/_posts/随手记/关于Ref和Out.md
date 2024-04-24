---
title: 关于Ref和Out
categories:
  - 随手记
date: 2024-01-01
tags:
  - ref
  - out
  - 所想
series:
  - 随手记
---
## Reference

[C#中out和ref之间的区别 - 陈斌彬的技术博客 (cnbin.github.io)](https://cnbin.github.io/blog/2016/02/20/c-number-zhong-outhe-refzhi-jian-de-qu-bie/)

## 概述

在用法上，`Out`常常用来做**多返回值**，而`Ref`则是会**改变当前参数**的值。

在函数中`Out`的参数在返回函数前**必须赋值**，而`Ref`可以不用。

他们都于C++中的**引用**类型相似，传递的都是值的**地址**。

## 区别

引用自：[C#中out和ref之间的区别 - 陈斌彬的技术博客 (cnbin.github.io)](https://cnbin.github.io/blog/2016/02/20/c-number-zhong-outhe-refzhi-jian-de-qu-bie/)

`out`是要把参数清空，就是说你**无法**把一个数值从`out`**传递进去**的，`out`进去后，参数的数值为**空**，所以你必须初始化一次。这个就是两个的区别，或者说就像有的网友说的，`ref`是**有进有出**，out是**只出不进**。所以`out`常常做**返回值**。

```C#
static void main(){
	refFun(out i);
	Console.WriteLine(i);
}

static void refFun(out int i){}
```

传递到` ref `参数的参数必须**最先初始化**。这与` out `不同，后者的参数在传递之前不需要显式初始化。

```C#
static void main(){
	refFun(ref var i);
	Console.WriteLine(i);
}

static void refFun(ref int i){}
```