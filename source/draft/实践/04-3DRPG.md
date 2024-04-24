---
tags:
---
# 配置渲染管线
* 2021版本
1. 在packge manager 里下载 Universal PR 包
2. 创建 UPR 渲染管线设置
![请添加图片描述](/images/posts/d328c197478649f98412b7c0bab8f392.jpeg)
3. 配置渲染管线
![请添加图片描述](/images/posts/85225a0dd877413983da4371a6ad54aa.jpeg)![请添加图片描述](/images/posts/332c64be7baf411a9134ee4c93f4f2e0.jpeg)

4. 导入其他包的 UPR 支持包(如果有的话)
5. 升级当前场景的素材 ![请添加图片描述](/images/posts/fd9111ab31e94ad38928e77c4359df65.jpeg)
![请添加图片描述](/images/posts/21978744ce454261a2f6742e2d1e7dfb.jpeg)

# Raycast: 射线检测
## 第一个重要重载: 无需传入射线
###  Physics.Raycast

public static bool Raycast (Vector3 `origin`, Vector3 `direction`, float maxDistance= Mathf.Infinity, int layerMask= DefaultRaycastLayers, QueryTriggerInteraction queryTriggerInteraction= QueryTriggerInteraction.UseGlobal);
### 参数
origin	射线在世界坐标系中的起点。
direction	射线的方向。
maxDistance	射线应检查碰撞的最大距离。
layerMask	层遮罩，用于在投射射线时有选择地忽略碰撞体。
queryTriggerInteraction	指定该查询是否应该命中触发器。

### 返回
bool 如果射线与任何碰撞体相交，返回 true，否则返回 false。

### 描述
向场景中的所有碰撞体投射一条射线，该射线起点为 /origin/，朝向 /direction/，长度为 /maxDistance/。
您可以选择提供一个 LayerMask，以过滤掉不想生成与其碰撞的碰撞体。
您可以通过指定 queryTriggerInteraction 来控制是让触发碰撞体生成命中效果，还是使用全局 Physics.queriesHitTriggers 设置。

注意：对于射线投射起点位于碰撞体内的情况，Raycast 不会检测到碰撞体。在所有这些示例中，都使用了 FixedUpdate 而不是 Update。请参阅事件函数的执行顺序，以了解 Update 与 FixedUpdate 的区别，以及它们与物理查询的关系。

## 第二个重要重载: 需要Ray参数

public static bool Raycast (Ray `ray`, out RaycastHit `hitInfo`, float maxDistance= Mathf.Infinity, int layerMask= DefaultRaycastLayers, QueryTriggerInteraction queryTriggerInteraction= QueryTriggerInteraction.UseGlobal);

### 参数
ray	光线的起点和方向。
hitInfo	如果返回 true，则 hitInfo 将包含有关最近的碰撞体的命中位置的更多信息。（另请参阅：RaycastHit）。
maxDistance	射线应检查碰撞的最大距离。
layerMask	层遮罩，用于在投射射线时有选择地忽略碰撞体。
queryTriggerInteraction	指定该查询是否应该命中触发器。

### 返回
bool 当光线与任何碰撞体相交时，返回 true，否则返回 false。

### 描述
与上面使用 ray.origin 和 origin（而不是 origin 和 /direction/）时相同。

### 例子
* 本例检测从鼠标点击位置发出的射线
* 该示例实现以下功能：每当检测到碰撞时，沿射线长度绘制一条线：
```csharp
using UnityEngine;

public class ExampleClass : MonoBehaviour
{
    // See Order of Execution for Event Functions for information on FixedUpdate() and Update() related to physics queries
    void FixedUpdate()
    {
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        RaycastHit hit;

        if (Physics.Raycast(ray, out hit, 100))
            Debug.DrawLine(ray.origin, hit.point);
    }
}
```

# Raycasthit: 射线击中对象

