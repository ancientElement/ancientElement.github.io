---
tags:
categories:
  - unity
  - 编辑器开发
  - 编辑器开发基础
  - 编辑器开发基础
  - 编辑器开发
  - Unity
series:
  - 编辑器开发基础
date: 2023-07-14
title: L01 基础Inspactor面板拓展 
---


**1.[ContextMenu()]  点击齿轮调用函数**

```cs
[ContextMenu("输出1")]
public void Debug1() {
    Debug.log(1);
}
```

**2.[ContextMenuItem("","")]给一个成员变量添加右键菜单**

**3.[Tooltip ("右键看看")]鼠标移动上去时显示的文字**

```cs
//给一个成员变量添加右键菜单
//第一个参数是菜单的名称
//第二个参数是右键点击的回调函数
[ContextMenuItem ("输出国家"，"OutCountry")]
[Tooltip ("右键看看")]//鼠标移动上去时显示的文字    
public string Country;
public void OutCountry ()
{
	Debug. Log (Country);
}
```

**4.[RequireComponent()]**

```cs
//关于类型和类名
//BoxCollider:是类名，适用于函数提供泛型方法
//typeof (BoxCol1ider): System. Type, C#的类型，适用于函数需要 System.Type 参数
//当前组件依赖于盒子碰撞体
//当前组件挂载在对象上时，盒子碰撞体会一起被添加上去
//当 Player 组件没有被移除时，盒子碰撞体不能被删除

[RequireComponent (typeof (BoxCollider))]
```

**5.[ExecuteInEditMode]**

```cs
//使生命周期函数，在编辑器状态下可以执行，游戏中也可以正常使用
//Update()在场景中对象发生变化或项目组织发生变化时会在编辑器下执行
[ExecuteInEditMode]
```

**6.[AddComponentMenu("",)]**

```cs
//将 Player?组件添加到 AddComponent 上
//第一个参数：分类名/组件名
//第二个参数：列表中显示的顺序
[AddComponentMenu ("自定义控制器/玩家控制器"，1)]
```

**7.单选我们使用十进制理解，即不同数代表不同选项**

```cs
public enum PlayerProfression 
{
	Warrior =0, Wizard 1
}
```

**8.多选使用二进制理解，即不同位代表不同选项**

```cs
public enum PlayerLoveColor
{
	Green 1, Red =2, Pink 4
}
```


