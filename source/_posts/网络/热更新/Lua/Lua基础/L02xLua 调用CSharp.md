---
tags: ["Lua基础","Lua","热更新","Unity"]
date: 2023-07-08
title: L02 xLua 调用CSharp /images/wallhaven-d6d6kg.jpg
---
### **1.Lua调用C#静态类 **

规则"CS.命名空间.类名.成员变量"
```cs
namespace HX
{
    public static class TestStatic
    {
        public static int ID = 99;

        public static string Name
        {
            get;
            set;
        }

        public static string Output()
        {
            return "static";
        }

        public static void Default(string str = "abc")
        {
            Debug.Log(str);
        }
    }
}
```

```lua
print(CS.HX.TestStatic.ID)

-- 给静态属性赋值
CS.HX.TestStatic.Name = "admin"
print(CS.HX.TestStatic.Name)

-- 静态成员方法调用
-- 规则"CS.命名空间.类名.方法名()"
print(CS.HX.TestStatic.Output())

-- 使用默认值
CS.HX.TestStatic.Default()
-- 使用Lua传递的值
CS.HX.TestStatic.Default("def")
```

### **2.Lua实例化C#类 **
```cs
public class Npc
{
    public string Name;
    public int HP
    {
        get;
        set;
    }

    public Npc()
    {

    }

    public Npc(string name)
    {
        Name = name;
    }

    public string Output()
    {
        return this.Name;
    }
}
```

```lua
-- Lua实例化类
-- C.Npc obj = new Npc()
-- 通过调用构造函数创建对象
local obj = CS.Npc()
obj.HP = 100

print(obj.HP)

local obj1 = CS.Npc("admin")
print(obj1.Name)

-- 表方法希望调用表成员变量（表:函数()）
-- 为什么是冒号，对象引用成员变量时，会隐性调用this，等同于Lua中的self
print(obj1:Output())

-- Lua实例化GameObject
-- C.GameObject obj = new GameObject("LuaCreateGO")
local go = CS.UnityEngine.GameObject("LuaCreateGO")

```

### **3.Lua调用C#重载函数 **
```cs
public class TestOverload
{
    public static void Test(int id)
    {
        Debug.Log("数字类型: " + id);
    }

    public static void Test(string name)
    {
        Debug.Log("字符串类型: " + name);
    }

    public static void Test(int id.string name)
    {
        Debug.Log("两个数值: " + id + ", " + name);
    }
}
```

```lua
-- 数字重载函数
CS.TestOverload.Test(99)

-- 字符串重载函数
CS.TestOverload.Test("admin")

-- 不同参数的重载函数
CS.TestOverload.Test(100, "root")
```

### **4.Lua调用C#继承 **
```cs
public class Father
{
    public string Name = "father";

    public void Talk()
    {
        Debug.Log("这是父类中的方法");
    }

    public virtual void Overide()
    {
        Debug.Log("这是父类中的虚方法");
    }
}

public class Child : Father
{
    public override void Overide()
    {
        Debug.Log("这是子类中的重写方法");
    }
}
```

```lua
-- 数字重载函数
-- 调用Father
local father = CS.Father()
print(father.Name)
father:Overide()

-- 调用Child
local child = CS.Child()
print(child.Name)
child:Talk()
child:Overide()
```

### **4.Lua调用C#结构体**

```cs
public struct TestStruct
{
    public string Name;

    public string Output()
    {
        return Name;
    }
}
```

```lua
-- 和对象调用保持一致
local obj = CS.TestStruct()

obj.Name = "admin"

print(obj.Name)

print(obj:Output())
```

### **5.Lua调用C#枚举 **


```cs
public enum TestEnum
{
    LoL = 0,

    Dota2
}
```

```lua
-- C.TestEnum.LoL
-- CS.命名空间.枚举名.枚举值
-- 枚举获得是userdata自定义数据类型，获得其他语言数据类型时，就是userdata
print(type(CS.TestEnum.LoL))
print(CS.TestEnum.Dota2)

-- 转换获得枚举值
print(CS.TestEnum.__CastFrom(0))
print(CS.TestEnum.__CastFrom("Dota2"))
```

### 6**.Lua调用C#类扩展 **


```cs
//类扩展，需要给扩展方法编写的静态类添加[LuaCallCSharp]，否则Lua无法调用到
[LuaCallCSharp]
public static class MyExtend
{
    public static void Show(this TestExtend obj)
    {
        Debug.Log("类扩展实现的方法");
    }
}
```

```lua
-- 获取对象
local obj = CS.TestExtend()

obj:Output()
obj:Show()
```

### **7.Lua调用C#委托 **


