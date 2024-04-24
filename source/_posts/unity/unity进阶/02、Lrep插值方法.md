---
tags: ["Unity进阶","Unity"]
categories:
  - unity
  - unity进阶
series: ["Unity进阶"]
date: 2023-06-17
title: 02、Lrep插值方法 /images/featured16.jpg
---
## Vector3.Lerp

public static [Vector3](https://docs.unity.cn/cn/2020.3/ScriptReference/Vector3.html) **Lerp**([Vector3](https://docs.unity.cn/cn/2020.3/ScriptReference/Vector3.html) **a**, [Vector3](https://docs.unity.cn/cn/2020.3/ScriptReference/Vector3.html) **b**, float **t**);

### 参数

| a    | 起始值，当 t = 0 时返回。        |
| ---- | -------------------------------- |
| b    | 结束值，当 t = 1 时返回。        |
| t    | 用于在 a 和 b 之间进行插值的值。 |

### 描述

在两个点之间进行线性插值。

使用插值 `t` 在点 `a` 和 `b` 之间进行插值。参数 `t` 限制在范围 [0, 1] 内。这最常用于查找占两个终端之间距离特定百分比的点（例如，以便在这些点之间逐步移动对象）。

返回的值等于 **a +(b - a) \* t**（也可以写作 **a \*(1-t) + b\*t**）。
当 `t` = 0 时，**Vector3.Lerp(a, b, t)** 返回 /a/。
当 `t` = 1 时，**Vector3.Lerp(a, b, t)** 返回 /b/。
当 `t` = 0.5 时，**Vector3.Lerp(a, b, t)** 返回 `a` 和 `b` 中间的点。

### 注意

a 是起始值不要拿一个变化的值放进去

错误示例 :  transform.position 是在变化的并不是初始值,我们要记录初始值将其设为a参数他是一个不变的值(当固定开始结束位置时) 

```cs
private void Update()
    {
        if(isMove)
        {
            timer += Time.deltaTime / duriation;

            transform.position = Vector3.Lerp(transform.position, target.position, timer);
            Debug.Log(transform.position + "---" + timer);

            if(timer >= 1)
            {
                isMove = false;
                timer = 0;
            }
        }

    }
```

