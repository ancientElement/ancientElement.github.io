---
tags:
---
# TileMap
注意: 
1. 创建完 `TileRule` 后要拖进画板里
2. `TileList` 里有顺序在前面的权重大于后面的

# RigidBody
注意: 
![请添加图片描述](/images/posts/037554277c5547f5a9a44d8cf56643e8.jpeg)
1. collosion Detection : 碰撞检测模式一般设为 continue 连续检测
2. Interpolate: 线性碰撞,也就是说使得碰撞有弹性的效果

# 材质 : 使得player不粘连在墙上
![请添加图片描述](/images/posts/f8d634b656fb4327ae5ff9de05bfcb02.jpeg)

这样设置一个 摩擦 和 弹性 为零的材质挂载到platfrom上

# 按键绑定: 更加便捷的方式![请添加图片描述](/images/posts/19b2bddd659f427f8cd7bcb56f1ccf22.jpeg)

![请添加图片描述](/images/posts/940b298197ea403285ca6c292c9a5a31.jpeg)
![请添加图片描述](/images/posts/6652e2b758874f64ab24114db745c9b9.jpeg)

通过以上方式绑定按键可以快速地在代码里获取按键

```csharp
if (Input.GetButton("Crouch"))
{
	Crouch();
}
else if (!Input.GetButton("Crouch") && isCrouch)
{
	Standup();
}
```

# 按键检测: 所有 GetButton 应该在update里调用
所以我们写一个 按键类 和 一个 单例按键 类
```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InputButton
{

    public KeyCode keyCode;

    public bool Down;
    public bool Up;
    public bool Hold;

    public InputButton(KeyCode keyCode)
    {
        this.keyCode = keyCode;
    }

    //更新按键状态
    public void Get()
    {
        this.Down = Input.GetKeyDown(keyCode);
        this.Up = Input.GetKeyUp(keyCode);
        this.Hold = Input.GetKey(keyCode);
    }

}
```
```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerInput : MonoBehaviour
{
    public static PlayerInput instance;

    #region 输入事件

    public InputButton crouch = new InputButton(KeyCode.S);//暂停

    #endregion


    private void Awake()
    {
        if (instance != null)
        {
            throw new System.Exception("PlayerInput 存在多个对象");
        }

        instance = this;

    }


    private void Update()
    {
        crouch.Get();
    }
}
```
这样我们将所有按键写在 `PlayerInput` 这个单例里 并且我们的 `GetButton` 都在 update 里调用了

# 物理: 所有与物理有关的放在update里调用
# 问题: FixedUpdate 只有50hz而 Update 按照帧率执行, Update 里的代码比 FixedUpdate 快,所以在按键获取时出错

* 按下 jump 后 jumpPressed 为 `true` ,故不再进入 if 语句内 jumpPressed 无法获得新值故 jumpPressed 一直为 `true` ,直到我们手动修改 jumpPressed 为 `false` ,才重新进入 if 语句 内
* ==注意== : 	1. 在执行完毕 `jumpPressed == true` 的操作后一定要将 `jumpPressed = false` 
* ==注意== : 	2. 在执行完毕 `JumpHeld == true` 的操作后也要要将 `jumpPressed = false` 
* 应为在JumpHeld之前jumpPress一定会为true,所以我们在 执行完毕 `JumpHeld == true` 的操作后将 `jumpPressed = false` ;
```csharp
private void Update()
    {
        if (!jumpPressed) // 按下 jump 后 jumpPressed 为 `true` ,故不再进入 if 语句内 jumpPressed 无法获得新值故 jumpPressed 一直为 `true` ,直到我们手动修改 jumpPressed 为 false ,才重新进入 if 语句 内
        {
            jumpPressed = Input.GetButtonDown("Jump");
        }
        jumpHeld = Input.GetButton("Jump");
        crouchHeld = Input.GetButton("Crouch");
    }
```

# 快捷的无需射线检测地面 Rigidbody2D.IsTouchingLayers
## Rigidbody2D.IsTouchingLayers
 public bool IsTouchingLayers (int layerMask= Physics2D.AllLayers);
## 参数
layerMask	其中任何层上的任何碰撞体均视为接触。
## 返回
bool 附加到该刚体的任何碰撞体是否正在接触指定 layerMask 上的任何碰撞体。

## 描述
检查附加到该刚体的任何碰撞体是否正在接触指定 layerMask 上的任何碰撞体。

