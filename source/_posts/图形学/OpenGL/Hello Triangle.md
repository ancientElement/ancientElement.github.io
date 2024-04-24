---
title: Hello Triangle
categories:
  - 图形学
  - OpenGL
date: 2024-03-14 18:34
tags:
  - OpenGL
series:
  - OpenGL
---
## VAO和VBO

**VAO（Vertex Array Object）：**

- VAO是OpenGL中的顶点数组对象，用于封装和管理顶点数组的状态。
- VAO存储了顶点数组的配置信息，包括顶点属性的格式、绑定的顶点缓冲对象（VBO）等。
- 使用VAO可以方便地定义和管理顶点数据，减少了重复代码的编写，并提高了渲染效率。

>就跟我们软光栅中读取出来`.obj`一样，有顶点信息、面信息、法线信息、UV信息

**VBO（Vertex Buffer Object）：**

- VBO是OpenGL中的顶点缓冲对象，用于存储顶点数据和其他相关数据。
- VBO可以存储顶点的位置、法线、纹理坐标等数据，并通过索引来访问这些数据。
- 使用VBO可以将顶点数据存储在显存中，提高了数据传输的效率，并减少了CPU和GPU之间的数据传输次数。
- VBO可以与VAO结合使用，通过绑定到VAO来实现对顶点数据的管理和渲染。

```C++
// 顶点数据
float vertices[] = {
    -0.5f, -0.5f, 0.0f,
    0.5f, -0.5f, 0.0f,
    0.0f, 0.5f, 0.0f
};

// 创建VAO
unsigned int VAO;
glGenVertexArrays(1, &VAO);

// 创建VBO
unsigned int VBO;
glGenBuffers(1, &VBO);
glBindBuffer(GL_ARRAY_BUFFER, VBO);
glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
```

这段代码的作用是创建一个包含三个顶点的三角形，并将顶点数据存储到VBO中。首先，通过调用`glGenVertexArrays`函数生成一个VAO对象，然后通过调用`glGenBuffers`函数生成一个VBO对象。接着，使用`glBindBuffer`函数将VBO绑定到GL_ARRAY_BUFFER目标上，并调用`glBufferData`函数将顶点数据复制到VBO中。最后，通过VAO和VBO来管理顶点数据，以便后续的渲染操作。

```C++
glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
```
  
绑定操作的目的是告诉OpenGL接下来的操作将应用到哪个对象上。在这段代码中，调用`glBindBuffer`将VBO绑定到了`GL_ARRAY_BUFFER`目标上，这意味着接下来对`GL_ARRAY_BUFFER`的操作将影响到这个VBO对象。

`glBufferData`函数用于将数据复制到当前绑定的缓冲区对象中。它的参数含义如下：

- `GL_ARRAY_BUFFER`：指定缓冲区的类型，这里是顶点缓冲区。
- `sizeof(vertices)`：顶点数据的大小，以字节为单位。
- `vertices`：指向包含顶点数据的数组的指针。
- `GL_STATIC_DRAW`：指定了缓冲区中的数据将如何被使用。`GL_STATIC_DRAW`表示数据将不会或几乎不会被修改，并且将被画很多次。

综合来看，这行代码的作用是将顶点数据复制到VBO中，并告诉OpenGL这些数据是静态的，不会经常修改。


