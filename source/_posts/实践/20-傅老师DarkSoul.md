---
tags:
categories:
  - 实践
  - 实践的一点东西
series:
  - 实践的一点东西
date: 2023-06-27
title: 20-傅老师DarkSoul 
---
	# 输入模块

## playerInput 键盘输入(后改为KeyBroadInput)

### **playerInput.cs 键盘模拟摇杆信号**

```cs
 #region 左摇杆 上下左右 二维向量
//二轴向转化
targetDup = (Input.GetKey(keyUp) ? 1 : 0) - (Input.GetKey(keyDown) ? 1 : 0);//纵轴
targetDright = (Input.GetKey(keyRight) ? 1 : 0) - (Input.GetKey(keyLeft) ? 1 : 0);//横轴

if (inputEnable == false)//是否开启输入
{
    targetDup = 0;
    targetDright = 0;
}

//平滑过渡
Dup = Mathf.SmoothDamp(Dup, targetDup, ref DupVerlocity, 0.1f);
Dright = Mathf.SmoothDamp(Dright, targetDright, ref DrightVerlocity, 0.1f);

//方形映射到圆形
Vector2 tempDAxis = SqareToCircle(new Vector2(Dup, Dright));
float Dup2 = tempDAxis.x;
float Dright2 = tempDAxis.y;

//输入模长
Dmag = Mathf.Sqrt((Dup2 * Dup2) + (Dright2 * Dright2));
//输入方向
Dvec = transform.right * Dright2 + transform.forward * Dup2;
#endregion  上下左右
```

#### **方形转化成圆形**

```cs
private Vector2 SqareToCircle(Vector2 input)
{
    Vector2 output = Vector2.zero;

    output.x = input.x * Mathf.Sqrt(1 - input.y * input.y / 2);
    output.y = input.y * Mathf.Sqrt(1 - input.x * input.x / 2);

    return output;
}
```

#### **方形与圆形转换**

![image-20230602235401992](/images/posts/image-20230602235401992%201.png)



### **playerInput.cs 键盘长按与触发信号**

```cs
#region 奔跑 长按
run = Input.GetKey(keyA);
#endregion 奔跑

#region 跳跃 触发
bool newJump = Input.GetKey(keyB);
if (newJump != lastJump && newJump == true)//取按下的哪次
    jump = true;
else
    jump = false;
lastJump = newJump;
#endregion 跳跃

#region 攻击 触发
bool newAttack = Input.GetKey(keyC);
if (newAttack != lastAttack && newAttack == true)//取按下的哪次
    attack = true;
else
    attack = false;
lastAttack = newAttack;
#endregion 攻击
```

触发信号可以参考此图

![image-20230605120856643](/images/posts/image-20230605120856643.png)

### 控制输入是否开启

```cs
if (inputEnable == false)//是否开启输入
{
    targetDup = 0;
    targetDright = 0;
}
```

## JoystickInput 手柄输入

> 是基于PlayerInput的修改

![image-20230605124007952](/images/posts/image-20230605124007952.png)

![image-20230605124228033](/images/posts/image-20230605124228033.png)

![image-20230605124352295](/images/posts/image-20230605124352295.png)



## 抽象输入信号IUserInput

将playerInput和joystickInput相同部分抽象为接口类IUserInput

```cs
public abstract class IUserInput : MonoBehaviour
{
    [Header("是否开启移动")] public bool inputEnable;

    #region 输入参数
    [Header("====== 移动前后左右 左摇杆 ======")]
    public float Dup;//产生的横轴Horizontal 平滑输入
    public float Dright;//产生的纵轴Vertical 平滑输入

    public float Dmag;//输入模长
    public Vector3 Dvec;//输入方向

    protected float targetDup;//源输入
    protected float targetDright;//源输入
    protected float DupVerlocity;//由Mathf.SmoothDamp控制的值
    protected float DrightVerlocity;//由Mathf.SmoothDamp控制的值
    [Header("===== 视角 右摇杆=====")]
    public float Jup;//产生的横轴Horizontal 平滑输入
    public float Jright;//产生的纵轴Vertical 平滑输入

    [Header("====== 奔跑 ======")]
    //1.pressing signle 长按信号
    public bool run;
    [Header("====== 跳跃 ======")]
    //2.trigger once single 触发信号
    public bool jump;
    protected bool lastJump;//上次jumo用于判断trigger
                          //3.double triggle
    [Header("====== 攻击 ======")]
    //2.trigger once single 触发信号
    public bool attack;
    protected bool lastAttack;//上次jumo用于判断trigger
    [Header("====== 举盾 ======")]
    //2.trigger once single 触发信号
    public bool defanse;
    #endregion 输入参数

    protected Vector2 SqareToCircle(Vector2 input)
    {
        Vector2 output = Vector2.zero;

        output.x = input.x * Mathf.Sqrt(1 - input.y * input.y / 2);
        output.y = input.y * Mathf.Sqrt(1 - input.x * input.x / 2);

        return output;
    }
}
```

