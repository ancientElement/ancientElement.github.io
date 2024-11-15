---
title: 课时8：No.8模拟面试题
date: 2023-10-06
tags:
  - 面试题
  - unity和cs
---
**C#**

**1. 如果我们想为Unity中的Transform类添加一个自定义的方法，应该如何处理？**

我的回答：

使用拓展方法，定义静态类作为transform专用用拓展类

答案：

通过C#的拓展方法相关知识点进行添加

**2. 请说出using关键字的两个作用**

我的回答：

应用命名空间、开辟数据流

答案：

1. 引入命名空间
2. 安全使用引用对象

**3. C#中Dictionary不支持相同键存储  
    如果想要一个键对应多个值如何处理？**

我的回答：

不知道

答案：

![](_images/Pasted%20image%2020231007160017.png)

**4. 请问下面代码的最终打印结果是什么？为什么？**

![](media/1005266e9fd6307619.png)

我的回答：

不知道 应该都是10

答案：

全是10

当委托最终执行时，他们使用的i，都是for循环中声明的i，此时的i已经变成了10

**5. 上题中的代码，如果我们希望打印出0~9，应该如何修改代码？**

我的回答：

![](_images/Pasted%20image%2020231007160113.png)

**Unity**

**1. Unity中如何将本地坐标转为世界坐标？**

我的回答：

使用transforminvice ，使用转换矩阵

答案：

1. 用本地坐标加上父对象相对世界的坐标（如果有多层父子关系，不停地往上加即可）
2. 利用Transform中的TransformPoint方法

**2. Unity中如何计算出两个向量之间的夹角，请说出两种方式**

我的回答：

向量点乘、

答案：

1. 利用Vector3中的API：Vector3.Angle
2. 先使用 Vector3.Dot 算出方向向量点乘结果，再通过Mathf.Acos反三角函数算出弧度，再将弧度转为角度

**3. 请写出UGUI中两种处理异形按钮的具体方法**

我的回答：

用不同大小的按钮拼凑，使用裁剪后的图片，再使用自定义事件为图片定义按钮点击事件

答案：

方法一：异形按钮，自带的像素检测阈值

方法二：异形按钮，通过子对象拼凑

**4. 请说出Unity中如何进行数据持久化，至少说出5种方式*

我的回答：

json ，xml，二进制，scriptableobject，

答案：

PlayerPrefs

2进制文件存储

xml文件存储

json文件存储

数据库存储（本地、远端、通过服务器存储到数据库）

**5. 在Unity中如何控制渲染优先级？（谁先渲染谁后渲染，分情况回答）**

可以在shader中定义渲染队列，

答案：
1. 不同摄像机渲染时，摄像机深度（Camera depth）控制优先级
2. 相同摄像机时，排序层级（Sorting Layer）控制优先级
3. 相同排序层级时，层中的顺序（Order in Layer）控制优先级
4. 相同摄像机，无排序层级属性时，Shader中的RenderQueue（渲染队列）控制优先级
