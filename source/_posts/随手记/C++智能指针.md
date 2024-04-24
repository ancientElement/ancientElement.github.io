---
title: C++智能指针
categories:
  - 随手记
date: 2024-03-12 20:50
tags:
  - 随手记
series:
  - 随手记
---
>智能指针不需要手动释放内存!!! 太好了

## SharedPointer

通过计数的方式实现的。

初始化方式：

1.make_shared

```C++
shared_ptr<int> p = make_shared<int>(100);
```

2.new

```C++
shared_ptr<int> p {new int(100)};
```

释放：

```C++
shared_ptr<int> p {new int(100)};
p.reset();
```

指向新对象：

```C++
p.reset(new Foo());
```

获取裸指针：

```C++
p.get();
```

## UniquePointer

一个指针独享一份资源，不允许复制指针，指针销毁自动释放资源。

初始化方式：

1.make_unique

```C++
unique_ptr<int> p = make_unique<int>(p);
```

2.new

```C++
unique_ptr<int> p {new int(100)};
```

释放：

```C++
unique_ptr<int> p {new int(100)};
p.reset();
```

指向新对象：

```C++
p.reset(new Foo());
```

获取裸指针：

```C++
p.get();
```


move 

get

解引用