---
title: 异步操作Promise
categories:
  - 随手记
date: 2024-02-12
tags:
  - 随手记
  - 所想
series:
  - 随手记
---
## 前言

写了一个脚本,又回想起了之前的前端知识。

https://github.com/ancientElement/bilibili-filter-home

过滤指定类型的哔哩哔哩首页视频。喜欢的话可以点个星星。

## 关于Promise

一开始学的时候其实是看不懂的，之前做前端也是懵懵懂懂。
`Promise`就是将回调进行了封装，另外可以使用`await`等待`reject`或者`reslove`的执行；
明白了原理之后其实很好复现。

## 复现

```c#
public class Test
{
    public Test()
    {
        Promise<int, int> promise = new Promise<int, int>((reslove, reject) =>
        {
            reslove(10);
        });
        promise.Then((res) =>
        {
            Debug.Log(res);
        });
    }
}

public class Promise<TRes, TError>
{
    public delegate void funReslove(TRes res);
    public delegate void funReject(TError err);
    public delegate void fun(funReslove reslove, funReject reject);
    public funReslove m_reslove;
    public funReject m_reject;
    public fun m_fun;

    public Promise(fun fun)
    {
        m_fun = fun;
        m_fun?.Invoke(m_reslove, m_reject);
    }
    public void Then(funReslove reslove)
    {
        m_reslove += reslove;
    }
    public void Catch(funReject reject)
    {
        m_reject += reject;
    }
}
```