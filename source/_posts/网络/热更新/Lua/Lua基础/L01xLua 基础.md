---
tags: ["Lua基础","Lua","热更新","Unity"]
date: 2023-07-07
title: L01 xLua 基础
---
### **1.c# 调用 lua**

```cs
void Start(){
    //lua 是解释型语言，所以需要获得 1ua 的解析器
    //xLua 解析器获得 
    LuaEnv env new LuaEnv();
    //解析器运行 Lua 代码，把字符串当成 Lua 代码执行 
    env.DoString("print('Hello world!')");
    //解析器释放 
    env.Dispose();
}
```

### **2.lua 调用 c#  ** 

```cs
void Start() {
    //LuaCallCSharpCode();
    LuaReturnData();
    //使用 Lua 调用 C#代码
}

public void LuaCallCSharpCode() {
    LuaEnv env new LuaEnv();
    //Lua 调用 C#代码(C5.命名空间.类名.方法名（参数）) 
    env.DoString("CS.UnityEngine.Debug.Log('from lua')");
    env.Dispose();
}
    //Lua 返回值给 C#
public void LuaReturnData() {
    LuaEnv env new LuaEnv();
    object[]data env.DoString("return 100.true");
    Debug.Log("Lua 的第一个返回值："+data[o].ToString());
    Debug.Log("Lua 的第二个返回值："+data[1].ToString());
    env.Dispose();
}
```

### **3.Lua加载器**

```cs
void Start(){
    LuaEnv env new LuaEnv();
    //对应 test.1ua
    //内置加载器会扫描预制的目录，查找是否存在 test,1ua /xLua 存在默认加载器，StreamingAssets 目录下可以加载文件 
    env.DoString("require('test')");
    env.Dispose();
}
```
### **4.自定义加载器**
```cs
public void MyLoader() {
    LuaEnv env new LuaEnv();
    //将我定义的加载器，加入到 xLua 的解析环境中 
    env.AddLoader(ProjectLoader);
    env.DoString("require('test1')");
    env.Dispose();
} 

//自定义加载器
//自定义加载器，会先于系统内置加载器执行，当自定加载器加载到文件后，后续的加载器则不会继续执行
//当 Lua 代码执行 require() 函数时，自定义加载器会尝试获得文件的内容
//参数：被加载 Lua 文件的路径
public byte[]
    ProjectLoader(ref string filepath) {
    //filepath 来自于 Lua 的 require("文件名")
    //构造路径，才能将 require 加载的文件指向到我们想放 Lua 的路径下去 
    string path = Application.dataPath;
    path = path.Substring(0.path.Length -7)+"/DataPath/Lua/"+ filepath +".lua";
    //将 Lua 文件读取为字节数组
    //xLua 的解析环境，会执行我们自定义加载器返回的 Lua 代码 
    if(File.Exist(path)) {
        return File.ReadAllBytes(path);
    }
    else {
        return null;
    }
}
```
