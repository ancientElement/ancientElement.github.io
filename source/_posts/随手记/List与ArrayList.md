---
title: List与ArrayList
date: 2024-04-09 22:36
categories:
  - 随手记
tags:
  - 随手记
  - 所想
series:
  - 随手记
---
## Reference

[.net - ArrayList vs List<> in C# - Stack Overflow --- .net - C# 中的 ArrayList 与 List<> - 代码日志](https://stackoverflow.com/questions/2309694/arraylist-vs-list-in-c-sharp)

## 正文

1. `List<T>`：
    
    - `List<T>` 是泛型集合类，其中的 `<T>` 表示集合中存储的元素类型。例如，`List<int>` 表示存储整数类型的集合。
    - 使用 `List<T>` 可以获得类型安全性，因为在编译时就能够确定集合中元素的类型，并且不需要进行类型转换。
    - `List<T>` 提供了丰富的方法和属性来操作集合，例如 `Add`、`Remove`、`Count` 等。
    - 在大多数情况下，推荐使用 `List<T>`，因为它提供了更好的性能和类型安全。

 2. `ArrayList`：
    
    - `ArrayList` 是非泛型集合类，它可以存储任意类型的对象，因为它内部存储的是 `object` 类型。
    - 在使用 `ArrayList` 存储元素时，需要进行**显式的类型转换(可能有装箱拆箱)**，因为取出的元素类型是 `object`，需要将其转换为实际的类型。
    - `ArrayList` 的优点是在早期版本的 .NET 中是唯一可用的动态数组类型，但是它的使用已经被泛型集合类所取代。
    - 如果你需要与旧版本的 .NET 代码交互，可能会遇到 `ArrayList`，但在新的开发中，推荐使用 `List<T>`。

总的来说，`List<T>` 是更现代、更安全、更高效的集合类，应该优先选择使用它。`ArrayList` 在现代的 C# 开发中已经很少使用了，主要用于与旧版代码的兼容性或特殊情况下的处理。