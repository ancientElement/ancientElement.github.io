---
tags: ["Unity和CSharp","面试题"]
date: 2023-10-03 
---

**C#**

**1.C#中如何让自定义容器类能够使用for循环遍历？（通过 类对象[索引] 的形式遍历）**

我的回答:

实现索引器

答案：

通过在类中实现索引器实现

**2.C#中如何让自定义容器类能够使用foreach循环遍历？**

我的回答:

实现迭代器

答案：

通过为该类实现迭代器可以让其使用foreach遍历
传统方式：
继承IEnumerator、IEnumerable两个接口
实现其中的 
1. GetEnumerator方法
2. Current属性
3. MoveNext方法
语法糖方式：
利用yield return语法糖，实现GetEnumerator方法即可完成迭代器的实现

**3.C#中接口的作用是什么？说说你的理解**

我的回答:

接口,用来实现多态,我说不明白,比如状态机的ISate接口,有Enter、Update、Exit接口，用来实现一个状态需要做的事情。

答案：

用于建立行为的继承关系，而不是对象
不同对象，有相同行为时，我们可以利用接口对不同对象的行为进行整合


**4.Unity引擎中哪些功能使用了C#的反射功能？至少说出一点**

我的回答：

Inspection 面板的，特性的实现，生命周期函数调用

答案：

1. Inspector窗口中显示的内容
2. 预设体文件
3. 场景文件
4. Unity中的各种特性

等等

**5.请问这三行代码，运行后，在堆上会分配几个“房间”**

![ikro6](/images/posts/ikro6.png)

我的回答：

三个

答案：

![[/images/posts/Pasted image 20231003145745.png]]

2个房间

"123"一个房间

"1234"一个房间

**Unity**

**1.Unity中Awake和Start两个生命周期函数，分别在什么时候被调用？**

我的回答：

Awake在start前调用，都在Update前调用

答案：

Awake：运行时
当脚本被动态添加到对象上时立即被调用。

当对象被实例化时，依附它的脚本会立即调用Awake
它类似构造函数

Start：第一次Update之前被调用

**2.Unity场景上有多个对象，都分别挂载了n个脚本。  
我们如何控制不同脚本间生命周期函数Awake的执行先后顺序？**

我的回答：

可以在Project Setting中指定

答案：

![[/images/posts/Pasted image 20231003145931.png]]

1. 可以通过选中脚本文件，点击Inspector窗口右上角的Execution Order（执行顺序）按钮 
2. 可以打开Project Setting窗口，选择Script Execution Order选项

通过这两种方式我们可以打开脚本执行顺序窗口
在其中我们可以自己设置自定义脚本的执行顺序

**3.想要在Unity中使用指针我们需要进行哪些操作？**

我的回答：

关闭安全模式

答案：

1. 需要在PlayerSetting中的OtherSettings中勾选  Allow 'unsafe' code 选项

2. 使用指针时必须在unsafe修饰的代码块中

**4.Unity中的协同程序中yield return不同的内容，代表的含义不同  
请说明下面这些yield return的含义**

1.yield return 数字;  
2.yield return null;  
3.yield return new WaitForSeconds(数字);  
4.yield return new WaitForFixedUpdate();  
5.yield return new WaitForEndOfFrame();  
6.yield break;

我的回答：

1. 等待一帧
2. 同上
3. 等待多少秒
4. 等待到下一次FixUpdate
5. 等待到这一帧的结束
6. 结束协程

答案：

1. yield return 数字; 下一帧执行
2. yield return null;  下一帧执行
3. yield return new WaitForSeconds(数字); 等待指定秒后执行
4. yield return new WaitForFixedUpdate(); 等待下一个固定物理帧更新时执行
5. yield return new WaitForEndOfFrame(); 等待摄像机和GUI渲染完成后执行
6. yield break; 跳出协程

**5.使用Unity协同程序进行异步加载时，底层是否会使用多线程？**

我的回答：

不会，Unity协程是由迭代器实现，统一管理迭代器，不同时刻调用不同方法达到异步执行的效果

答案：

可能会
协同程序的原理是分时分步完成指定逻辑
在其中的某一步骤中，是可以使用多线程来完成某些加载操作的，多线程加载完成后，再进入协同程序的下一步继续执行