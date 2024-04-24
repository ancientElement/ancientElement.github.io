---
title: 关于Unity与安卓混合开发
categories:
  - 随手记
date: 2024-03-23 12:23
tags:
  - 随手记
series:
  - 随手记
update: 2024-04-06
---
## Reference

[Unity 与 Android 、IOS (一) 打包与交互](https://www.bilibili.com/video/BV1Qt4y1a7aW/?spm_id_from=..search-card.all.click) 视频3h57m
[Unity3D 实用技巧 - 原生移动端与Unity混合开发之学习篇 - 技术专栏 - Unity官方开发者社区](https://developer.unity.cn/projects/5fba7392edbc2a1250825de1) 

## 环境配置

1.配置应用图标

2.配置启动动画

3.安装JDK、JRE

4.配置JAVA环境变量

5.在Unity的额外工具(Extend Tool)中配置JDK、JRE

6.下载android studio

7.下载安卓模拟器进行调试

8.将SDK复制到Unity中

## 使用AndroidStudio打包

1.将Unity项目导出为Android项目

2.使用AndroidStudio打包和签名

## C#调用Java

unity提供了`AndroidJavaClass`与`AndroidJavaObject`代表Java的**类**与**对象**。

使用AndroidStudio创建**类库**，来为C#提供对应的Java类，而不是以**独立项目**运行。

>注意这里如果你创建的是独立项目需要将`bulid.gradle`下的`plugins`的`id`更改为`com.android.library`
>并且将`android`下的打包信息删除，如`defaultConfig`和`bulidTypes`、`compileOptions`都删除。

写好Java代码后,构建该类库,导出arr程序集，将**Jar包**放入Unity中来使用。

## 调用Jar包

1. **AndroidJavaClass**

通过`AndroidJavaClass`类,[AndroidJavaClass - Unity 脚本 API](https://docs.unity.cn/cn/2021.3/ScriptReference/AndroidJavaClass.html)

```csharp
var java = new AndroidJavaClass(类名);
```


常用的方法: 

| Name                                                                                | Des                 | Params                                     |
| ----------------------------------------------------------------------------------- | ------------------- | ------------------------------------------ |
| [Call](https://docs.unity.cn/cn/2021.3/ScriptReference/AndroidJavaObject.Call.html) | 对对象（非静态）调用 Java 方法。 | (string methodName, params object[] args); |
| [Get](https://docs.unity.cn/cn/2021.3/ScriptReference/AndroidJavaObject.Get.html)   | 获取对象（非静态）中的字段值。     | (string fieldName);                        |
| [Set](https://docs.unity.cn/cn/2021.3/ScriptReference/AndroidJavaObject.Set.html)   | 设置对象（非静态）中的字段值。     | (string fieldName, FieldType val);         |

2. **AndroidJavaObject**

通过`AndroidJavaObject`类,[AndroidJavaObject - Unity 脚本 API](https://docs.unity.cn/cn/2018.4/ScriptReference/AndroidJavaObject.html)

```csharp
var javaObject = AndroidJavaObject(className,args);
```

| Name                                                                                | Des                 | Params |
| ----------------------------------------------------------------------------------- | ------------------- | ------ |
| [Call](https://docs.unity.cn/cn/2018.4/ScriptReference/AndroidJavaObject.Call.html) | 对对象（非静态）调用 Java 方法。 |        |
| [Get](https://docs.unity.cn/cn/2018.4/ScriptReference/AndroidJavaObject.Get.html)   | 获取对象（非静态）中的字段值。     |        |
| [Set](https://docs.unity.cn/cn/2018.4/ScriptReference/AndroidJavaObject.Set.html)   | 设置对象（非静态）中的字段值。     |        |

### **AndroidJavaClass**和**AndroidJavaObject**的区别

`AndroidJavaClass` 和 `AndroidJavaObject` 都是 Unity 中用于与 Android 原生代码进行交互的类，但它们有不同的作用和用法。

1. **AndroidJavaClass**：
   - `AndroidJavaClass` 用于表示一个 Java 类，可以通过它来调用 Java 类的静态方法和静态属性，以及创建 Java 类的实例。
   - 通常情况下，当你需要调用一个不需要实例的静态方法时，可以使用 `AndroidJavaClass`。
   - 通过 `AndroidJavaClass`，你可以访问 Android SDK 中的系统类或自定义的 Java 类。

2. **AndroidJavaObject**：
   - `AndroidJavaObject` 用于表示一个 Java 对象的实例，可以通过它来调用 Java 对象的实例方法和访问实例属性。
   - 当你需要与 Java 对象进行交互，调用它的方法或者获取/设置它的属性时，可以使用 `AndroidJavaObject`。
   - 通过 `AndroidJavaObject`，你可以创建一个新的 Java 对象实例，也可以获取已经存在的 Java 对象的实例。

总结：
- 如果要调用一个 Java 类的静态方法或静态属性，使用 `AndroidJavaClass`。
- 如果要调用一个 Java 对象的实例方法或实例属性，使用 `AndroidJavaObject`。

## JAVA 调用 C\#

在Unity中找到下面文件夹的JAR包。

![](images/posts/Pasted%20image%2020240405171157.png)

将JAR包放在对应Android工程的libs文件夹,再将JAR包添加进工程。

### UnitySendMessage

| Name                            | Des       | Params                              |
| ------------------------------- | --------- | ----------------------------------- |
| `UnityPlayer::UnitySendMessage` | 调用Unity方法 | (GameObjectName,MethodName,Params); |

```java
UnityPlayer.UnitySendMessage("Canvas","TestMethod","Hello Csharp");
```

打包文件中`arr_main_jar`是我们写的JAVA代码,`debug/libs`是我们依赖的文件,比如上面使用的Unity的JAR包，或者使用微信的SDK都在这里面。

## 安卓工程目录

![](images/posts/Pasted%20image%2020240405173233.png)

## Launcher/AndroidManifest

安卓包的配置文件

配置了安卓APK的名称、包名、图标等等。

## unityLibary/AndroidManifest

配置了主要场景Activity,可以将Activity理解成一个Unity场景。

## UnityPlayerActive

[扩展 UnityPlayerActivity Java 代码 - Unity 手册 (unity3d.com)](https://docs.unity3d.com/cn/2019.4/Manual/AndroidUnityPlayerActivity.html)

![](images/posts/Pasted%20image%2020240405174240.png)

该类中有Activty的生命周期函数,`OnCreate OnPause ...`。

扩展 `UnityPlayerActivity` 时，可覆盖 `String UnityPlayerActivity.updateUnityCommandLineArguments(String cmdLine)` 以将**启动参数**传递给 **Unity**。

`UnityPlayerActivity` 会在**启动**期间调用此方法。它接受当前的命令行参数（这些参数可为 null 或为空），并返回新的命令行参数字符串以**传递**给 Unity。

或者继承`UnityPlayerActivity`之后重写其生命周期,在接入SDK等需求时可以在其中添加代码。

`UnityPlayer::CurentActivety`: 保存了当前的`UnityPlayerActivity`。

## 权限问题

先要在`AndroidManifest`配置权限。

![](images/posts/Pasted%20image%2020240406213546.png)

使用`UnityEngin::Android::Premission`获取权限,具体请看[请求权限 - Unity 手册](https://docs.unity.cn/cn/2020.3/Manual/android-RequestingPermissions.html)

[Android.Permission - Unity 脚本 API](https://docs.unity.cn/cn/2020.3/ScriptReference/Android.Permission.html)

### 静态变量

|   |   |
|---|---|
|[Camera](https://docs.unity.cn/cn/2020.3/ScriptReference/Android.Permission.Camera.html)|在请求权限或检查是否已授予摄像机使用权限时使用。|
|[CoarseLocation](https://docs.unity.cn/cn/2020.3/ScriptReference/Android.Permission.CoarseLocation.html)|在请求权限或检查是否已授予使用粗粒度用户位置的权限时使用。|
|[ExternalStorageRead](https://docs.unity.cn/cn/2020.3/ScriptReference/Android.Permission.ExternalStorageRead.html)|在请求权限或检查是否已授予从外部存储（如 SD 卡）读取的权限时使用。|
|[ExternalStorageWrite](https://docs.unity.cn/cn/2020.3/ScriptReference/Android.Permission.ExternalStorageWrite.html)|在请求权限或检查是否已授予写入外部存储（如 SD 卡）的权限时使用。|
|[FineLocation](https://docs.unity.cn/cn/2020.3/ScriptReference/Android.Permission.FineLocation.html)|在请求权限或检查是否已授予使用高精度用户位置的权限时使用。|
|[Microphone](https://docs.unity.cn/cn/2020.3/ScriptReference/Android.Permission.Microphone.html)|在请求权限或检查是否已授予麦克风使用权限时使用。|

### 静态函数

|                                                                                                                                    |                              |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| [HasUserAuthorizedPermission](https://docs.unity.cn/cn/2020.3/ScriptReference/Android.Permission.HasUserAuthorizedPermission.html) | 检查用户是否已授予对设备资源或需要授权的信息的访问权限。 |
| [RequestUserPermission](https://docs.unity.cn/cn/2020.3/ScriptReference/Android.Permission.RequestUserPermission.html)             | 请求用户授予对设备资源或需要授权的信息的访问权限。    |
| [RequestUserPermissions](https://docs.unity.cn/cn/2020.3/ScriptReference/Android.Permission.RequestUserPermissions.html)           | 请求用户授予对设备资源或需要授权的信息的访问权限。    |

## IOS真机调试

 先安装UnityIOS支持插件。

还要Apple的设备,有点难绷,先看看呗。

## C\#调用Object-C

C\#调用Object-C可以直接将`.mm`文件放置到Unity项目中。

![](images/posts/Pasted%20image%2020240407160720.png)

![](images/posts/Pasted%20image%2020240407160701.png)

这个extend关键字是个什么鬼。

## Object-C调用

### UnitySendMessage

| Name                            | Des       | Params                              |
| ------------------------------- | --------- | ----------------------------------- |
| `UnityPlayer::UnitySendMessage` | 调用Unity方法 | (GameObjectName,MethodName,Params); |

```java
UnityPlayer.UnitySendMessage("Canvas","TestMethod","Hello Csharp");
```

这几节课都太水了。

## UnityAppController

与UnityPlayerActivity类似,有一些应用的生命周期`lauchOptions OpenUrl`。

## PBXProject

[iOS.Xcode.PBXProject - Unity 脚本 API](https://docs.unity.cn/cn/2019.3/ScriptReference/iOS.Xcode.PBXProject.html)

在unity中配置xcode,通过此API在Xcode中添加**库文件**、**设置证书** ...。

## PlistDocument

[iOS.Xcode.PlistDocument - Unity 脚本 API (unity3d.com)](https://docs.unity3d.com/cn/2019.3/ScriptReference/iOS.Xcode.PlistDocument.html)

[iOS.Xcode.PlistElementDict - Unity 脚本 API (unity3d.com)](https://docs.unity3d.com/cn/2019.3/ScriptReference/iOS.Xcode.PlistElementDict.html)

在unity中配置xcode,通过此API在Xcode中**配置权限** ...。

## PostProcessBuild

[Callbacks.PostProcessBuildAttribute - Unity 脚本 API (unity3d.com)](https://docs.unity3d.com/cn/2020.3/ScriptReference/Callbacks.PostProcessBuildAttribute.html)

![](images/posts/Pasted%20image%2020240407162933.png)

配置该特性的方法在**打包**时会调用,配合上面两个API可以进行配置Xcode。