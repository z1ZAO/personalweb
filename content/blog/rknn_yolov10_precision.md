---
title: "RK3588 yolov10精度问题"
date: "2025-05-01"
excerpt: "提升rk3588 yolov10 runtime精度文档"
tags: ["RK3588", "神经网络", "python"]
---

正在研究中...

## 问题描述
我用yolov10训练了pt文件，通过瑞芯微提供的框架转换成了onnx
官方提供的ultralytics：

1.置信度分支添加sigmoid算子

2.移除后处理结构，

3.移动dfl结构到模型外部

因此三个检测头变成了六个检测头，我再把onnx（float32）转成rknn（float16）时，模型精度分析发现模拟器simulator的余弦相似度和golden差不多，但是runtime（板端）测试时，这三个置信度输出的检测头余弦相似度特别低。
![图片描述](/images/blog/precise.png)
初步怀疑是sigmoid的原因。
![图片描述](/images/blog/yolov10_offcial.png)
<center>图1：yolov10原版检测头，分类和回归一起输出</center>

![图片描述](/images/blog/yolov10_onnx1.png)
<center>图2：修改后的检测头，置信度加sigmoid层，分类头放后处理部分</center>