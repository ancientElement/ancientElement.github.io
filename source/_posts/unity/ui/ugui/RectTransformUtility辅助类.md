---
tags: ["UGUI","UI","Unity"]
categories:
  - unity
  - ui
  - ugui
series: ["UGUI"]
date: 2023-04-13
title: RectTransformUtility辅助类 
---
知识点一 :`RectTransformUtility `类
RectTransformUtility 公共类是一个 RectTransform 的辅助类主要用于进行一些坐标的转换等等操作
其中对于我们目前来说最重要的函数是将屏幕空间上的点，转换成` UI` 本地坐标下的点

知识点二: 将屏幕坐标转换为` UI` 本地坐标系下的方法：
`RectTransformUtility. ScreenPointToLocalPointInRectangle`
参数一：相对父对象
参数二：屏幕点
参数三：摄像机
参数四：最终得到的点一般配合拖拽事件使用


