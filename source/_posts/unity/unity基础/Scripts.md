---
tags:
categories:
  - unity
  - unity基础
  - Unity基础
  - Unity
series:
  - Unity基础
date: 2022-11-15
title: Scripts 
---
* 不要在在脚本里写构造函数

* Unity特性

  * 序列化字段 在编译器里显示私有变量*

  ```c#
  [Range(0, 100)]
  [SerializeField]
  private int speed = 100;
  ```

  * 在编译器里隐藏字段
   ```c#
  [HideInInspector]
  public int location;
   ```

  

