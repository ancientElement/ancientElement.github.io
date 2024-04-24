---
title: 实时光照对DrawCall的影响
categories:
  - 随手记
date: 2024-03-23 12:34
tags:
  - 随手记
  - 所想
series:
  - 随手记
---

>版权声明：本文为leonwei原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接和本声明。
>原文链接：https://blog.csdn.net/leonwei/article/details/51890474

1.正常情况下，用最简单的光照或**无光照**的shader渲染一个mesh，**一个**dc 。

2.unity5对烘焙做了修改，烘焙的物体仍然可以接受**实时光**，这样如果烘焙的物体再受一个实时光，那就是**2个**dc，unity4不是。

3.**多一盏**实时光，就会**多一个**drawcall，如果使用了**deferred shading**，则不一样，一些光源会被合并到后面计算，dc会合并减少。

4.开了**实时阴影**，会根据情况增加2-4个drawcall，这和cascade的使用有关，如果没有cascade，就是加两个，如果开了cascade，某些物体的阴影可能会绘制多遍，最多增加4个drawcall。

5.当然增加了**摄像机**，增加了**渲染次数**这些肯定会增加drawcall。


所以这里面，实时阴影对drawcall的增加是翻倍的，尽量更少的使用实时阴影，实时反射这些东西。