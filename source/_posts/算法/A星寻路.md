---
title: A星寻路
date: 2024-02-10
tags:
  - 随手记
  - 寻路
  - A星
  - 所想
---
参考:
- [A-Star（A*）寻路算法原理与实现 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/385733813)
- [Introduction to the A* Algorithm --- A* 算法简介 (redblobgames.com)](https://www.redblobgames.com/pathfinding/a-star/introduction.html)想学的去看这个文章,我写的是一坨狗屎
- [最短路径算法-迪杰斯特拉(Dijkstra)算法 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/346558578)

>简而言之,所有的路径搜索算法都是,找到**相邻节点**去往终点**代价最小**的节点
>而GreakBFS和$A^*$\的区别只在,**预估代价**上做了文章

这图做的**真他妈的好**,这作者真的是造福广大群众

![](/images/posts/Pasted%20image%2020240215181219.png)

## 基本法则

1.  寻路消耗公式
	f(寻路消耗) = g(实际走过的距离) +h(离终点的距离)
2. 开启列表
3. 关闭列表
4. 格子对象的父对象

## 过程描述

```
* 初始化open_set和close_set；
* 将起点加入open_set中，并设置优先级为0（优先级最高）；
* 如果open_set不为空，则从open_set中选取优先级最高的节点n：
    * 如果节点n为终点，则：
        * 从终点开始逐步追踪parent节点，一直达到起点；
        * 返回找到的结果路径，算法结束；
    * 如果节点n不是终点，则：
        * 将节点n从open_set中删除，并加入close_set中；
        * 遍历节点n所有的邻近节点：
            * 如果邻近节点m在close_set中，则：
                * 跳过，选取下一个邻近节点
            * 如果邻近节点m也不在open_set中，则：
                * 设置节点m的parent为节点n
                * 计算节点m的优先级
                * 将节点m加入open_set中
```