请务必注意，检查碰撞体是否正在接触是对照上次物理系统更新进行的，即，当时接触碰撞体的状态。如果刚添加了新的 Collider2D，或者移动了 Collider2D，但尚未进行更新，则这些碰撞体不会显示正在接触。接触状态与物理碰撞或触发器回调所指示的状态相同。

```csharp
if(rbIsTouchingLayers(groundLayer)) {
	isGround = true;
}
```
# 封装Raycast
```csharp
 //射线检测与debug
    RaycastHit2D Raycast(Vector2 offset, Vector2 raycastDirction, float length, LayerMask layer)
    {
        Vector2 pos = transform.position;

        RaycastHit2D hit = Physics2D.Raycast(pos + offset, raycastDirction, length, layer);

        Color color = hit ? Color.red : Color.green;

        Debug.DrawRay(pos + offset, raycastDirction * length, color);

        return hit;
    }
```

# 调整环境光
![请添加图片描述](/images/posts/9d86a42bef90468aac6b4dd72e25fac7.jpeg)
调整环境光源的光强颜色....

# 动画状态机之: Blend Tree
* 由浮点型控制播放的一组动画 [详见官网](https://docs.unity3d.com/cn/2020.3/Manual/class-BlendTree.html)

![请添加图片描述](/images/posts/462629dd03c843a5a041df1f69f4414c.jpeg)
![请添加图片描述](/images/posts/1257de3122534b5193e3132bed777fb6.jpeg)

# TileMap: 没有 gameObject brush 
直接在官网 2d extra 下载对应版本再导入unity中

# Post Process: 特效
* 使用步骤
	1. 在 PakageManeger 下载 Post Process 
	2. 为MainCamera添加 Post Process Layer 组件
	3. 新建一个 PostProcessing 图层 ,并且将 Post Process Layer 组件中的 layer 设为 PostProcessing 图层
	![请添加图片描述](/images/posts/bba0f53cf2fa4e67842afa5bb8703409.jpeg)
	4. 新建一个空物体承载特效并且将该物体图层设为之前新建的 PostProcessing 图层,
	5. 为该物体添加 Post Process Volume 组件
	6.  Post Process Volume 组件中的 Profile 就是特效文件,我们可以新建特效,并且配置参数
	7. 红圈中的就是可配置的特效 : [具体见官网](https://docs.unity.cn/Packages/com.unity.postprocessing@3.2/manual/Ambient-Occlusion.html)
	

![请添加图片描述](/images/posts/78a166ab2bd84fe3be9afeb58a4e4a0b.jpeg)

# Cinemachine: 镜头晃动
* 让镜头有晃动效果
	1. 为主摄像机添加 CinemachineImpulseListener  监听晃动
	![请添加图片描述](/images/posts/6cf4e82b252346a39fdd92e238d8aca9.jpeg)
	2. 找到触发震动的元素为其添加  Cinemachine Collison Impulse Source  组件设为震动源
	![请添加图片描述](/images/posts/5361886c6d7143519af0ec21f9a4438d.jpeg)
	3. 为其添加震动效果 Raw Sigle 就是震动效果文件我们也可以自己创建(如果会的话 noize settings) , Amplitude Gain 是 震动幅度 , Frequency Gain 震动次数
	![请添加图片描述](/images/posts/8c9fcef8dbcd4708ad4973b73a5f5ead.jpeg)

# GameManager :游戏管理器
* 通过管理器管理各个游戏组成部分
* 我们可以通过游戏管理器来实现游戏的各个流程
* 调用游戏各个部分

# 陷阱系统: Trap Layer
* 为玩家添加 PlayerHealth 脚本 
* OnTriggerEnter2D 检测碰撞到的 Tigger 
* 然后我们把陷阱的 layer 都设为 Trap 这样玩家碰撞到 layer 为 Trap 的碰撞体就会触发掉血
```csharp
public class PlayerHealth : MonoBehaviour
{
    int trapLayer;
    public GameObject deathVFXfab;
    public GameObject deathPosfab;


    private void Start()
    {
        trapLayer = LayerMask.NameToLayer("Trap");
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.layer == trapLayer)
        {
            Instantiate(deathVFXfab, transform.position, transform.rotation);
            Instantiate(deathPosfab, transform.position, Quaternion.Euler(0, 0, UnityEngine.Random.Range(-45, 45)));
            AudioManager.PlayDeathAudio();
            gameObject.SetActive(false);
            //SceneManager.LoadSceneAsync(SceneManager.GetActiveScene().buildIndex);
            GameManager.PlayerDie();
        }
    }
}
```
# AudioManager: 音频管理器