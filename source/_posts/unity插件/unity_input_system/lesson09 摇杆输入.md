---
tags: ["UnityInputSystem","Unity插件"]
categories:
  - unity插件
  - unity_input_system
series: ["UnityInputSystem"]
date: 2023-07-15
title: Lesson09 摇杆输入 /images/wallhaven-3l2dq6.jpg
---
```cs
//左摇杆
if (gamepad.leftStickButton.wasPressedThisFrame)
{
    print("leftStickButton Pressed");
}
leftStick = gamepad.leftStick.ReadValue();
//右摇杆
rightStick = gamepad.rightStick.ReadValue();
//左侧方向键
dpad = gamepad.dpad.ReadValue();
//xy ab 东南西北 右侧按键
//wasPressedThisFrame wasRereseThisFrame isPressing 
buttonNorth = gamepad.buttonNorth.ReadValue();
buttonSouth = gamepad.buttonSouth.ReadValue();
buttonEast = gamepad.buttonEast.ReadValue();
buttonWest = gamepad.buttonWest.ReadValue();
//开始键和选择键 wasPressedThisFrame wasRereseThisFrame isPressing 
if (gamepad.selectButton.wasPressedThisFrame)
{
    print("selectButton Pressed");
}
if (gamepad.startButton.wasPressedThisFrame)
{
}
//肩部 按键wasPressedThisFrame wasRereseThisFrame isPressing 
//下 trigger 上 shoulder
if (gamepad.leftShoulder.wasPressedThisFrame)
{
    print("leftShoulder Pressed");
}
```


