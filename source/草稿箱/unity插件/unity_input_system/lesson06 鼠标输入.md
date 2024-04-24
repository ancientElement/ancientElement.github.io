---
tags: ["UnityInputSystem","Unity插件"]

---

**知识点一 按下/抬起/长按 与 键盘一模一样**

**知识点二 位置鼠标两帧之间的偏移量鼠标滚轮**

```cs
//鼠标位置
mousePosition = mouse.position.ReadValue();
//鼠标两帧之间的偏移量
mouseDelta = mouse.delta.ReadValue();
//鼠标滚轮
mouseScroll = mouse.scroll.ReadValue();
Debug.Log(mouseScroll);
```


