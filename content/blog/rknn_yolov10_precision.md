---
title: "RK3588 yolov10精度问题"
date: "2025-04-30"
excerpt: "提升rk3588 yolov10 runtime精度文档"
tags: ["RK3588", "神经网络", "python"]
---

正在研究中...

## 问题描述
最近训练了pt文件（yolo），通过瑞芯微提供的框架转换成了onnx
官方提供的ultralytics：

1.置信度分支添加sigmoid算子

2.移除后处理结构，

3.移动dfl结构到模型外部

因此三个检测头变成了六个检测头，我再把onnx（float32）转成rknn（float16）时，模型精度分析发现模拟器simulator的余弦相似度和golden差不多，但是runtime（板端）测试时，这三个置信度输出的检测头余弦相似度特别低。实测时置信度低了很多(10%-40%)
![图片描述](/images/blog/precise.png)
![图片描述](/images/blog/precise2.png)
初步怀疑是sigmoid的原因。
![图片描述](/images/blog/yolov10_offcial.png)
<center>图1：yolov10原版检测头，分类和回归一起输出</center>

![图片描述](/images/blog/yolov10_onnx1.png)
<center>图2：修改后的检测头，置信度加sigmoid层，分类头放后处理部分</center>

根据图2来看,其他层用sigmoid不受影响的主要原因可能是因为用了残差连接
查看.pt文件发现,yolov10原本是采用了SiLU函数,在用官方文档导出onnx后SiLU被拆解为Sigmoid和Mul操作的组合（SiLU(x) = x * Sigmoid(x)）

而置信度输出的sigmoid部分是为了把置信度限制到(0,1),有可能瑞芯微做模型量化修改的和做算子优化的不是同个人,不知道sigmoid会有算子失真问题.
(这里准备去看瑞芯微提供的NPU算子,很有可能是用了查表法实现非线性激活函数量化https://zhuanlan.zhihu.com/p/638006169)

## 激活函数
![图片描述](/images/blog/stimulate_function.png)
从精度上来看在小数特别小（接近0）或特别大（接近1）的时候，float16只有10个有效位，容易发生数值塌陷或者数值跳变。
sigmoid对输入的变化非常敏感float16在输入x很大（比如>6）或者很小（<-6）时，就几乎输出1或0了，导致梯度爆炸/塌陷。