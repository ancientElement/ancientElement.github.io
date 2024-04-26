---
tags: ["Lua基础","Lua","热更新","Unity"]
date: 2023-07-08
title: L03 CSharp 调用 xLua
---
### **1.C#调用Lua变量 **

```cs
void Start()
{
    xLuaEnv.Instance.DoString("return require('L2C/CsharpCallVariable')");
    //LuaEnv 提供了个成员变量 Globa1,它可以用于 C#获取 Lua 的全局变量
    //Global 的数据类型是 c#实现的 LuaTable.LuaTable 是×Lua 实现的 c#和 Lua 中表对应的数据结构
    //xLua 会将 Lua 中的全局变量以 Tab1e 的方式全部存储在 G1obal 中
    //通过运行环境，导出全局变量，类型是 LuaTable
    //LuaTab1e 是 c#的数据对像，用于和 Lua 中的全局变量存储的 tablej 对应 
    LuaTable g = xLuaEnv.Instance.Global;
    
    //从 Lua 中，将全局变量提取出来/参数：Lua 中全局变量的名称
    //类型：Lua 中全局变量的名称所对应的类型/返回值：变量的值
int num = g.Get<int>("num");
float rate = g.Get<float>("rate");
bool isWoman = g.Get<bool>("isWoman");
string name = g.Get<string>("name");
Debug.Log("数字：" + num);
Debug.Log("浮点数：" + nun;
Debug.Log("布尔：" + num);
Debug.Log("字符串：" + num);
}
```
```lua
//隐性做了{num=108.rate=99.99.isWoman=fa1se.name="admin")
num 100
rate = 99.99
isWoman = false 
name = "admin"
```

### **2.C#调用Lua函数 **

```lua
func1 function()
	print("这是 Lua 中的 func1")
end

func2 function(name)
    print("这是 Lua 中的 func2,参数是：" ..name) 
end

func3 function()
	return "这是 Lua 中的 func3"
end

func4 function()
	return "这是 Lua 中的 func4",100
end
```



```c#
public delegate void Func1();
public delegate void Func2(string name);
public delegate string Func3();

[CSharpCallLua]//映射产生时,xLua提示添加的,多返回值
public delegate void Func4(out string name.out int id);

public class CsharpCallFunction MonoBehaviour void Start()
{
    xLuaEnv.Instance.DoString("return require('L2C/CsharpCallFunctio')");
    
    LuaTable .xLuaEnv.Instance.Global;
    //lua 的函数，会导出为 c#的委托类型 
    Func1 func1 = g.Get<Func1>("func1");
    func1();
    
    Func2 func2 g.Get<Func2>("func2");
    func2("admin");

	Func3 func3 g.Get<Func3>("func3");
    Debug.Log(func3()+”,被 c 打印")；
    //g.Get<>("func4");
                
    Func4 func4 = g.Get<Func4>("func4");
    string name;
    int id;
    func4(out name.out id);
    Debug.log(name + "," + id);
}
```



### **3.C#调用Lua表 **

```lua

Core = {}
Core.ID = 100
Core.Name = "root"
Core.IsWoman = false

Core.Func1  = function(name)
	print("这是 Core 表的 Func1 函数，接收到 C#数据" .. name) 
end

Core.Func2 = function()
	return "这是 Core 表的 Func2 函数"
end

Core.Func3 = function(self)
	print("这是 Core 表的 Func3 函数，Core 表的成员变量 Name 是" ..self.Name) 
end

function Core:Func4()
	print("这是 Core 表的 Func4 函数，Core 表的成员变量 Name 是" ..seLf.Name)
end

```

```c#
public delegate void OnestringParams(string name);//一个字符串参数

public delegate string OnestringReturn();//一个字符串返回

//结构体
public delegate void TransSelf(LuaTable table);//一个字符串返回
[CSharpCallLua]
public delegate void TransMy(LuaCore table);
;//一个字符串返回 

//lua 的 tab1e 导出到 C 的结构体，可以实现 c# 运行时无 CG 
[GCOptimize]
public struct LuaCore 
{
    public int ID;
    public string Name;
    public bool IsWoman;
    
    public OnestringParams Func1;
    public OnestringReturn Func2;
    public TransMy Func3;
    public TransMy Func4;
}

public class CsharpCallTable : MonoBehaviour {
    void Start()
    {
        xLuaEnv.Instance.DoString("return require('L2C/CsharpCallTable')");
        
        //UseLuaTable();

    }
   public void UseLuaTable()
   {
        LuaTable g = xLuaEnv.Instance.Global;
        
        //获取的是全局变量 Core,因为它在 Lua 中是表，所以取出的是LuaTable 
        LuaTable core = g.Get<LuaTable>("Core");
        //获取 Name
        //参数：table 中索引名/类型：索对应值的类型
        Debug.Log(core.Get<string>("Name"));

        core.Set<string,string>("Name","admin");

        OnestringParams osp = core.Get<OneStringParams>("Func1");
        osp("admin");

        //相当于":"调用
        TransSelf ts = core.Get<TransSelf>("Func4"); 
        ts(core);
   } 
   public void Usestruct()
   {
        LuaTable g = xLuaEnv.Instance.Global;
        //将 Lun 的 table 导出为 core
        Luacore core = g.Get<Luacore>("Core");
        Debug.Log(core.Name);
        core.Func4(core);   
   }

}
```
