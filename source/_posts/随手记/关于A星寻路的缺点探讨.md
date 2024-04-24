---
title: 关于A星寻路的缺点探讨
categories:
  - 随手记
date: 2024-03-23 11:10
tags:
  - 随手记
  - 所想
series:
  - 随手记
---

## Reference

[云风的 BLOG: A* 算法之误区 (codingnow.com)](https://blog.codingnow.com/2006/07/astar.html)
[A* 算法简介 (redblobgames.com)](https://www.redblobgames.com/pathfinding/a-star/introduction.html)

## 正文

引用自:[云风的 BLOG: A* 算法之误区 (codingnow.com)](https://blog.codingnow.com/2006/07/astar.html)

>A\* 算法理论上 ~~是时间最优的~~ 可以得到最优解，不过我们可以通过选择一个更好的**估价函数**，或是减少解空间来提高性能。 A\* 算法最大的缺点就是，**空间需求**太大。我们可以用一些时间换空间的方法改进。但是如果不存在解（比如在寻路问题中，根本**不存在一条通达的路**），采用 A\* 算法求解，势必会**穷举**所有的可能。所以一般在游戏里，我们一般会采用额外的手法避免这个问题。

1. A\*寻路的**空间需求**

在A\*算法中,我们常用两个容器来保存**待遍历**的节点和**不需要遍历**的节点,这一点确实是用空间来换时间,如果节点数量过多,**空间消耗**是很大的。

2. **不存在解**

如果又不存在解的情况,A\*还是会遍历周围的格子节点,这就造成了不必要的消耗。

黄色是终点，蓝色是起点，尽管没有到达终点的路径，还是将**整个地图**都遍历了。

例如下图：

![](/images/posts/Pasted%20image%2020240323111752.png)

<center> 图1 不存在解 </center>

- **解决方案**

可以事先求得**终点**是否被包围，如果包围则，返回空。

3. **启发函数**的影响

**估价函数**的准确性影响搜索结果：估价函数的准确性会影响A星算法的最终结果，因此选择**合适**的估价函数很关键。

关于启发函数：[A* 算法简介 (redblobgames.com)](https://www.redblobgames.com/pathfinding/a-star/introduction.html)，观看以上文章了解，**曼哈顿**距离与**欧拉**距离