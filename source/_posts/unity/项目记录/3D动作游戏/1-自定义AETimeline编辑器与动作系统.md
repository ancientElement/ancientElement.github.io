---
title: 1-自定义AETimeline编辑器
date: 2024-05-06 21:16
tags:
---
继承AETimelineAsset资产，自定义ActionConfig，实现动作系统。

自定义动画Clip，继承AEAnimationClip、AEAnimationTrack实现支持State的动画切换。

适配动画播放。

将ActionConfig的部分属性放置到轨道中。

只有0-1帧Tick不了。所以我们规定最小Duration为2帧。

