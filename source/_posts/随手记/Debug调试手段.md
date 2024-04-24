---
title: Debug调试手段
date: 2024-01-16T00:00:00
tags:
  - 随手记
  - debug
---

从 0 到 1 学习 Visual Studio Debug 之一：入门 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/28136370)把这个系列看完,再做一些练习√
 
 - 追踪断点可以打印信息到OutPut窗口,可以选择继续执行代码或者卡住,另外他有一些关键字可以输出信息,如$Function输出对应调用函数信息,还有他支持模板语法
 
 ![image-20240113120636680](/images/posts/image-20240113120636680.png)
 
 - 堆栈调用窗口可以显示调用图
 
 ![image-20240113123516954](/images/posts/image-20240113123516954.png)
 
 - 运行到光标处 这样可以免去开始调试和设置断点
 
 ![image-20240113124413339](/images/posts/image-20240113124413339.png)
 
 - 在属性上右键单步执行特定函数可以进入Set、Get函数
 
 ![image-20240113124536677](/images/posts/image-20240113124536677.png)
 
 - Debug.LogError(message,object)
 
 第二个参数可以传入GameObjecy,点击打印的error可以聚焦到对应的GameObject
 