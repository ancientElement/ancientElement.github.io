---
tags: ["AB包","热更新","Unity"]
date: 2023-07-07
title: AB包 /images/wallhaven-d6d6kg.jpg
---
## 加载AB包

```cs
AssetBundle ab = AssetBundle.loadFromFile(Appliaction.streamingAssetsPath+ "/" + "modle");
```

## 加载包中资源

```cs
GameObject obj = ab.LoadAsset<GameObject>("Cube");
Instantiate(obj);
```

## 异步加载

```cs
AssetBundle ab = AssetBundle.loadFromFileAsync(Appliaction.streamingAssetsPath+ "/" + "modle");

GameObject obj = ab.LoadAssetAsync<GameObject>("Cube");
Instantiate(obj);
```



## 卸载AB包

1. AssetBundle.UnloadAllAssetBundles 所有资源

```cs
AssetBundle.UnloadAllAssetBundles(true);//卸载所有AB包 参数为true会把加载的资源也卸载

AssetBundle.UnloadAllAssetBundles(false);//卸载所有AB包 参数为false不会把加载的资源卸载
```

2. ab.Unload 单个包

```cs
AssetBundle ab = AssetBundle.loadFromFileAsync(Appliaction.streamingAssetsPath+ "/" + "modle");

GameObject obj = ab.LoadAssetAsync<GameObject>("Cube");
Instantiate(obj);

ab.Unload();
```



## AB包依赖

资源依赖了别的资源需要加载依赖的资源

```cs
```



## AB包主包

1. 个资源身上用到了别的 AB 包中的资源这个时候如果只加载自己的 AB 包 通过它创建对象会出现资源丢失的情况

2. 这种时候需要把依赖包一起加载了才能正常

```cs
//加载主包
AssetBundle abMain = AssetBundle.LoadFromFile (Application. streamingAssetsPath + "/" + "PC");
                                             
//加载主包中的固定文件
AssetBundleManifest abManifest = abMain. LoadAsset<AssetBundleManifest>("AssetBundleManifest");

//从固定文件中得到依赖信息
string[]strs  = abManifest.GetAllDependencies ("model");

//得到了依赖包的名字 加载依赖
for (int i=0; i<strs. Length; i++)
{
    AssetBundle.LoadFromFile(Application. streamingAssetsPath +"/" + strs[i])
}
```



