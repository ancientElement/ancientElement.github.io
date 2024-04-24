---
tags:
date: 2022-11-15
title: API /images/featured15.jpg
---
## Component

获取组件

* `this.GetComponent<组件名>() `获取单个组件

  > 有些组件可直接获取如 `transform` `tag` `gameObject`

* `this.GetComponents<Components>() `获取所有Components组件

* `this.GetComponentsInChildren<MeshRenderer>()`

   加s  从自身开始查找组件找到所有子代`MeshRenderer`组件

* `this.GetComponentInChildren<MeshRenderer>()`

   不加s  从自身开始查找组件只找一个距离最近的`MeshRenderer`组件

* 还有`this.GetParent<组件名>()`等...

## Transform

变换 位置 旋转 缩放 设置查找 父、子物体

- `this.transform `获取子组件Transform 不包括孙子代

- `this.transform.position `获取相对于世界坐标系的位置

- `this.transform.localPosition `获取相对于父物体的位置

- `this.transform.parent`

   获取父物体

- 绕着一点旋转

   `  this.transform.RotateAround(Vector3.zero, Vector3.forward, 1);`

* setParent

  ```c#
  //设置父物体  position视为世界坐标
  this.transform.SetParent(tf, true);
  //设置父物体 position视为localPosition
  this.transform.SetParent(tf, false);
  ```

* find

  ```c#
  Transform childTF = this.transform.Find("Cube");//查找一个亲儿子
              Transform childTF2 = this.transform.Find("Cube/aa/bb");//查找一个很孙子的物体
              Transform childTF3 = this.transform.GetChild(0);//
  ```

## GameObject

有 `GameObject`

> `GameObject` 游戏对象
>
> `Object` 所有对象包括 GameObject Component

- `this.gameObject.activeInHierarchy`物体实际激活状态

- `this.gameObject.activeSelf `物体自身激活状态面板里的勾

- 创建一个游戏对象

  ```c#
  //创建游戏对象
  GameObject gameLight = new GameObject();
  //创建Light组件
  Light light = gameLight.AddComponent<Light>();
  //给Light组件加属性
  light.color = Color.white;
  light.type = LightType.Directional;
  ```

  

- 查找



- 根据标签寻找物体多个

  ```c#
   GameObject[] enemy = GameObject.FindGameObjectsWithTag("Enemy");
  ```

  

 - 根据标签寻找物体(单个)

    ```c#
     GameObject player = GameObject.FindWithTag("player");
    ```



- 根据类型 查找 对象

  ```c#
  Object.FindObjectOfType<MeshRenderer>();
  FindObjectsOfType<MeshRenderer>();
  ```

- 销毁 传入的对象

  ```c#
  Object.Destroy(enemy[0]);
  ```

  

## Object

- `DontDestroyOnLoad(this)`加载另一个场景时不要销毁

- `Destroy(this.gameObject,5); `销毁对象 可以延时

- 寻找一个游戏对象

  ```c#
  FindObjectOfType()
  FindObjectsOfType()
  ```

  



- 实例化一个游戏对象

  ```c#
  Instantiate(gameObject, this.transform.position, this.transform.rotation);
  ```

  


## Time

- `Time.timeScale` 时间缩放

- `Time.deltaTime; `每帧的间隔时间 

- `Time.time `从游戏运行到现在的时间

- `Time.timeScale` 时间缩放的影响

  * Update 不受到 timeScale 的影响 Time.timeScale = 0;后 Update 的所有代码停止
  * 但是 update 里与 Time 有关的 代码受到影响 比如 `Tiem.time` `Time.deltaTime`
  * 注意 Time.unscaledDeltaTime 不会受到影响 

  ```c#
  Time.time; //受到scale影响的游戏时间
  Time.unscaledTime;//不受到scale影响的游戏时间
  Time.realtimeSinceStartup;//实际游戏时间   不受scale影响
  ```

  * FixedUpdate 受到 timeScale 的影响 Time.timeScale = 0;后 FixUpdete 的所有代码停止

- 要求到达一定时间进行一些操作

  * 用 delayTime 累加 时间

    ```c#
     this.totalTime += Time.deltaTime;
    if (this.totalTime >= 1)
    {
        this.secend -= 1;
        this.totalTime = 0;
    }
    ```

  * 如果到达 用 Time.time 作比较

    ```c#
    if (Time.time > this.nextTime)
    {
        secend -= 1;
        nextTime = Time.time + 1;
    }
    ```

  * 定时器

    * 开启定时器

      `void Invoke(string methodName 方法名,float time 等待time之后执行 ,float delayTime 每隔delayTime 再去调用methodName方法)` 

      ```c#
      private void Start() 
      {
          InvokeRepeating("Timer3", 1, 1);
      }
       
      private void Timer3()
      {
          this.secend--;
          if(this.secend <= 0)
          {
              CancelInvoke("Timer3");
          }
      }
      ```

      

    * 关闭定时器

      ```c#
      CancelInvoke("Timer3");
      ```

    * `Invoke(执行方法,开始调用时间)`

    

    

    

  


