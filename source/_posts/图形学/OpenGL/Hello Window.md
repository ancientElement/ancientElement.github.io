---
title: Hello Window
date: 2024-03-14 14:11
tags:
  - OpenGL
---
## 什么是GLFW和GLEW

`GLFW` (Graphics Library Framework) 和 `GLEW` (OpenGL Extension Wrangler Library) 都是用于在OpenGL应用程序中管理窗口和OpenGL函数的库。

- **GLFW** 是一个专门用于创建窗口和处理用户输入的库，它提供了一个简单的接口来创建OpenGL上下文、管理窗口的大小和位置以及处理用户输入事件等功能。GLFW被广泛用于OpenGL应用程序的开发中，因为它易于使用且跨平台兼容性良好。
    
- **GLEW** 是一个用于管理OpenGL扩展的库。OpenGL扩展是OpenGL标准之外的额外功能，通常由显卡厂商提供以支持新的图形功能。GLEW库使得在OpenGL应用程序中加载和使用这些扩展变得更加简单，它提供了一组函数来查询、加载和管理OpenGL扩展，使得开发者可以更方便地访问这些功能。
    

综上所述，GLFW用于创建窗口和处理用户输入，而GLEW用于管理OpenGL扩展。在OpenGL应用程序中，通常会同时使用这两个库来完成相关的工作。

## 初始化

```C++
//初始化语句
glfwInit();
glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
```

`glfwInit()`：初始化GLFW库，必须在使用GLFW库的任何其他函数之前调用。

`glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3)`：设置OpenGL上下文的主版本号为3。

`glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3)`：设置OpenGL上下文的次版本号为3。

`glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE)`：设置OpenGL的配置文件类型为核心配置文件，这意味着只能使用OpenGL核心功能，不包括已废弃的功能。
## Double Buffer

>When an application draws in a single buffer the resulting image may display flickering issues. This is because the resulting output image is not drawn in an instant, but drawn pixel by pixel and usually from left to right and top to bottom. Because this image is not displayed at an instant to the user while still being rendered to, the result may contain artifacts. To circumvent these issues, windowing applications apply a double buffer for rendering. The **front** buffer contains the final output image that is shown at the screen, while all the rendering commands draw to the **back** buffer. As soon as all the rendering commands are finished we **swap** the back buffer to the front buffer so the image can be displayed without still being rendered to, removing all the aforementioned artifacts.  

  
当应用程序在单个缓冲区中绘制时，可能会出现闪烁问题。这是因为生成的输出图像不是立即绘制出来的，而是像素点一次绘制出来的，通常是从左到右、从上到下绘制的。由于这个图像在渲染时并没有立即显示给用户，而是在渲染过程中，结果可能会包含一些瑕疵。为了避免这些问题，窗口应用程序使用双缓冲区进行渲染。前缓冲区包含显示在屏幕上的最终输出图像，而所有的渲染命令都绘制到后缓冲区。一旦所有的渲染命令完成，我们就将后缓冲区与前缓冲区进行交换，这样图像就可以显示出来而不是在仍在渲染过程中，从而消除所有上述的瑕疵。

说白了就是为了不让像素是一边绘制一边呈现的。

等到全部绘制好了，直接交换，防止画面撕裂

## 附录

```C++
#define GLEW_STATIC
#include <iostream>
#include <GL/glew.h>
#include <GLFW/glfw3.h>
using namespace std;

const int WIDTH = 500;
const int HEIGHT = 500;

int main() {
    //初始化语句
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    // 创建窗口对象
    GLFWwindow* window = glfwCreateWindow(WIDTH, HEIGHT, "OpenGL Window", nullptr, nullptr);
    if (!window) {
        std::cerr << "Failed to create GLFW window" << std::endl;
        //在程序结束时调用这个函数可以确保资源被正确释放，避免内存泄漏等问题
        glfwTerminate();
        return -1;
    }

    // 设置当前窗口为当前线程的主上下文
    glfwMakeContextCurrent(window);

    // 初始化GLEW
    glewExperimental = GL_TRUE;
    if (glewInit() != GLEW_OK) {
        std::cerr << "Failed to initialize GLEW" << std::endl;
        glfwDestroyWindow(window);
        glfwTerminate();
        return -1;
    }

    // 设置视口大小
    glViewport(0, 0, WIDTH, HEIGHT);

    // 主循环
    while (!glfwWindowShouldClose(window)) {
        // 清除颜色缓冲区
        glClear(GL_COLOR_BUFFER_BIT);

        // 交换缓冲区
        glfwSwapBuffers(window);
        //检查事件
        glfwPollEvents();
    }

    // 清理并退出
    glfwDestroyWindow(window);
    glfwTerminate();

    return 0;
}
```