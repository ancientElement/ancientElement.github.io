---
title: Cinemachine的疯狂抖动
date: 2024-01-02
tags:
  - ATCNetGame
---
## 原因
相机抖动通常是由于相机和角色之间的位置关系不稳定导致的。例如角色位置更新频率与相机更新频率对应不上。
## 解决
在Cinemachine中可以设置跟随目标的权重和更新频率，需要点一下下图中的小齿轮
![](/images/posts/Pasted%20image%2020240102143041.png)

Cinemachine会为你生成一个带有下面脚本的游戏对象，更改权重和更新频率，调整到最佳
![](_images/Pasted%20image%2020240102143333.png)