## Animation

- `animationComponent[animationDoor].time;` 动画开始时间
- `animationComponent[animationDoor].length  `动画时长
- `animationComponent[animationDoor].speed `动画速度 设为-1就是倒着播放
- `animationComponent.Play(animationDoor);` 播放动画

  


- 

## Input

- 输入写在Update中

- `Input.mousePosition; `鼠标位置 ,以屏幕左下角为原点只有x,y坐标有值 屏幕没有z轴

- 按下的一瞬间 鼠标输入

- 0 2 1 左键 中键 右键

  ```c#
   if (Input.GetMouseButtonDown(0))
          {
              print("鼠标左键按下了");
          }
          if (Input.GetMouseButtonDown(2))
          {
              print("鼠标中键按下了");
          }
          if (Input.GetMouseButtonDown(1))
          {
              print("鼠标右键按下了");
          }
  ```

  


- 鼠标输入抬起的的一瞬间

  ```c#
   if (Input.GetMouseButtonUp(0))
          {
              print("鼠标左键抬起了");
          }

  ```

  

- 鼠标输入抬起的的一瞬间

  ```c#
   if (Input.GetMouseButtonUp(0))
          {
              print("鼠标左键抬起了");
          }

  ```

- 鼠标输入长按

  ```c#
  if (Input.GetMouseButton(0))
          {
              print("鼠标左键按下了未抬起");
          }
  ```


- 鼠标输入滚轮 

- * 输出一个 Verctor3值 只改变Y值

  ```c#
  print(Input.mouseScrollDelta);
  ```

  

- 键盘按下

- 可传入枚举 或者字符串 小写

  ```c#
  if (Input.GetKeyDown(KeyCode.W))
          {
              print("WDown");
          }
  ```

- 键盘抬起

  ```c#
   if (Input.GetKeyUp(KeyCode.W))
          {
              print("WUP");
          }
          if (Input.GetKey(KeyCode.W))
          {
              print("Wcontinue");
          }
  ```

- 默认轴输入


- 键盘 A D 按下 返回-1 到 1的值 水平

- 键盘 S W 按下 返回-1 到 1的值 垂直

  ```c#
  print(Input.GetAxis("Horizontal"));
  print(Input.GetAxis("Vertical"));
  ```

- 鼠标移动

  * 横向移动 左右 -1 1

    ```c#
    print(Input.GetAxis("Mouse X"));
    ```

  * 上下移动 下上 -1 1

    ```c#
    print(Input.GetAxis("Mouse Y"));
    ```

  * Input.GetAxisRaw() 与 Input.GetAxis() 使用相同 但是 他只输出三个值 -1 0 1 

- 其他

  * 任意键持续按下

    ```c#
    if (Input.anyKey)
    {
        print(Input.inputString);
    }
    ```

  * 任意键按下

    ```c#
    if (Input.anyKeyDown)
    {
    	print(Input.inputString);
    }
    ```

- 其他

  ```c#
  //得到手柄输入相关
      //得到按键名字
      string[] keyName = Input.GetJoystickNames();
      if (Input.GetButtonDown("jump"))
      {
  
      }
      if (Input.GetButtonUp("jump"))
      {
  
      }
      if (Input.GetButton("jump"))
      {
  
      }
  
      if (Input.touchCount > 0)
      {
          Touch t1 = Input.touches[0];
  
          //当前触摸的位置
          print(t1.position);
          //先对于上次触摸的位置变化
          print(t1.deltaPosition);
  
      }
  
      //启用多点触控
      Input.multiTouchEnabled = true;
  
      //陀螺仪
      Input.gyro.enabled = true;
  
      //重力加速度
      print(Input.gyro.gravity);
  
      //旋转速度
      print(Input.gyro.rotationRate);
  
      //当前旋转四元数
      print(Input.gyro.attitude);
  ```

  

## Screen

- 硬件设备的分辨率

  ```c#
  Resolution screen = Screen.currentResolution;
  print(screen.height);
  print(screen.width);
  ```

- 游戏窗口的宽高

  ```c#
  print(Screen.width);
  print(Screen.height);
  ```

- 屏幕休眠

  ```c#
          Screen.sleepTimeout = SleepTimeout.NeverSleep;
  
  ```


- 窗口模式

  ```c#
          Screen.fullScreenMode = FullScreenMode.Windowed;

  ```

- 指定屏幕显示方向

  ```c#
  Screen.orientation = ScreenOrientation.Landscape;

  ```

- //屏幕休眠

  ```c#
          Screen.sleepTimeout = SleepTimeout.NeverSleep;
  
  ```


- 设置分辨率

  ```c#
  Screen.SetResolution(Screen.width, Screen.height,false);
  ```

## Camera

