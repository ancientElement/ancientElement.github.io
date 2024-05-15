---
title: python基础教程
date: 2024-05-15 10:21
tags:
---
[Python Tutorial (w3schools.com)](https://www.w3schools.com/python/default.asp) W3C的教程挺好的

## 变量

Python has no command for declaring a variable.
Python **没有用于声明变量**的命令。

A variable is created the moment you first assign a value to it.
变量是在您第一次为其赋值时创建的。

Variables do not need to be declared with any particular _type_, and can even change type after they have been set.
变量不需要用任何特定的 _类型_ 来声明，甚至可以在设置后**更改类型**。

You can get the data type of a variable with the `type()` function.
您可以使用 `type()` 函数获取变量的数据类型。

String variables can be declared either by using single or double quotes:
字符串变量可以使用**单引号或双引号**声明：

Variables that are created outside of a function (as in all of the examples above) are known as global variables.
在**函数外部**创建的变量（如所有示例中所示） 上面）被称为**全局变量**。

Global variables can be used by everyone, both inside of functions and outside.
全局变量可以**被任何人使用**，无论是在 功能和外部。

If you create a variable with the same name inside a function, this variable will be local, and can only be used inside the function. The global variable with the same name will remain as it was, global and with the original value.
如果在**函数内**创建同名变量，则该变量 将是**本地的**，并且只能在函数内部使用。全局变量 具有相同的名称将保持原样、全局且具有原始值。

Variables that are created outside of a function (as in all of the examples above) are known as global variables.
在函数外部创建的变量（如所有示例中所示） 上面）被称为**全局变量**。

Global variables can be used by everyone, both inside of functions and outside.
全局变量可以**被任何人使用**，无论是在 功能和外部。

To create a global variable inside a function, you can use the `global` keyword.
要在函数内创建全局变量，可以使用 `global` 关键字。

![](images/posts/Pasted%20image%2020240515104845.png)

## Number

## Python NumbersPython 数字

There are three numeric types in Python:
Python 中共有三种数值类型：

- `int`
- `float`
- `complex`