[RaycastHit](https://docs.unity.cn/cn/2020.3/ScriptReference/RaycastHit.html)
struct in UnityEngine

## 描述
用于从射线投射获取信息的结构。

另请参阅：Physics.Raycast、Physics.Linecast、Physics.RaycastAll。

## 变量
articulationBody:	被击中的对撞机的关节体。如果碰撞体未连接到关节体，则为空。
barycentricCoordinate:	命中的三角形的重心坐标。
collider	:命中的 Collider。
`distance`:	从射线原点到撞击点的距离。
lightmapCoord:	撞击点处的 UV 光照贴图坐标。
normal:	射线命中的表面的法线。
`point`:	世界空间中射线命中碰撞体的撞击点。
`rigidbody`:	命中的碰撞体的 Rigidbody。如果该碰撞体未附加到刚体，则值为 /null/。
textureCoord:	碰撞位置处的 UV 纹理坐标。
textureCoord2:	撞击点处的辅助 UV 纹理坐标。
transform:	命中的刚体或碰撞体的 Transform。
triangleIndex:	命中的三角形的索引。

# System.Serializable: 序列化
| 可以被序列化                | 不能被序列化                  |
| --------------------------- | ----------------------------- |
| c#原生数据                  | 抽象                          |
| Unit内数据(Vector,Color...) | 静态                          |
| 继承UnityEngine.Object      | 泛类                          |
| 标记被[System.Serializable] | 没有标记[System.Serializable] |
| Array、List容器             | 其他容器Dictionary            |


| 会被Unity序列化              | 不会被Unity序列化              |
| ---------------------------- | ------------------------------ |
| 标记为public                 | 标记为static、const、readonly  |
| 标记为[serializeFiled]的成员 | 标记为[noserializeFiled]的成员 |


## SerializedFiled、NoSerializedFiled: 标记unity窗口可编辑
1. `SerializedFiled` 可以使 c#原生数据 在unity可编辑
例如: 私有字段序列化
```csharp
[SerializedField]
private int num;
```
2. `NoSerializedFiled` 可以使 c#原生数据 在unity 中不显示
```csharp
[NoSerializedField]
public int num;
```
## Serializable: 使得一个类序列化

例如: 

```csharp
public class Test : MonoBehaviour
{
    [SerializeField]
    int num;
    [NonSerialized]
    public int num2;

    [SerializeField]
    public TestClass testClass;
}


[System.Serializable]
public class TestClass
{
    public int num;
    public int num2;
}
```
![请添加图片描述](/images/posts/ffbf3e8e49e742598722e244b63a2a15.jpeg)
## 例: 见注释
```csharp
[System.Serializable]
public class EventVertor3 : UnityEvent<Vector3> { };//序列化一个参数为Vector3的UnityEvent这样就可以在Unity编辑器中看到


public class MouseManager : MonoBehaviour
{
    public static MouseManager instance;

    public EventVertor3 onMouseClick;//定义一个EventVertor3字段

    RaycastHit hitInfo;

    private void Awake()
    {
        if (instance != null)
            Destroy(gameObject);
        instance = this;

    }

    private void Update()
    {
        SetCoursorTexture();
        MouseCtrol();
    }

    void SetCoursorTexture()
    {
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        if (Physics.Raycast(ray, out hitInfo))
        {
            //切换鼠标贴图
        }
    }

    void MouseCtrol()
    {
        if (Input.GetMouseButtonDown(0) && hitInfo.collider != null)//自定义点击事件
        {
            if (hitInfo.collider.CompareTag("Ground"))
            {
                //Debug.DrawLine(Input.mousePosition,)
                onMouseClick?.Invoke(hitInfo.point);//
            }
        }
    }

}
```
# event:事件
* c# 通过委托和事件 可以进行挂组件的方法调用
```csharp
namespace Demos
{
    public delegate void Mydeligat(string str);//委托

    internal class Program
    {
        public static event Mydeligat myEvent;

        static void Print1(string str)
        {
            Console.WriteLine("print1" + str);
        }

        static void Print2(string str)
        {
            Console.WriteLine("print2" + str);
        }

        static void Main()
        {
            myEvent += Print1;
            myEvent += Print2;
            myEvent?.Invoke("hello");
        }
    }
}
```
# Action\<T>:unity包装的事件委托
* Action<T>是Unity 包装的一个泛型委托
```csharp
public event Action<Vector3> OnMouseClick;
```
* 直接往事件里添加方法
```csharp
 private void Start()
    {
        agent = GetComponent<NavMeshAgent>();
        MouseManager.instance.OnMouseClick += MouseControl;
    }
```
# Shrader Graph 遮挡剔除
# unity协程: unity的异步
# Animator Layers: 动画控制器里的层级
# cinemachine: 摄像机控制器
# OnDrawGizmosSelected: 绘画辅助线 
# NavMeshAgent: 人物导航组件
# Physic.OverlapSphere: 范围类检测碰撞体
# NavMesh.SamplePosition: 寻找一个最近的点
# 观察者模式与接口
# 动画过渡: can translation of self
# Animator Override Controller: 基于另一个状态机的状态机
# ScriptObject: 组件拓展
# Vector3.Dot: 向量点积 
![请添加图片描述](/images/posts/287b939fd1e2420dab15b194910e8700.jpeg)
# 计算位置差: Vector3 direction = attackTarget.transfrom.position - transfrom.position
![请添加图片描述](/images/posts/db71bd57f8f7412fa44d1770ee716bbe.jpeg)
# unity 拓展方法
```cs
public static bool IsFacingTarget(this Transform transform,Transform target)
    {
        var direction = target.position - transform.position;
        direction.Normalize();

        float dot = Vector3.Dot(transform.forward, direction);

        return dot >= dotThreshold;  
    }
```
# unity : 用 transfrom.GetChild(0)获取子物体transfrom

# PlayerPrefs: unity本地存储 

#  JsonUtility: unity Jons 字符串转化 