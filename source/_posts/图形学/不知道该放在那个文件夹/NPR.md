---
title: NPR
categories:
  - 图形学
  - 不知道该放在那个文件夹
date: 2024-04-03
tags:
  - 不知道该放在那个文件夹
series:
  - 不知道该放在那个文件夹
---
![](images/posts/Pasted%20image%2020240404173146.png)

<!--more-->
## Reference

[卡通渲染及其相关技术 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/26409746)

[Unity NPR之日式卡通渲染（基础篇） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/129291888)

[【01】从零开始的卡通渲染-描边篇 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/109101851)

[NPR描边学习笔记 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/549510719)

[Unity Outline Shader Tutorial - Roystan --- Unity 轮廓着色器教程 - Roystan](https://roystan.net/articles/outline-shader/)

## 上面链接讲的非常好我就不瞎逼逼了

## 描边

### 方法一:法线外扩

#### 如何实现?

使用两个渲染通道一个通道**正常渲染**，一个通道**渲染描边**。

1. 描边通道中,在顶点着色器中将顶点**沿着法线方向外扩**。

```cpp
o.vertex = UnityObjectToClipPos(v.vertex + v.normal * _EdgeWidth);
```

2. 再**剔除正面**。

```cpp
Cull front
```

#### 代码

```cpp
Shader "Unlit/NewUnlitShader"  
{  
    Properties  
    {  
        _MainColor ("颜色", Color) = (1,1,1,1)  
        _EdgeColor ("边缘颜色", Color) = (1,1,1,1)  
        _EdgeWidth ("边缘宽度", Float) = 0  
    }  
    SubShader  
    {  
        Tags  
        {  
            "RenderType"="Opaque"  
        }  
        LOD 100  
  
        Pass  
        {  
            CGPROGRAM  
            #pragma vertex vert  
            #pragma fragment frag  
            // make fog work  
            #pragma multi_compile_fog  
  
            #include "UnityCG.cginc"  
  
            struct appdata  
            {  
                float4 vertex : POSITION;  
                float2 uv : TEXCOORD0;  
            };  
            struct v2f  
            {  
                float2 uv : TEXCOORD0;  
                float4 vertex : SV_POSITION;  
            };  
            float4 _MainColor;  
  
            v2f vert(appdata v)  
            {                v2f o;  
                o.vertex = UnityObjectToClipPos(v.vertex);  
                return o;  
            }  
            fixed4 frag(v2f i) : SV_Target  
            {  
                fixed4 col = _MainColor;  
                return col;  
            }            ENDCG  
        }  
  
        Pass  
        {  
            Cull front  
            CGPROGRAM            #pragma vertex vert  
            #pragma fragment frag  
            // make fog work  
            #include "UnityCG.cginc"  
            struct appdata  
            {  
                float4 vertex : POSITION;  
                float4 normal : NORMAL;  
                float2 uv : TEXCOORD0;  
            };  
            struct v2f  
            {  
                float2 uv : TEXCOORD0;  
                float4 vertex : SV_POSITION;  
            };  
            float4 _EdgeColor;  
            float _EdgeWidth;  
  
            v2f vert(appdata v)  
            {                v2f o;  
                o.vertex = UnityObjectToClipPos(v.vertex + v.normal * _EdgeWidth);  
                return o;  
            }  
            fixed4 frag(v2f i) : SV_Target  
            {  
                return _EdgeColor;  
            }            ENDCG  
        }  
    }}
```

### 存在的问题

#### 描边大小随摄像机的远近变化

顶点转化到屏幕空间再外扩。

```cpp
v2f o;
float4 pos = UnityObjectToClipPos(v.vertex);
//MVP变换转化到屏幕空间
float3 viewNormal = mul((float3x3)UNITY_MATRIX_IT_MV, v.normal.xyz);
float3 ndcNormal = normalize(TransformViewToProjection(viewNormal.xyz)) * pos.w;
pos.xy += 0.01 * _EdgeWidth * ndcNormal.xy;
o.pos = pos;
return o;
```

#### 描边大小随窗口宽度改变

因为我们再屏幕空间中进行法线外扩,视口矩阵中就有窗口的大小,使得边的粗细根据窗口大小变化。

我们在这里除掉宽高比产生的影响。

```cpp
float4 nearUpperRight = mul(unity_CameraInvProjection, float4(1, 1, UNITY_NEAR_CLIP_VALUE, _ProjectionParams.y));//将近裁剪面右上角位置的顶点变换到观察空
float aspect = abs(nearUpperRight.y / nearUpperRight.x);//求得屏幕宽高比
ndcNormal.x *= aspect;
```

最后：

![](images/posts/Pasted%20image%2020240403234714.png)


#### 但是无法渲染拐角尖锐的物体

![](images/posts/Pasted%20image%2020240403235136.png)


可以看到描边都断开了。

### 方法一改进

我们可以重新计算法线得到一个平均的法线,再写入切线空间中,为什么写入切线空间,其实在学习TinyRender的时候已经知道了。为了随着模型改变,法线也会跟着改变。

下面代码来自: [【01】从零开始的卡通渲染-描边篇 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/109101851)

```csharp
public class PlugTangentTools
{
    [MenuItem("Tools/模型平均法线写入切线数据")]
    public static void WirteAverageNormalToTangentToos()
    {
        MeshFilter[] meshFilters = Selection.activeGameObject.GetComponentsInChildren<MeshFilter>();
        foreach (var meshFilter in meshFilters)
        {
            Mesh mesh = meshFilter.sharedMesh;
            WirteAverageNormalToTangent(mesh);
        }

        SkinnedMeshRenderer[] skinMeshRenders = Selection.activeGameObject.GetComponentsInChildren<SkinnedMeshRenderer>();
        foreach (var skinMeshRender in skinMeshRenders)
        {
            Mesh mesh = skinMeshRender.sharedMesh;
            WirteAverageNormalToTangent(mesh);
        }
    }

    private static void WirteAverageNormalToTangent(Mesh mesh)
    {
        var averageNormalHash = new Dictionary<Vector3, Vector3>();
        for (var j = 0; j < mesh.vertexCount; j++)
        {
            if (!averageNormalHash.ContainsKey(mesh.vertices[j]))
            {
                averageNormalHash.Add(mesh.vertices[j], mesh.normals[j]);
            }
            else
            {
                averageNormalHash[mesh.vertices[j]] =
                    (averageNormalHash[mesh.vertices[j]] + mesh.normals[j]).normalized;
            }
        }

        var averageNormals = new Vector3[mesh.vertexCount];
        for (var j = 0; j < mesh.vertexCount; j++)
        {
            averageNormals[j] = averageNormalHash[mesh.vertices[j]];
        }

        var tangents = new Vector4[mesh.vertexCount];
        for (var j = 0; j < mesh.vertexCount; j++)
        {
            tangents[j] = new Vector4(averageNormals[j].x, averageNormals[j].y, averageNormals[j].z, 0);
        }
        mesh.tangents = tangents;
    }
}
```

这里我就没有实践了。

还有就是在Shader中读取切线空间的法线向量`float3 viewNormal = mul((float3x3)UNITY_MATRIX_IT_MV, v.tangent.xyz);`

效果还可以。

![](images/posts/Pasted%20image%2020240404173146.png)

## 方法二：基于图像处理的边缘检测法（Edge Detection by Image Processing）

基于图像处理的边缘检测法一般由**屏幕后处理**来实现。通常应用于**延迟渲染**的项目中，因为该方法需要**G-Buffer**中的深度信息、法线信息和物体ID信息等。通过获取到屏幕空间下的深度信息、法线信息和物体ID信息后，利用**边缘检测算子**来探测出**相邻**两个像素点之间的**深度值**、**法线值**和**物体ID**值**差异较大**的情况，从而找到并绘制出描边。

常见的边缘检测算子有：

![](media/v2-332aba44c993c7deae965b11c6696835_720w.webp)

3种常见的边缘检测算子

以下图为例，左上角绘制的是一张法线图，上面中间的则是深度图，左下和中下分别是经过Sobel边缘检测算子计算后的结果。当然，因为计算结果不是布尔值，我们还需要一个阈值参数来控制。右上角是将检测出的法线图和深度图叠加并扩张的效果。右下则是合成后的最终效果。

![](media/v2-80fc19c61f6f444ece2ecc2d7845bded_720w.webp)

使用基于图像处理的边缘检测的方法绘制描边的各个阶段

这个方法也没有实践。
### 留下的疑惑

这里怎么得到宽高比的不清楚

```cpp
float4 nearUpperRight = mul(unity_CameraInvProjection, float4(1, 1, UNITY_NEAR_CLIP_VALUE, _ProjectionParams.y));//将近裁剪面右上角位置的顶点变换到观察空
```

## 着色LUT

