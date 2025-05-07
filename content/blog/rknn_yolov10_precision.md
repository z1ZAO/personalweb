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

## 尝试解决
### 初步怀疑是sigmoid的原因
![图片描述](/images/blog/yolov10_offcial.png)
<center>图1：yolov10原版检测头，分类和回归一起输出</center>

![图片描述](/images/blog/yolov10_onnx1.png)
<center>图2：修改后的检测头，置信度加sigmoid层，分类头放后处理部分</center>

根据图2来看,其他层用sigmoid不受影响的主要原因可能是因为用了残差连接
查看.pt文件发现,yolov10原本是采用了SiLU函数,在用官方文档导出onnx后SiLU被拆解为Sigmoid和Mul操作的组合（SiLU(x) = x * Sigmoid(x)）。而置信度输出的sigmoid部分是为了把置信度限制到(0,1),有可能瑞芯微做模型量化修改的和做算子优化的不是同个人,不知道sigmoid会有算子失真问题.
(这里准备去看瑞芯微提供的NPU算子,很有可能是用了查表法实现非线性激活函数量化

【NPU sigmoid算子参考】https://zhuanlan.zhihu.com/p/638006169 | https://blog.csdn.net/u011622208/article/details/123525286)

### SiLU -> ReLU
问了业内人士并查看现有的YOLOv8成熟方案，大家的做法是把激活函数SiLU换成更适用于NPU硬件架构ReLU
![图片描述](/images/blog/v8.png)
<center>图3：yolov8换成ReLU架构</center>
发现精度下降不会像yolov10明显，可以得出SiLU激活函数在部署后的目标score量化过程中存在问题，可以在混合精度量化的.cfg调整量化scale和零点（但是很难确定，有点玄学）

### 从激活函数上来看🎯 背景：量化中的 scale 与 zero point
<img src="/images/blog/stimulate_function.png" width="400" />

&emsp;从精度上来看在小数特别小（接近0）或特别大（接近1）的时候，float16只有10个有效位，容易发生数值塌陷或者数值跳变。
sigmoid对输入的变化非常敏感float16在输入x很大（比如>6）或者很小（<-6）时，就几乎输出1或0了，导致梯度爆炸/塌陷。

&emsp;在 RKNN 的 float16 模型中，虽然主干权重和激活是 float16，但在实际执行过程中某些通道还是会使用 scale（缩放因子）和 zero point（偏移量） 来辅助对齐。

&emsp;尤其是在一些关键分支（如分类头、置信度 head）中：

&emsp;&emsp;1.如果模型输出值范围比较小，比如 sigmoid 后是 01，数值集中在 0.0010.1，float16 精度本身不够。

&emsp;&emsp;2.如果 scale 选得太大（默认自动选择整个输出 tensor 的 max/min ），就会导致：

&emsp;&emsp;&emsp;&emsp;-- 小数值被压得更小，近似于0，量化之后丢失；

&emsp;&emsp;&emsp;&emsp;-- 再解码回来就变成乱七八糟，甚至全0/全1。

&emsp;这种误差不会在 PC 端模拟器中体现明显，因为模拟器往往保留 full-precision 中间值。但在板端 runtime 执行时，它使用的就是你最终编译后 quantize 的结构

## 解决方案 
#### 1.自定义算子
尝试开发一个适应性更强的npu sigmoid算子
#### 2.SiLU -> ReLU
#### 3.Sigmoid后处理 -> CPU