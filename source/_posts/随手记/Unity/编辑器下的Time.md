---
title: 编辑器下的Time
date: 2024-04-28 18:45
tags:
  - Time
  - 协程
  - 编辑器开发
---
在编辑器下如果你要使用时间相关的操作，当你使用在`EditorWindow`的`Update`中使用`Time.delta`，会发现好像非常的不准确，时快时慢的。

就像下面：

```csharp
private void Update()  
{
	//...
	OneFrameTimer -= Time.deltaTime;  
	if (OneFrameTimer <= 0)  
	{  
	    OneFrameTimer = 1f / FPS;  
	    CurrentFrameID += 1;  
	}
}
```

我们可以使用编辑器下的协程：`EditorCoroutineUtility`，和`DateTime`来配合获取一个准确的时间。

如下：在协程开始的时候记录**开始时间**和**开始帧**，在循环中计算当前时间与开始时间的**时间差**值。

再通过帧率计算出当前帧：帧数 = 时间 * 帧率

```csharp
private IEnumerator PlayCoroutine()  
{  
    startTime = DateTime.Now;  
    startFrameIndex = CurrentFrameID;  
    while (IsPlaying)  
    {        
	    //时间差  
        float differ = (float)DateTime.Now.Subtract(startTime).TotalSeconds;  
        //计算当前帧  
        //TODO:速度  
        CurrentFrameID = (int)(differ * FPS * 1) + startFrameIndex;  
        if (CurrentFrameID >= Asset.Duration)  
        {            IsPlaying = false;  
        }  
        yield return null;  
    }  
    yield break;  
}
```