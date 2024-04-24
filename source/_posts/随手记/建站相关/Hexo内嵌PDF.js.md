---
title: Hexo内嵌PDF.js
date: 2023-11-12
tags:
  - 建站相关
  - Hexo内嵌PDF
---

# 作者：Sw_Zap https://www.bilibili.com/read/cv22329422/  出处：bilibili

由于hexo-pdf插件在移动端只能显示第一页，所以我之前只能再给PDF文件多放一个下载按钮，否则移动端就没法看谱子了。

今天偶然看到mozilla的PDF.js项目（演示：https://mozilla.github.io/pdf.js/web/viewer.html），就冲着它带着“js”的后缀，感觉是可以整合进网站的，于是啥也不懂的我开始拷问chatGPT，让它教我怎么把PDF.js用于个人的网站，最后感觉效果还不错，所以特此分享如下。

去项目主页下载整个项目：https://mozilla.github.io/pdf.js/   （我下载的版本是：Stable (v3.4.120)）

在\source下建立一个文件夹（我建了个文件夹叫“pdfjs”），把解压出来的文件放进去

在.md文件的适当位置写入：

```html
<div>
  <iframe src="/pdfjs/web/viewer.html?file=/（PDF位于的文件夹）/（PDF文件名）.pdf" width="100%" height="500px" frameborder="0"></iframe>
</div>
```

4. 最后在“_config.yml”文件中的skip_render下要包括:

skip_render:
    - 'pdfjs/**/*'
然后就可以了！

效果展示：https://schenad.github.io/JohashiTrioV/

如果要全屏显示，直接加入一个按钮链接到前面“<iframe src=”之后的链接就行了，例如这个：https://schenad.github.io/pdfjs/web/viewer.html?file=/JohashiTrioV/Stay_Gold.pdf
