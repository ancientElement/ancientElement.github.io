---
tags:
---
# layer的碰撞层

![图层碰撞](/images/posts/layerCollider.jpg)



# 刚体加力

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Lesson17 : MonoBehaviour
{
    //声明一个成员变量，用来装获取到的刚体组件
    Rigidbody rigid;

    void Start()
    {
        //首先应该获取刚体组件,然后才能对这个刚体组件加力
        rigid = this.GetComponent<Rigidbody>();


        //1.Acceleration
        //  给物体增加一个持续的加速度，忽略其质量
        //  v = Ft/m
        //  F：(0,0,10)
        //  t：0.02s
        //  m：默认为1
        //  v = 10 * 0.02 / 1 = 0.2m/s
        //  每物理帧移动 0.2m/s * 0.02 = 0.004m
        rigid.AddForce(Vector3.forward * 10, ForceMode.Acceleration);

        //2.Force
        //  给物体添加一个持续的力，与物体的质量有关
        //  v = Ft/m
        //  F：(0,0,10)
        //  t：0.02s
        //  m：2kg
        //  v = 10 * 0.02 / 2 = 0.1m/s
        //  每物理帧移动 0.1m/s * 0.02 = 0.002m
        rigid.AddForce(Vector3.forward * 10, ForceMode.Force);

        //3.Impulse
        //  给物体添加一个瞬间的力，与物体的质量有关，忽略时间 默认为1
        //  v = Ft/m
        //  F：(0,0,10)
        //  t：默认为1
        //  m：2kg
        //  v = 10 * 1 / 2 = 5m/s
        //  每物理帧移动 5m/s * 0.02 = 0.1m
        rigid.AddForce(Vector3.forward * 10, ForceMode.Impulse);

        //4.VelocityChange
        //  给物体添加一个瞬时速度，忽略质量(默认1)、忽略时间(默认1)
        //  v = Ft/m
        //  F：(0,0,10)
        //  t：默认为1
        //  m：默认为1
        //  v = 10 * 1 / 1 = 10m/s
        //  每物理帧移动 10m/s * 0.02 = 0.2m
        rigid.AddForce(Vector3.forward * 10, ForceMode.VelocityChange);
    }
}
```

# 射线

## 声明

public static bool **Raycast**([Vector3](https://docs.unity3d.com/ScriptReference/Vector3.html) **origin**, [Vector3](https://docs.unity3d.com/ScriptReference/Vector3.html) **direction**, out [RaycastHit](https://docs.unity3d.com/ScriptReference/RaycastHit.html) **hitInfo**, float **maxDistance**, int **layerMask**, [QueryTriggerInteraction](https://docs.unity3d.com/ScriptReference/QueryTriggerInteraction.html) **queryTriggerInteraction**);

### Parameters

| origin         | 世界坐标中射线的起点。                                       |
| -------------- | ------------------------------------------------------------ |
| direction      | 光线的方向。                                                 |
| hitInfo        | 如果返回 true，将包含有关最近碰撞体被击中的位置的更多信息。（另见：[RaycastHit](https://docs.unity3d.com/ScriptReference/RaycastHit.html)）。`hitInfo` |
| 最大距离       | 光线应检查碰撞的最大距离。                                   |
| layerMask      | [一种图层蒙版](https://docs.unity3d.com/Manual/Layers.html)，用于在投射光线时选择性地忽略碰撞体。 |
| 查询触发器交互 | 指定此查询是否应命中触发器。                                 |

# RaycastHit.nomalize

光线击中的表面的法线。



# [Vector3](https://docs.unity3d.com/ScriptReference/Vector3.html).ProjectOnPlane

![IMG_0062](/images/posts/IMG_0062.PNG)

## Declaration

public static [Vector3](https://docs.unity3d.com/ScriptReference/Vector3.html) **ProjectOnPlane**([Vector3](https://docs.unity3d.com/ScriptReference/Vector3.html) **vector**, [Vector3](https://docs.unity3d.com/ScriptReference/Vector3.html) **planeNormal**);

### Parameters

| planeNormal | 从矢量到平面的方向。   |
| ----------- | ---------------------- |
| vector      | 矢量在平面上方的位置。 |

### Returns

**Vector3** 矢量在平面上的位置。

### Description

将矢量投影到由与平面正交的法线定义的平面上。

[Vector3](https://docs.unity3d.com/ScriptReference/Vector3.html) 将给定[矢量](https://docs.unity3d.com/ScriptReference/Vector3-vector.html)的位置存储在 3D 空间中。第二个 [Vector3](https://docs.unity3d.com/ScriptReference/Vector3.html) 由 [planeNormal](https://docs.unity3d.com/ScriptReference/Vector3-planeNormal.html) 给出，它定义了从平面到通过原点的[矢量](https://docs.unity3d.com/ScriptReference/Vector3-vector.html)的方向。[Vector3.ProjectOnPlane](https://docs.unity3d.com/ScriptReference/Vector3.ProjectOnPlane.html)使用两个Vector3值生成[矢量](https://docs.unity3d.com/ScriptReference/Vector3-vector.html)在平面[法线](https://docs.unity3d.com/ScriptReference/Vector3-planeNormal.html)方向上的位置，并返回[Vector3](https://docs.unity3d.com/ScriptReference/Vector3.html)在平面上的位置。



## 例子

```csharp
 private Vector3 GetSlopeMoveDirection()
    {
        return Vector3.ProjectOnPlane(moveDirection, slopeHit.normal);
    }