这样只要获取IUserInput就可以获得信号输入,在获取IUserInput时获取激活的那个输入方式即可

![image-20230606012426573](/images/posts/image-20230606012426573.png)



## 抽象按键类MyButton

记录和更新按键全部状态

```cs
using System.Collections;
using UnityEngine;

/// <summary>
/// 按键类记录按键状态
/// </summary>
public class MyButton : MonoBehaviour
{
    /// <summary>
    /// 长按
    /// </summary>
    public bool IsPressing = false;
    /// <summary>
    /// 按下
    /// </summary>
    public bool OnPressed = false;
    /// <summary>
    /// 抬起
    /// </summary>
    public bool OnReleased = false;

    private bool curState = false;
    private bool lastState = false;

    public void Tick(bool input)
    {
        curState = input;

        #region 长按
        IsPressing = curState;
        #endregion 长按

        #region 按下与抬起
        OnPressed = false;
        OnReleased = false;
        if (curState != lastState)
        {
            if (curState)
            {
                OnPressed = true;//按下
            }
            else
            {
                OnReleased = true;//抬起
            }
        }
        lastState = curState;
        #endregion 按下与抬起
    }
}
```

在**joystickInput**中做如下更新(对playerInput可以做相同处理)

![image-20230606014751094](/images/posts/image-20230606014751094.png)

![image-20230606014701826](/images/posts/image-20230606014701826.png)

相比之前代码简洁很多

![image-20230606014847734](/images/posts/image-20230606014847734.png)

# 角色控制模块

> 这个部分傅老师使用RigidBody来控制角色移动,只有部分动画用RootMotion控制移动

## **移动**

使用为刚体速度赋值来控制移动,并且设置==突发力==相加可以很好的应对需要突发力的情况

```cs
private void FixedUpdate()
{
    //刚体移动
    //rigid.position += planarVec * Time.fixedDeltaTime;
    rigid.position += deltaPos;//加上rootmotion的移动
    rigid.velocity = new Vector3(planarVec.x, rigid.velocity.y, planarVec.z) + thrustVec;
    thrustVec = Vector3.zero;//突发力清零
    deltaPos = Vector3.zero;//rootmotion的移动量清零
}
```

## **状态控制**

王家控制脚本接受动画事件发送的信息调用函数,目前写了以下动画事件分别用于 `动画进入调用函数` `动画退出调用函数` `动画进行中调用函数` `动画进入清除Trigger`  `动画退出清除Trigger`

![image-20230605121055758](/images/posts/image-20230605121055758.png)

**FSMClearSignals**

```cs
/// <summary>
/// 清空累计Trigger
/// </summary>
public class FSMClearSignals : StateMachineBehaviour
{
    public string[] ClearAtEnter;
    public string[] ClearAtExit;
    override public void OnStateEnter(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        //进入时清空trigger
        foreach (var item in ClearAtEnter)
        {
            animator.ResetTrigger(item);
        }
    }

    override public void OnStateExit(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        //退出时清空trigger
        foreach (var item in ClearAtExit)
        {
            animator.ResetTrigger(item);
        }
    }
}
```

**FSMOnEnter**

```cs
/// <summary>
/// 动画进入时调用
/// TODO:浪费资源的做法  animator.gameObject.SendMessageUpwards(message);
/// </summary>
public class FSMOnEnter : StateMachineBehaviour
{
    public string[] OnEnterMessage;
    //发送消息给播放动画的游戏对象 调用OnEnterMessage里名字的函数
    override public void OnStateEnter(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        foreach (var message in OnEnterMessage)
        {
            animator.gameObject.SendMessageUpwards(message);
        }
    }
}
```

**FSMOnExit**

```cs
/// <summary>
/// 动画退出时调用
/// TODO:浪费资源的做法  animator.gameObject.SendMessageUpwards(message);
/// </summary>
public class FSMOnExit : StateMachineBehaviour
{
    public string[] OnExitMessage;

    override public void OnStateExit(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        foreach (var message in OnExitMessage)
        {
            animator.gameObject.SendMessageUpwards(message);
        }
    }
}
```

**FSMOnUpdate**

