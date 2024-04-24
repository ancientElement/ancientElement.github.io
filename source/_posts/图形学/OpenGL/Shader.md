---
title: Shader
date: 2024-03-23 15:06
tags:
  - OpenGL
---

## Reference

[着色器 - LearnOpenGL CN (learnopengl-cn.github.io)](https://learnopengl-cn.github.io/01%20Getting%20started/05%20Shaders/)
[傅老師/OpenGL教學](https://www.bilibili.com/video/BV11W411N7b9)

这里我们从Shader类开始写了，之前的看看LearnOpenGL-CN就可以了。

## Shader类

### **Shader文本读取**

> 傅老师你要不要这么搞笑🤡

Shader类的作用，读取顶点着色器**路径**与片元着色器**路径**，并且返回对应的顶点着色器与片元着色器的**源代码常量字符数组**。

StringBuffer不能够直接转发为`char*`，所以还需要使用`string`中转。

C++中的文件流，`ifstream`，使用`Open`函数打开文件，使用**TryCatch**捕获异常。

还可以添加`ifstream::failbit | ifstream::badbit`的异常捕获。

使用`stringstream::rdbuf`将文件流中转化为字符串流，并且使用`stringstream::str`方法转化为字符串。

最后得到字符串中的字符数组`string::c_str`。

这里发现傅老师的写法**不行**，他在`Shader.h`中写了如下，用常量字符数组接收，但是

```C++
class Shader
{
public:
	const char* vertexCode;
	const char* fragmentCode;
	Shader(const string& vertexPath,const string& fragmentPath);
};
```

>  在你的 `Shader` 类构造函数中，你从文件中读取着色器源代码，并尝试将其赋值给 `vertexCode` 和 `fragmentCode`。然后，你将这些源代码转换为 C-style 字符串（通过调用 `c_str()` 函数），并尝试将它们用作着色器程序的源代码。然而，这种方法可能会导致问题，因为 `c_str()` 函数返回的指针指向**临时缓冲区**，该缓冲区在函数调用结束时会被**销毁**。
>  为了解决这个问题，你应该使用 `std::string` 对象来保存着色器源代码，并在需要时将它们作为字符数组传递给着色器程序。这里是修改后的代码：

```C++
class Shader
{
public:
	string vertexCode;
	string fragmentCode;
	Shader(const string& vertexPath,const string& fragmentPath);
};
```

在main函数中这样使用：

```C++
// 编译顶点着色器
const char* vertexSouceCode = shader->vertexCode.c_str();
unsigned int vertexShader;
vertexShader = glCreateShader(GL_VERTEX_SHADER);
glShaderSource(vertexShader, 1, &vertexSouceCode, NULL);
glCompileShader(vertexShader);
```


### Shader**编译报错**

#### 顶点着色器编译

- 创建顶点着色器对象：使用 `glCreateShader(GL_VERTEX_SHADER)`
- 设置着色器源代码：使用 `glShaderSource(vertexID, 1, &vertexSourceCode, NULL)`
- 编译着色器：使用 `glCompileShader(vertexID)`
- 获取编译状态：使用 `glGetShaderiv(vertexID, GL_COMPILE_STATUS, &success)`
  - 如果编译失败，则获取编译日志：使用 `glGetShaderInfoLog(vertexID, 512, NULL, infoLog)`

#### 片元着色器编译

- 创建片元着色器对象：使用 `glCreateShader(GL_FRAGMENT_SHADER)`
- 设置着色器源代码：使用 `glShaderSource(fragmentID, 1, &fragmentSourceCode, NULL)`
- 编译着色器：使用 `glCompileShader(fragmentID)`
- 获取编译状态：使用 `glGetShaderiv(fragmentID, GL_COMPILE_STATUS, &success)`
  - 如果编译失败，则获取编译日志：使用 `glGetShaderInfoLog(fragmentID, 512, NULL, infoLog)`

#### 着色器程序链接

- 创建着色器程序对象：使用 `glCreateProgram()`
- 将顶点着色器和片元着色器附加到程序对象：使用 `glAttachShader(ID, vertexID)` 和 `glAttachShader(ID, fragmentID)`
- 链接程序对象：使用 `glLinkProgram(ID)`
- 获取链接状态：使用 `glGetProgramiv(ID, GL_LINK_STATUS, &success)`
  - 如果链接失败，则获取链接日志：使用 `glGetProgramInfoLog(ID, 512, NULL, infoLog)`

