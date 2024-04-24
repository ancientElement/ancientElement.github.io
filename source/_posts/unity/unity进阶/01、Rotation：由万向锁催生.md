---
tags: ["Unity进阶","Unity"]
categories:
  - unity
  - unity进阶
series: ["Unity进阶"]
date: 2023-06-17
title: 01、Rotation：由万向锁催生 /images/featured16.jpg
---
* unity面板里的rotation是欧拉角

* 非Vector3的transform.rotation是四元数Quaternion
* 由于欧拉角产生的万向锁导致旋转丢失自由度
* ![动图](/images/posts/v2-cabe060d9bebb30d976c7035164bcc75_b.gif)

* 我们可以看到当紫色与红色圈重合时 只有一个旋转方向 也就是Vector3.up与Verctor3.forword同轴时 

* 在unity中表现为x轴旋转90度

## 关于Rotaion的方法

### Quaternion的静态方法 `Quaternion.LookRotation()`

#### Declaration

`Quaternion.LookRotation(Vector3 direction,Vector3 upwards = Vector3.up)`

#### Params

`direction` : 朝向的向量

`upwards`   : 定义上方的向量 

例子:  由本身坐标看向cube坐标 `cube.transform.position - transform.position` 这句表示从自己到cube的向量

```cs
 transform.rotation = Quaternion.LookRotation(cube.transform.position - transform.position);
```

### Transfrom.Rotation()

#### Declaration

Transfrom.Rotation([Vector3](Vector3.html) **eulers**, [Space](Space.html) **relativeTo** = Space.Self)

#### Params

`eulers`: 一个欧拉角Vector3

例子: 设置一个物体的旋转用欧拉角

​	略

### [Transform](Transform.html).LookAt

#### Declaration

public void **LookAt**([Transform](Transform.html) **target**);

#### Declaration

public void **LookAt**([Transform](Transform.html) **target**, [Vector3](Vector3.html) **worldUp** = Vector3.up);

### Params

`target`: 朝向的目标

例子: 

```cs
   transform.LookAt(target, Vector3.left);
```

### [Transform](Transform.html).RotateAround

#### Declaration

public void **RotateAround**([Vector3](Vector3.html) **point**, [Vector3](Vector3.html) **axis**, float **angle**);

`point`: 围绕哪一个点

`axio` : 哪一个轴

`angle`: 角度
