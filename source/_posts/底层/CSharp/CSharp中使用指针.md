---
title: CSharp中使用指针
date: 2024-03-25 11:31
tags:
  - 随手记
  - 所想
---

## Reference

[C#中指针使用总结 - imlion - 博客园 (cnblogs.com)](https://www.cnblogs.com/imlions/p/3203427.html)
[不安全代码、数据指针和函数指针 - C# | Microsoft Learn](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/unsafe-code)

## 正文

引用类型不可以转化为指针,因为受到GC的影响引用类型的内存地址是不固定的。

如果需要用到类中的数据,可以使用fixed关键字,临时固定内存地址,但是容易产生内存碎片。

