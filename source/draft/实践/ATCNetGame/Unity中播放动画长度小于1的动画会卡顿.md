---
title: Unity中播放动画长度小于1的动画会卡顿
date: 2024-01-02
tags:
  - ATCNetGame
---
## 原因
在Unity中当动画时长小于1时如果动画==是==Loop动画,很有可能在动画结束会重复播放一点点动画开头的内容这样就造成了动画衔接不当,看起来有断层。

但是在Unity中当动画时长小于1时如果动画==不是==Loop动画,很有可能在动画结束会卡住一段时刻，看起来就像人物暂停了一样。

以下是GPT给出的原因:

![](/images/posts/Pasted%20image%2020240102142323.png)
## 解决方案
目前最好的解决方案是,不要让动画长度小于1,如果小于1尽量找到能够补齐之后动作的动画,合并一下让动画长度大于1,当我们进行动画过渡时用未合并的动画长度,这样衔接就非常完美。
例如:
```c#
m_anim.TransitionTo("RunTurn180", () =>
{
	if (stopTurnCoroutine != null)
		m_anim.AnimStopCoroutine(stopTurnCoroutine);
	stopTurnCoroutine = m_anim.AnimStartCoroutine(StopTurn(controller));
	PreventRootMotion();
	m_anim.TransitionTo("MoveBlendTree");
}, -1f, 0.733f);
```
这个`RunTurn180`动画本身是只有`0.733f`的但是他结尾衔接了`Run`动画使其大于`1f`。