```cs
/// <summary>
/// 动画更新时调用
/// </summary>
public class FSMOnUpdate : StateMachineBehaviour
{
    public string[] onUpdateMessage;
 
    override public void OnStateUpdate(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {
        foreach (var item in onUpdateMessage)
        {
            animator.gameObject.SendMessageUpwards(item);
        }
    }
}
```
**动画调用函数**

```cs
//进入跳跃动画
private void OnJumpEnter()
{
    thrustVec = new Vector3(0, jumpVelocity, 0);
    pi.inputEnable = false;//开始跳跃不能操作移动
    lockPlanar = true;//锁定移动方向跳跃冲量
}
//退出跳跃动画
private void OnJumpExit()
{
}
//在地面
private void IsGround()
{
    anim.SetBool(isGroundHash, true);
}
//不在地面
private void IsNotGround()
{
    anim.SetBool(isGroundHash, false);
}
```

![image-20230605121957190](/images/posts/image-20230605121957190.png)



**清理累计Tigger信号**

![image-20230605122110691](/images/posts/image-20230605122110691.png)

## 需要RootMotion的时候

在模型上挂载脚本**RootMotionController**用以接管RootMotion,此脚本发出信号调用OnUpdateRM函数,并传送`anim.deltaPosition`

```cs
public class RootMotionController : MonoBehaviour
{
    private Animator anim;

    private void Awake()
    {
        anim = GetComponent<Animator>();
    }

    private void OnAnimatorMove()
    {
        SendMessageUpwards("OnUpdateRM", anim.deltaPosition);//将deltaPosition送出去
    }
}
```

在脚本**ActorController**中 在需要的动画状态加上RootMotion

```cs
 private void FixedUpdate()
{
    //刚体移动
    //rigid.position += planarVec * Time.fixedDeltaTime;
    rigid.position += deltaPos;//加上rootmotion的移动
    rigid.velocity = new Vector3(planarVec.x, rigid.velocity.y, planarVec.z) + thrustVec;
    thrustVec = Vector3.zero;//突发力清零
    deltaPos = Vector3.zero;//rootmotion的移动量清零
}

public void OnUpdateRM(object _deltaPos)
{
    if (CheckState("attack1hC", "Attack Layer"))
        deltaPos += (Vector3)(_deltaPos);//得到rootmotion的
}
```

## 检测动画状态

用此函数检测动画在哪一个状态

```cs
  private bool CheckState(string stateName, string layerName = "Base Layer")
{
    //int layer = anim.GetLayerIndex(layerName);
    //bool flag = anim.GetCurrentAnimatorStateInfo(layer).IsName(stateName);
    return anim.GetCurrentAnimatorStateInfo(anim.GetLayerIndex(layerName)).IsName(stateName);
}
```



# 傅老师曰

### 傅老师曰: 约好 在awack里 getcomponent



### 傅老师曰: 写两个工具在动画里调用函数

1.FSM Clear Signal 清除写入的Trigger,这样就不会累计触发困扰你了

![image-20230603123552803](/images/posts/image-20230603123552803%201.png)

2. FSM On Enter 和 FSM On Exit

   在动画进入与退出时调用函数



### 傅老师曰: 在动画过渡时另一个过渡触发

![image-20230603121117238](/images/posts/image-20230603121117238%201.png)

### 傅老师曰: 平滑过渡攻击动画

使用平滑设置权重的方式过渡攻击到Idle状态

![image-20230605122444772](/images/posts/image-20230605122444772.png)

### 手柄对应button

![image-20230605013258358](/images/posts/image-20230605013258358%201.png)

![image-20230605013427973](/images/posts/image-20230605013427973%201.png)

![image-20230605020716521](/images/posts/image-20230605020716521%201.png)

### 傅老师曰: 获得输入的signal应该这样

太多了见 Dark Soul 的PlayerInput和JoysticInput吧。 

### 动画更新模式: 

选择Animate Physic是以获得更好的动画柔顺程度

![image-20230605140318220](/images/posts/image-20230605140318220.png)

### 傅老师曰: 晃动方程式

![image-20230605140941077](/images/posts/image-20230605140941077.png)

### 动画过渡判定区域 
这两个蓝色的区域决定了可以触发到下一个阶段的判断区域,蓝色区域越大判定区域越大

![image-20230605163251371](/images/posts/image-20230605163251371.png)

![image-20230606111111039](/images/posts/image-20230606111111039.png)

![image-20230606223907004](/images/posts/image-20230606223907004.png)

### 动画状态的Tag

![image-20230609124900567](/images/posts/image-20230609124900567.png)
