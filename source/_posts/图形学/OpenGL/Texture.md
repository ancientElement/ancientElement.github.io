---
title: Texture
categories:
  - 图形学
  - OpenGL
date: 2024-03-25 13:22
tags:
  - OpenGL
series:
  - OpenGL
---

## Reference

[纹理 - LearnOpenGL CN (learnopengl-cn.github.io)](https://learnopengl-cn.github.io/01%20Getting%20started/06%20Textures/#_5)

**练习1:**

修改了片元着色器的UV。

```cpp
void main()  
{  
    FragColor = mix(texture(texture1, TexCoord), texture(texture2, vec2(1-TexCoord.r, TexCoord.g)), 0.2);  
}
```

![](/images/posts/Pasted%20image%2020240325152212.png)

**练习2：**

修改纹理坐标和纹理环绕方式：

```cpp
// 设置顶点数据  
float vertices[] = {  
    //---- 位置 ----   ---- 颜色 ----    - 纹理坐标 -    0.5f, 0.5f, 0.0f, 1.0f, 0.0f, 0.0f, 2.0f, 2.0f, // 右上  
    0.5f, -0.5f, 0.0f, 0.0f, 1.0f, 0.0f, 2.0f, 0.0f, // 右下  
    -0.5f, -0.5f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f, // 左下  
    -0.5f, 0.5f, 0.0f, 1.0f, 1.0f, 0.0f, 0.0f, 2.0f // 左上  
};
// set the texture wrapping parameters  
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);  
// set texture wrapping to GL_REPEAT (default wrapping method)  
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
```

![](/images/posts/Pasted%20image%2020240325152949.png)

**练习3:**

GL_NEAREST（也叫邻近过滤，Nearest Neighbor Filtering)

GL_LINEAR（也叫线性过滤，(Bi)linear Filtering）

```cpp
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);  
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
```

![](/images/posts/Pasted%20image%2020240325163649.png)

![](/images/posts/Pasted%20image%2020240325163555.png)

**练习4:**

```cpp
float tempMixVal = 0.5f;
while(...) {
	...
	if (glfwGetKey(window,GLFW_KEY_UP))  
	{  
	    tempMixVal = max(tempMixVal + 0.1f, 1.0f);  
	}  
	if (glfwGetKey(window,GLFW_KEY_DOWN))  
	{  
	    tempMixVal = max(tempMixVal - 0.1f, 0.0f);  
	}  
	  
	int mixValue = glGetUniformLocation(shader->ID, "mixValue");  
	glUniform1f(mixValue, tempMixVal);
	...
}
```

![](/images/posts/Pasted%20image%2020240325164920.png)