```cs
public class TestDelegate
{
    public static DelegateLua Static;

    public DelegateLua Dynamic;

    public static void StaticFunc()
    {
        Debug.Log("C#静态成员函数");
    }
}
```

```lua
-- C#给委托赋值
-- TestDelegate.Static = TestDelegate.StaticFunc
-- TestDelegate.Static += TestDelegate.StaticFunc
-- TestDelegate.Static -= TestDelegate.StaticFunc
-- TestDelegate.Static()

CS.TestDelegate.Static = CS.TestDelegate.StaticFunc
CS.TestDelegate.Static()
-- Lua中如果添加了函数到静态委托变量中后，再委托不再使用后，记得释放添加的委托函数
CS.TestDelegate.Static = nil
 /images/wallhaven-d6d6kg.jpg
----------------------------------------------------

local func = function()
	print("这是Lua的函数")
end

-- 覆盖添加委托
CS.TestDelegate.Static = func
-- 加减操作前一定要确定已经添加过回调函数
CS.TestDelegate.Static = CS.TestDelegate.Static + func
CS.TestDelegate.Static = CS.TestDelegate.Static - func
-- 调用以前应确定委托有值
CS.TestDelegate.Static()

CS.TestDelegate.Static = nil
 /images/wallhaven-d6d6kg.jpg
-----------------------------------------------------------

-- 调用前判定
--	if(CS.TestDelegate.Static ~= nil)
--	then
--		CS.TestDelegate.Static()
--	end

-- 根据委托判定赋值方法
--	if(CS.TestDelegate.Static == nil)
--	then
--		CS.TestDelegate.Static = func
--	else
--		CS.TestDelegate.Static = CS.TestDelegate.Static + func
--	end
 /images/wallhaven-d6d6kg.jpg
-----------------------------------------------------------

local obj = CS.TestDelegate()
obj.Dynamic = func
obj.Dynamic()

obj.Dynamic = nil

```

### **8.Lua调用C#添加事件 **


```cs
public delegate void EventLua();

public class TestEvent
{
    public static event EventLua Static;

    public static void StaticFunc()
    {
        Debug.Log("这是静态函数");
    }

    public static void CallStatic()
    {
        if(Static != null)
        {
            Static();
        }
    }

    public event EventLua Dynamic;

    public void CallDynamic()
    {
        if(Dynamic != null)
        {
            Dynamic();
        }
    }
}
```

```lua
-- C#添加事件 TestEvent.Static += TestEvent.StaticFunc

-- Lua添加事件
CS.TestEvent.Static("+", CS.TestEvent.StaticFunc)
CS.TestEvent.CallStatic()
CS.TestEvent.Static("-", CS.TestEvent.StaticFunc)

-- 添加动态成员变量
local func = function()
	print("来自于Lua的回调函数")
end

local obj = CS.TestEvent()
obj:Dynamic("+", func)
obj:CallDynamic()
obj:Dynamic("-", func)
```

### **9.Lua调用C#泛型 **


```cs
public class TestGenericType
{
    public void Output<T>(.data)
    {
        Debug.Log("泛型方法：" + data.ToString());
    }

    public void Output(float data)
    {
        Output<float>(data);
    }

    public void Output(string data)
    {
        Output<string>(data);
    }
}
```

```lua
-- 获取对象
local obj = CS.TestGenericType()

obj:Output(99)
obj:Output("admin")

local go = CS.UnityEngine.GameObject("LuaCreate")
-- xLua实现了typeof关键字，所以可以用类型API替代Unity内置的泛型方法
go:AddComponent(typeof(CS.UnityEngine.BoxCollider))

```

### **10.Lua调用C#多返回值 **


```cs
public class TestOutRef
{
    public static string Func1()
    {
        return "Func1";
    }

    public static string Func2(string str1.out string str2)
    {
        str2 = "Func2 out";
        return "Func2";
    }

    public static string Func3(string str1.ref string str2)
    {
        str2 = "Func3 Ref";
        return "Func3";
    }

    public static string Func4(ref string str1.string str2)
    {
        str1 = "Func4 Ref";
        return "Func4";
    }
}
```

```lua
-- 获取对象
local r1 = CS.TestOutRef.Func1()
print(r1)

-- C.out返回的变量，会赋值给Lua的第二个接受返回值变量
local out2
local r2.out1 = CS.TestOutRef.Func2("admin", out2)
print(r2.out1.out2)

-- C.ref返回的变量，会赋值给Lua的第二个接受返回值变量
local ref2
local r3.ref1 = CS.TestOutRef.Func3("root", ref2)
print(r3.ref1.ref2)

-- 即使out ref作为第一个参数，其结果依然会以Lua的多个返回值进行返回
local ref4
local r4.ref3 = CS.TestOutRef.Func4(ref4, "test")
print(r4.ref3.ref4)

```
