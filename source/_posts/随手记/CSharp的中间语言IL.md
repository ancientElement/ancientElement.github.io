---
title: CSharp的中间语言IL
date: 2024-04-15 15:27
categories:
  - 随手记 
tags:
  - 随手记
series:
  - 随手记
---
## Reference

[.Net 中的IL中间语言基本语法 - Jason.Zeng - 博客园 (cnblogs.com)](https://www.cnblogs.com/ZengYunChun/p/6125500.html)

[.NET 术语表 - .NET | Microsoft Learn](https://learn.microsoft.com/zh-CN/dotnet/standard/glossary)

[理解IL- IL语法 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/100233990)

[IL指令详细 - Zery - 博客园 (cnblogs.com)](https://www.cnblogs.com/zery/p/3368460.html)
## 正文

几个指令

add sub div mul  rem xol  and or neg jmp ret Nop box unBox  call基础指令加减乘除取余 与或非 跳转  返回 空 装箱拆箱 调用等等 

ld  加载指令可以理解为Load
st  storage存储指令
beq, bge, bgt, ble, blt, bne 判断跳转指令,可以理解为`bool equal` 判断相等 `bool great`判断大于

看了上面文章对为什么**string是引用类型**和**装箱拆箱**有了新的理解

文中还讲到了**EvolutionStack**和**CallStack**

![](images/posts/Pasted%20image%2020240415153351.png)