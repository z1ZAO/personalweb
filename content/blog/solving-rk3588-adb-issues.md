---
title: "ubuntu虚拟机连板调试rk3588-debug adb"
date: "2025-4-26"
excerpt: "通过连板方式查看onnx->rknn的模型量化精度"
tags: ["Linux", "ONNX", "ADB", "RK3588"]
---


背景：最近想把实验室工控机上的工业检测项目整套移植到RK3588上，目前在Arm核上（torch）和NPU（C++ 和 python）均已跑通，因此想通过连板方式查看onnx->rknn的模型量化精度。

我是使用Nanopi R6C，已经使用ssh和uart 在pc端实现连接。

## 连接步骤

1. typec 连pc，可用串口调试助手检查

2. 打开虚拟机，弹出窗口后选择ubuntu系统

3. 在ubuntu系统下载adb: 
   \`\`\`bash
   sudo apt-get install adb
   \`\`\`

4. ssh rk3588,

   再 cd /usr/bin目录，执行 start_rknn.sh（NanoPi R6C/zh - FriendlyELEC WiKi）

5. 在虚拟机（已装好rk环境）查看 adb devices 看看是否已经有设备id ，如果没有，查看adb驱动

找到设备可以运行校准程序.py 若有报错，如

\`\`\`
adb: unable to connect for root: closed
adb: error: remote object '/userdata/dumps' does not exist
mv: cannot stat './snapshot/runtime/dumps': No such file or directory
E accuracy_analysis: Traceback (most recent call last):
\`\`\`

## 解决方案

参考：运行mobilenet的"模型精度评估"例程报错，板端提示failed open dump path: /userdata/dumps/000_InputOperator_input_shape_1_3_224_224_uint8.npy · Issue #118 · airockchip/rknn-toolkit2

执行以下步骤：
  
adb shell在板端创建文件夹

1. 如果报一些userdata权限相关问题，可以在adb shell里chmod 777以下这个文件夹

2. root相关，也有可能是权限问题

   执行：
   \`\`\`bash
   sudo chmod 777 /usr/bin/adb 
   \`\`\`

最后根据官方提供例程，可以在npu上执行，并生成以下一些文件，接下来就可以根据精度自行修改模型或者量化方法