---
tags: ["UnityInputSystem","Unity插件"]
categories:
  - unity插件
  - unity_input_system
series: ["UnityInputSystem"]
date: 2023-07-15
title: Lesson13 InputAction /images/wallhaven-3l2dq6.jpg
---
###interaction 交互设置

![image-20230628224813237](image-20230628224813237.png)32![image-20230628224648682](image-20230628224648682.png)0628224648682![image-20230629004218157](image-20230629004218157.png)mage-20230629004218157.png)

press point : 按压阈值 按压到多少算按压

hold    time: 按住多长时间算长按

详见: [Interactions | Input System | 1.6.1 (unity3d.com)](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.6/manual/Interactions.html#![image-20230628224908454](image-20230628224908454.png)ys![image-20230628225358439](image-20230628225358439.png)ityInputSyst![image-20230628231614045](image-20230628231614045.png)ni![image-20230629000404362](image-20230629000404362.png)images//Unity插件/UnityInputSystem/img.assets/image-20230629000404362.png)

## Lesson15

**InputSystem 获取任意按键**

Call会报错但是会多次监听

CallOnce只监听一次不会报错

```cs
InputSystem.onAnyButtonPress.CallOnce((ctx) =>
{
    print(ctx.path);//InputAction路径
    print(ctx.name);//InputAction名字
});
InputSystem.onAnyButtonPress.Call((ctx) =>
{
    print(ctx.path);//InputAction路径
    print(ctx.name);//InputAction名字
});
```

​      
