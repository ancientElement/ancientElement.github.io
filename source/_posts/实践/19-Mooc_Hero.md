---
tags:
categories:
  - 实践
  - 实践的一点东西
series:
  - 实践的一点东西
date: 2022-06-13
title: 19-Mooc_Hero 
---
# Mooc Hero 1

## 第四单元

### Project2:地形系统

现在的地形系统与之前命名稍有不同新版为下图,旧版为PPT所示	

![image-20230602020352247](/images/posts/image-20230602020352247.png)



![image-20230602015508345](/images/posts/image-20230602015508345.png)





![image-20230602015652899](/images/posts/image-20230602015652899.png)

对应 Raise or Lower Terrain



![image-20230602020056170](/images/posts/image-20230602020056170.png)

对应Set Height



![image-20230602020912174](/images/posts/image-20230602020912174.png)

未变化



![image-20230602021306388](/images/posts/image-20230602021306388.png)

![image-20230602021327204](/images/posts/image-20230602021327204.png)

![image-20230602021810090](/images/posts/image-20230602021810090.png)

第一张Texture自动应用到地形系统,第二张Texture用于绘制



![image-20230602021415061](/images/posts/image-20230602021415061.png)

![image-20230602021923898](/images/posts/image-20230602021923898.png)

![image-20230602022006799](/images/posts/image-20230602022006799.png)

 

![image-20230602022630280](/images/posts/image-20230602022630280.png)

![image-20230602022646173](/images/posts/image-20230602022646173.png)



![image-20230602022714836](/images/posts/image-20230602022714836.png)

![image-20230602022816994](/images/posts/image-20230602022816994.png)

![image-20230602022845427](/images/posts/image-20230602022845427.png)



















# Mooc Hero 2

## 第一单元

### L01 寻路导航

一、生成导航网格

第一步 

标记场景中用于生成导航网格的物体

第二步 

在 Navigation 

视图中点击 bake 按钮

![image-20230601204949108](/images/posts/image-20230601204949108.png)



二、生成导航对象

![image-20230601205508686](/images/posts/image-20230601205508686.png)

![image-20230601205657548](/images/posts/image-20230601205657548.png)

烘培代理就是玩家对象

注意：烘焙代理的最大爬坡角度不能够超过60度



![image-20230601210350205](/images/posts/image-20230601210350205.png)



![image-20230601210405101](/images/posts/image-20230601210405101.png)



三、传送

![image-20230601210441938](/images/posts/image-20230601210441938.png)

![image-20230601210519034](/images/posts/image-20230601210519034.png)

![image-20230601210709605](/images/posts/image-20230601210709605.png)

出现箭头可通行



![image-20230601210725841](/images/posts/image-20230601210725841.png)



四、障碍物

![image-20230601210816610](/images/posts/image-20230601210816610.png)

![image-20230601210832469](/images/posts/image-20230601210832469.png)



五、导航代理

![image-20230601212150983](/images/posts/image-20230601212150983.png)

![image-20230601212220296](/images/posts/image-20230601212220296.png)

防止代理对象发生碰撞



![image-20230601212257921](/images/posts/image-20230601212257921.png)

![image-20230601212322517](/images/posts/image-20230601212322517.png)

勾选Auto Braking 代理到达destination前自动减速



![image-20230601212420123](/images/posts/image-20230601212420123.png)

![image-20230601212450765](/images/posts/image-20230601212450765.png)

![image-20230601212504312](/images/posts/image-20230601212504312.png)

躲避其他代理



![image-20230601212549035](/images/posts/image-20230601212549035.png)

![image-20230601212656552](/images/posts/image-20230601212656552.png)

Priority 躲避概率 值越大越可能躲避



### L02 AI

一、概述

![image-20230601223912836](/images/posts/image-20230601223912836.png)

![image-20230601224056873](/images/posts/image-20230601224056873.png)

![image-20230601224105947](/images/posts/image-20230601224105947.png)

![image-20230601224116357](/images/posts/image-20230601224116357.png)

![image-20230601224129690](/images/posts/image-20230601224129690.png)

![image-20230601224201916](/images/posts/image-20230601224201916.png)

![image-20230601224210937](/images/posts/image-20230601224210937.png)

二、感知能力

![image-20230601224413779](/images/posts/image-20230601224413779.png)

![image-20230601224356244](/images/posts/image-20230601224356244.png)

![image-20230601224510011](/images/posts/image-20230601224510011.png)

![image-20230601224529409](/images/posts/image-20230601224529409.png)

![image-20230601224544076](/images/posts/image-20230601224544076.png)

![image-20230601224553822](/images/posts/image-20230601224553822.png)

![image-20230601224950530](/images/posts/image-20230601224950530.png)

![image-20230601225005801](/images/posts/image-20230601225005801.png)

![image-20230601225137076](/images/posts/image-20230601225137076.png)

![image-20230601225214270](/images/posts/image-20230601225214270.png)

![image-20230601225222717](/images/posts/image-20230601225222717.png)

三、实现方法

![image-20230601224210937](/images/posts/image-20230601224210937.png)

![image-20230601225312759](/images/posts/image-20230601225312759.png)

![image-20230601225330207](/images/posts/image-20230601225330207.png)

![image-20230601225513759](/images/posts/image-20230601225513759.png)

![image-20230601225533243](/images/posts/image-20230601225533243.png)

![image-20230601225801976](/images/posts/image-20230601225801976.png)

![image-20230601225840719](/images/posts/image-20230601225840719.png)

![image-20230601225906650](/images/posts/image-20230601225906650.png)

![image-20230601225956089](/images/posts/image-20230601225956089.png)

![image-20230601230102171](/images/posts/image-20230601230102171.png)

![image-20230601230357883](/images/posts/image-20230601230357883.png)

![image-20230601230500630](/images/posts/image-20230601230500630.png)

![image-20230601230532247](/images/posts/image-20230601230532247.png)

![image-20230601230612449](/images/posts/image-20230601230612449.png)

![image-20230601230631643](/images/posts/image-20230601230631643.png)

![image-20230601230654341](/images/posts/image-20230601230654341.png)

![image-20230601230705104](/images/posts/image-20230601230705104.png)