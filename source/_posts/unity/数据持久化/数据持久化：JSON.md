---
tags: ["数据持久化","Unity"]
date: 2023-05-24
title: 数据持久化：JSON /images/featured12.jpg
---
## 1.存储读取数据

**储存文本文件到本地**

```cs
File.WriteAllText(Application.persistentDataPath + "/Test.json","保存的字符串");
```

**注意**
1. File: 属于System.IO命名空间
2. Application.persistentDataPath: 可读写的路径

**读取文本文件**

```cs
string srt = File.ReadAllText(Application.persistentDataPath + "/Test.json")
```

## 2.序列化JsonUlity
**转化成JSON**

```cs
 string str = JsonUlity.ToJson(t);//传入对象
```

**注意**
1.  ==自定义的类==需要加上[Systm.Serializable]
2.  序列化私有变量需要加上[Serializfiled]
3. JsonUtlity不支持==字典==的序列化
4. JsonUtlity储存null时不会是null而是==默认数据==





## 3.反序列化JsonUlity

**JSON转化成类对象**

```cs  
T temp =  JsonUlity.FromJson<T>();
```

**注意**
1. 无法直接读取==数据集合==

2. 需要用一个对象包裹才行

3. 必须用==UTF-8==才行

   ![image-20230502175022681](image-20230502175022681.png)![image-20230502175030142](image-20230502175030142.png)0502175030142.png)

## 4. LitJson序列化

**转化成JSON**

```cs
string str = JsonMapper.ToJson(t);//传入对象
```

**注意**
1. 支持字典
2. 不需要加serialziable
3. 支持null
4. ==不支持私有变量==
5. 序列化时有坑 字典如果==键====是数字类型 会转化成字符串类型==

## 5. LitJson反序列化

**JSON转化成类对象**

1. JsonData类型接受数据

```cs
 JsonData jsonData = JsonMapper.ToObject(jsonStr); 
```
2. 泛型接受数据

```cs
T jsonData = JsonMapper.ToObject<T>(jsonStr);
```

**注意**

1. 序列化时类结构需要==有无参构造==函数否则会报错,写有参构造行数会顶掉无参构造函数,因为反序列化时会用的无参构造函数
2. 序列化时有坑 字典如果==键是数字类型== 会转化成字符串类型,反序列化时对应不上会报错

3. 可以直接读取数据集合
4. JOSN最后==不要加逗号==
5. UTF-8
6. 可以读取==数据集合==

## 6.对比JsonUtilty和LitJson

|             | LitJson     | JsonUtilty |
| ----------- | ----------- | ---------- |
| 自定义类        | 不需要加特性      | 需要加特性      |
| 私有变量        | 不支持         | 支特（加特性）    |
| 字典          | 支持          | 不支特        |
| 数据反序列化为数据集合 | 支持          | 不支持        |
| 自定义类构造函数    | ==要求有无参构造== | 不要求        |
| null        | ==存 nu11==  | 存储默认值      |