- 获取摄像机

- 获取主摄像机 必须有mainCamera 的 Tag

  ```c#
          print(Camera.main.name);

  ```

- 摄像机数量
  摄像机剔除前的委托函数

- 

  ```c#
    print(Camera.allCameras);
  ```


- 硬件设备的分辨率

  ```c#
  Resolution screen = Screen.currentResolution;
  print(screen.height);
  print(screen.width);
  ```

- 渲染委托相关

  ```c#
    Camera.onPreCull += (c) =>
          {

          };
  ```

- 摄像机渲染前的委托函数

  ```c#
          Camera.onPreRender += (c) => { };
  
  ```


- 摄像机渲染后的委托函数

  ```c#
          Camera.onPostRender += (c) => { };

  ```

- 获取摄像机的参数

  ```c#
    Camera.main.depth = 10
  ...
  ```


- **世界坐标转化为屏幕坐标x,y表示屏幕坐标  z 表示 与摄像机的距离**

  ```c#
  Vector3 v = Camera.main.WorldToScreenPoint(this.transform.position);
          print(v);
  ```

- **屏幕坐标转化为世界坐标**

  ```c#
  private void Update()
  {
      //屏幕坐标转化为世界坐标
      Vector3 v = Input.mousePosition;
      //z 表示 与摄像机的距离
      v.z = 10;
      if (Input.GetMouseButtonDown(0))
      {
          var newobj = Instantiate(obj);
          newobj.transform.position = Camera.main.ScreenToWorldPoint(v);
      }
  }
  ```




## Rigdbody

* 只要能和其他对象 发生碰撞就可以触发下列函数 

- 也就是至少一方有刚体

- 碰到的对象的碰撞器信息

  ```c#
  collision.collider.gameObject 
  ```

- 碰撞到的对象的依附对象

  ```c#
  collision.gameObject
  ```

- 碰撞对象的依附对象的位置

  ```c#
  ContactPoint[] point = collision.contacts;
  ```


- 接触点

  ```c#
  Resolution screen = Screen.currentResolution;
  print(screen.height);
  print(screen.width);
  ```

- 物理碰撞检测函数

  * 碰撞触发时

    ```c#
    private void OnCollisionEnter(Collision collision)
    {}
    ```

  * 碰撞结束时

    ```c#
    private void OnCollisionExit(Collision collision)
    {
        print(collision.gameObject.name + "碰撞结束");
    
    }
    ```

    碰撞持续时

    ```c#
    private void OnCollisionStay(Collision collision)
    {
      print(collision.gameObject.name + "碰撞持续");
    }
    ```

- 打开isTigger后上面的碰撞函数不再触发

- 转而触发Tigger函数

- * ```c#
    private void OnTriggerEnter(Collider other)
        {
            print("开始碰撞" + other.gameObject + "OnTriggerEnter被碰撞了");
        }
    ```

  * ```c#
    private void OnTriggerExit(Collider other)
        {
            print(other.gameObject.name + "OnTriggerEnter碰撞结束");
        }
    ```


  * ```c#
    private void OnTriggerExit(Collider other)
        {
            print(other.gameObject.name + "OnTriggerEnter碰撞结束");
        }
    ```


## 刚体加力

- 添加力

  * 相对世界坐标系

  * 给z轴加了10N的力

    * ```c#
      rigbody.AddForce(Vector3.forward* 10);
      ```

  * 相对本地坐标系

  * 给z轴加了10N的力

    * ```c#
      rigbody.AddRelativeForce(Vector3.forward* 1);
      ```

    * 同意语句 `rigbody.AddForce(this.transform.forward* 10);   `

  * 添加扭矩力

    * 世界坐标

      ```c#
      rigbody.AddTorque(Vector3.up * 10);
      ```

    * 相对本地坐标系

      ```c#
      rigbody.AddRelativeTorque(Vector3.forward * 10);
      ```

      


- 添加速度

  * 相对世界坐标系

    ```c#
    rigbody.velocity= Vector3.forward * 5;
    ```

  * 相对世界坐标系

    ```c#
    rigbody.velocity= Vector3.forward * 5;
    ```

    

- 爆炸产生的力

  * 只影响挂载了脚本的对象

    ```c#
    rigbody.AddExplosionForce(100, Vector3.zero, 10);
    ```

- 持续的力

  * 写在`Update` 里

    ```c#
    rigbody.AddForce(Vector3.forward * 10);
    rigbody.AddRelativeForce(Vector3.forward * 10);
    rigbody.AddForce(this.transform.forward* 10);
    ```

- 刚体休眠

  ```c#
  if (rigbody.IsSleeping())
  {
      rigbody.WakeUp();
  }
  ```

## 刚体移动



* ` rigidbody.MovePosition(Verctor3())`
* ` rigidbody.MoverRotation(Verctor3())`


## resource资源加载

Resources.Load<Material>("Matieral/ball");
