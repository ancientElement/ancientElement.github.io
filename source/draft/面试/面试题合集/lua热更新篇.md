---
title: lua热更新篇
date: 2023-12-11T15:05:00
tags:
  - 面试题合集
---
## Reference

>鄙人知识浅薄仅仅是对大佬的文章以自己的理解描述了一下,有些实在自己描述不好就摘抄了
>如果实在觉得写的不好,是本人水平有限,还请前往前往原文处观看

[2021最新Lua面试题汇总 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/383994942?utm_oi=757371723308879872)
[Lua泛型for遍历table时ipairs与pairs的区别 | 梓喵出没 (azimiao.com)](https://www.azimiao.com/2738.html)
https://blog.csdn.net/weixin_37658157/article/details/123604068
[Lua - 函数进阶（一）可变参数_lua可变参数-CSDN博客](https://blog.csdn.net/zhanxxiao/article/details/106595773)

## lua基本数据类型

-- number == int short float ...

-- string "" 和双引号没有区别 ''

-- nil == null

-- type == typeof().getString()

-- boolean == bool

-- function

-- table

-- userdata
[What is userdata and lightuserdata in Lua? - Stack Overflow --- Lua中的userdata和lightuserdata是什么？ - 堆栈溢出](https://stackoverflow.com/questions/4329643/what-is-userdata-and-lightuserdata-in-lua)
在Lua中，userdata是一种特殊的数据类型，用于表示从C或C++代码中传递给Lua的任意类型的数据。它允许Lua脚本访问和操作来自外部语言的数据。

-- thread

## Ipiars 与 piars

这两个方法都是用来访问**迭代器**的，但是Ipairs只能访问**索引**为**数字类型**的table，并且一旦遍历到**nil**就停止了，所以他无法处理断层。

pairs可以遍历到所有元素，但是会先遍历数字类型为索引的遍历，再随机遍历哈希表。

## 冒号与点号

冒号调用是 `.(self,...)`的语法糖，省略了self参数。

那么什么时候用冒号什么时候用点好呢？当函数中需要使用自身的成员变量的时候用冒号，其他时候无所谓。

## 可变参数

lua中的可变参数`function fun(...)`，如何访问lua中的可变参数呢？使用`arg`和`select`关键字，但是，如果需要迭代，`arg`关键字到`nil`会停止，`select`关键字不会，所以当可变参数可能有nil时最好用`select`。

## 多返回值

接收**多返回值**的时候，有多少个**接收参数**就有多少返回值。返回值**不够**时用nil补全。

## 如何对tabel新建值时提示错误

将该表的`metatable`的`_newIndex`指向一个报错的函数。

```lua
function table.SetReadOnly(tb)  
    setmetatable(tb, {
        __newindex = function()
            error("attempt to modify a read-only table!")
        end
    })
end
```

## 如何实现深拷贝

DFS递归遍历lua的**键和值**，都拷贝进一个新`table`

```lua
-- Lua table deep copy
function clone(object)
    local lookup_table = {}
    local function _copy(object)
        if type(object) ~= "table" then		--非table直接返回
            return object
        elseif lookup_table[object] then	--找过的就不用再找了
            return lookup_table[object]
        end
        local new_table = {}
        lookup_table[object] = new_table
        for key, value in pairs(object) do
            new_table[_copy(key)] = _copy(value)	--递归遍历table的元素
        end
        return setmetatable(new_table, getmetatable(object))	--拷贝目标的元表的数据
    end
    return _copy(object)
end
```

## 实现面向对象

1.基类Object
```lua
Object = {};

Object.id = 1;
```

2.new一个Object
自己的**成员变量**只在自己身上，调用`new`的原表的`_index`指向自己。
```lua
function Object:new()
    -- 设置__index为自己
    -- 设置元表为自己
    local obj = {}
    self.__index = self;
    setmetatable(obj, self);
    return obj;
end
```

3.继承
创建子类，使用Object的SubClass方法，在大G表创建一个表，将原表设置为Object，这样就有new方法了，并且根据上面的new方法，可以得到用对应**大G包中创建的类**new出来的table的`_index`是那个**大G表中创建的类**。并且用base可以得到父类的成员。
```lua
function Object:SubClass(className)
    _G[className] = {};
    local obj = _G[className];
    self.__index = self;
    obj.base = self;
    setmetatable(obj, self);
end
```

```lua
--只在自己身上找变量 忽略index
_ = rawget(t7, "name");
--只改自己的变量 忽略newindex
rawset(t7, "name", 10);
```

## 什么是Upvalue 和 闭包

也就是函数**作用域外**的临时变量，可以变成函数的**成员变量**，很多语言中实现闭包的底层都是用类实现的。

例如：

```lua
function g1(n) 
	local function g2() {
		print(n);
	}
	n = n + 1;
	return g2;
end

local f1 = g1(10);
f1();--11
```

## lau内存管理GC

lua使用的**标记回收**算法。

**白色**：可回收状态。：如果该对象未被GC标记过则此时白色代表当前对象为待访问状态。

**灰色**：中间状态。：当前对象为**待标记状态**。当前对象已经被GC访问过，但是该对象**引用的**其他对象还没有被标记。

**黑色**：不可回收状态。 `详解`：当前对象为已标记状态。

有点多，[Lua GC机制分析与理解-上 (zhihu.com)](https://www.zhihu.com/tardis/zm/art/133939450?source_id=1005)

## lua热跟新的原理

https://zhuanlan.zhihu.com/p/636768992

关键字：

脚本代码编译成**字节码**，然后通过虚拟机来执行字节码
Lua会将字节码解释成**机器码**，然后通过JIT（Just-In-Time，即时编译）来优化执行效率
在执行过程中，Lua会将**变量**、**函数**等信息存储在一个全局的Lua状态中，以便在后续的执行中使用

1.读取下载的lua脚本：

```lua
local newScript = loadfile("newScript.lua")
```

2.替换原有的Lua脚本文件

```lua
local oldScript = _G["script"]
local newScript = loadfile("newScript.lua")
_G["script"] = newScript
```

其中，**script是原有的Lua脚本文件的全局变量名**，可以通过`_G["script"]`来访问。

3.重新执行Lua脚本

```lua
dofile("script.lua")
```

- 首先，需要确保新的Lua脚本文件和原有的Lua脚本文件具有**相同的全局变量名**和**函数名**等标识符，以保证替换成功。
- 其次，需要确保新的Lua脚本文件和原有的Lua脚本文件具有**相同的函数调用**和**变量**使用方式，以保证游戏逻辑的正确性。
- 最后，需要注意Lua的**内存管理**，避免出现内存泄漏等问题。


## 多人开发怎么避免全局变量泛滥

[Lua优化：破解全局变量的使用困局 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/350346797)

UWA资源检测SDK第三方服务

## C#与lua交互的细节

[深入xLua实现原理之Lua如何调用C# - iwiniwin - 博客园 (cnblogs.com)](https://www.cnblogs.com/iwiniwin/p/15307368.html)

## lua数据结构之table的内部实现


## lua的协程

[Lua 协同程序(coroutine) | 菜鸟教程 (runoob.com)](https://www.runoob.com/lua/lua-coroutine.html)good
[Lua语言：协程 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/76249973)

 coroutine.status (co): 返回co协程的状态，协程有**4个状态**：
- running: 协程正在运行，可以确定就是调用coroutine.status的这个协程。
- suspended：协程挂起，协程创建后会处于这个状态，或是自己调用yield之后也处于这个状态。
- dead: 协程执行完毕，或因错误停止，处于死亡状态。

其实与Unity的协程也类似`coroutine.resume`可以类比于unity中协程的`Coroutine::MoveNext`