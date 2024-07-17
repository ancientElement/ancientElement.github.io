---
tags: ["UnityInputSystem","Unity插件"]
---
**知识点一 获取键盘**

```cs
Keyboard keyboard;
Mouse mouse;

private void Start()
{
    keyboard = Keyboard.current;
    mouse = Mouse.current;

    keyboard.onTextInput += (c) =>
    {
        print(c);
    };
}
```

**知识点二 键盘输入按下/抬起/长按**

```cs
if (keyboard.aKey.wasPressedThisFrame)
{
    Debug.Log("aKey Pressed");
}
if (keyboard.aKey.wasReleasedThisFrame)
{
    Debug.Log("aKey Released");
}
if (keyboard.aKey.isPressed)
{
    Debug.Log("aKey isPressed");
}
```

**知识点三 通过事件监听按键按下**

通过给 keyboard 对象中的文本输入事件添加委托函数
便可以获得每次输入的内容

```cs
keyboard.onTextInput += (char c) =>
{
    print(c);
};
```



**知识点四 任意键按下监听**

可以处理任意键 按下/抬起/长按 相关的逻辑

```cs
if (keyboard.anyKey.wasPressedThisFrame)
{
    Debug.Log(" anyKey  Pressed");
}
```