```



![IMG_0061](/images/posts/IMG_0061-1681547068141-14.PNG)

# 计算角度平面Vector3.Angle(Vector3.up, slopeHit.normal)

![Snipaste_2023-03-14_17-38-36](/images/posts/Snipaste_2023-03-14_17-38-36.jpg)

## Declaration

public static float **Angle**([Vector3](https://docs.unity3d.com/ScriptReference/Vector3.html) **from**, [Vector3](https://docs.unity3d.com/ScriptReference/Vector3.html) **to**);

### Parameters

| from | 测量角度差的矢量。 |
| ---- | ------------------ |
| to   | 测量角度差的矢量。 |

### Returns

**float** 两个向量之间的角度（以度为单位）。

### Description

计算来自 and 的向量之间的角度。

返回的角度是从第一个矢量到第二个矢量的旋转角度，当将这两个矢量输入视为方向时。
注意：返回的角度将始终介于 0 到 180 度之间，因为该方法返回矢量之间的最小角度。也就是说，它永远不会返回反射角。

# 矢量的模[Vector3](https://docs.unity3d.com/ScriptReference/Vector3.html).magnitude

Leave feedback

public float **magnitude**;

### Description

返回此矢量的长度（只读）。

向量的长度是 的平方根。

如果您只需要比较某些向量的大小，则可以比较它们的平方大小 使用 [sqrMagnitude](https://docs.unity3d.com/ScriptReference/Vector3-sqrMagnitude.html)（计算平方幅度更快）。

See Also: [sqrMagnitude](https://docs.unity3d.com/ScriptReference/Vector3-sqrMagnitude.html).`(x*x+y*y+z*z)`

# 刚体冻结

```csharp
//冻结rotation
        thisRigidBody.constraints = RigidbodyConstraints.FreezeRotation;
        //冻结rotation的x轴方向的旋转
        thisRigidBody.constraints = RigidbodyConstraints.FreezeRotationX;
        //冻结rotation的y轴方向的旋转
        thisRigidBody.constraints = RigidbodyConstraints.FreezeRotationY;
        //冻结rotation的z轴方向的旋转
        thisRigidBody.constraints = RigidbodyConstraints.FreezeRotationZ;
        //冻结position
        thisRigidBody.constraints = RigidbodyConstraints.FreezePosition;
        //冻结position的x轴方向的移动
        thisRigidBody.constraints = RigidbodyConstraints.FreezePositionX;
        //冻结position的y轴方向的移动
        thisRigidBody.constraints = RigidbodyConstraints.FreezePositionY;
        //冻结position的z轴方向的移动
        thisRigidBody.constraints = RigidbodyConstraints.FreezePositionZ;
        //冻结position和rotation
        thisRigidBody.constraints = RigidbodyConstraints.FreezeAll;
        //什么都不冻结
        thisRigidBody.constraints = RigidbodyConstraints.None;
        //冻结除了rotation的X轴之外其他所有
        thisRigidBody.constraints = ~RigidbodyConstraints.FreezeRotationX;

```

# 2d物理材质

通过创建 `2dphysicsMaterial` 来设置摩擦力与弹力

![2d物理材质](/images/posts/2dphicsMat.jpg)

![2d物理材质1](/images/posts/2dphicsMat1.jpg)

friction 摩擦力

bounciness 弹力

挂载在 碰撞器上

![2d物理材质2](/images/posts/2dphicsMat2.jpg)

# 移动Vector3.MoveTowards

```csharp
followTarget.position = Vector3.MoveTowards(followTarget.position, transform.position - followTargetOffset, 0.01f);
```

赋给一个物体的位置

参数: 1.开始位置

​	2.结束位置

​	3.速度

# TextMeshPro的组件获取

## 有`TextMeshPro`的组件类型都是 `TMP_` 开头的



### 例子 获取到TextMeshPro-Text

```csharp
styleObj.transform.Find("Context").GetComponent<TMP_Text>().text = context;
```



# 设置状态机

##  animator.SetBool(string params, bool true);

```csharp
 animator.SetBool(string params, bool true);
```

# Debug射线方法

```csharp
Debug.DrawLine(transform.position + Vector3.up, transform.position + Vector3.down * 0.2f, Color.red);
```

# PlatformEffector

## 有特定方向的碰撞体

### 补充:层级操作符

LayerMask mask = 1 << 3；表示开启Layer3。

LayerMask mask = 0 << 8；表示关闭Layer8。

LayerMask mask = 1<<1|1<<9；表示开启Layer1和Layer9。

LayerMask mask = 0<<4|0<<5；表示关闭Layer4和Layer5。

LayerMask mask = ~(1 << 0) 打开所有的层。

LayerMask mask = ~(1 << 9) 打开除了第9之外的层。
