---
title: "Windows11下利用WSL2的Ubuntu系统部署lerobot运行环境"
date: "2024-06-01"
excerpt: "详细介绍如何在Windows11系统下通过WSL2配置Ubuntu环境并部署lerobot机械臂"
tags: ["WSL2", "Ubuntu", "Lerobot", "机械臂"]
---


Windows11下利用WSL2的Ubuntu系统部署lerobot运行环境

平台：Windows11 专业版本 23H2    WSL2     Ubuntu22.04

前段时间和AAA蛏干批发吴哥一起学习pi0，把他博客摘过来记录一下（量子微辣辣） 
## 配置WSL2

1. 打开搜索栏搜索"启用或关闭Windows功能"，勾选图中两个选项；
![图片描述](/images/blog/wsl_lerobot_deployment/image1.png)
2. 打开PowerShell（以管理员身份）并运行以下命令来更新WSL：wsl –update，将WSL设置为默认版本：wsl --set-default-version 2。
![图片描述](/images/blog/wsl_lerobot_deployment/image2.png)
PS:
在配置WSL之前需要查询Windiw系统是否已经开启了虚拟化功能（在任务管理器中可以查看）：
![图片描述](/images/blog/wsl_lerobot_deployment/image3.png)
若不是显示已启用，则需根据电脑型号进入bios设置。

## 安装Ubuntu22.04

方法一：在Microsoft Store里面搜索并安装Ubuntu 22.04 LTS，安装后运行并设置用户名和密码即可。

方法二：打开PowerShell（以管理员身份）并运行以下命令来安装WSL和Ubuntu：
####
    wsl --install -d Ubuntu-22.04

过程也是需要填写用户名和密码。（Ubuntu系统为隐示输入密码，不会显示，实则已经输入但是看不见）

## 迁移WSL到其他盘

通过WSL2安装的操作系统默认在C盘,后期内存开销很大，建议迁移到其他盘。

1. 在操作之前查看 WSL 的运行状态：
####
    wsl -l -v
![图片描述](/images/blog/wsl_lerobot_deployment/image4.png)

2. 确保WSL处于停止状态（Stopped），如果是Running，则需要关闭：
####
    wsl --shutdown

3. 导出当前的 Linux 系统镜像：
####
    wsl --export Ubuntu d:\Program\WSL\Ubuntu\Ubuntu.tar

导出之前先确定目标位置是否存在，不存在则自己创建一下。
![图片描述](/images/blog/wsl_lerobot_deployment/image5.png)

4. 移除之前注册的 WSL：
####
    wsl --unregister Ubuntu

若显示：
适用于 Linux 的 Windows 子系统没有已安装的分发版。
可以通过访问 Microsoft Store 来安装分发版:
https://aka.ms/wslstore
则说明取消注册成功。

5. 重新注册WSL:
####
    # wsl --port Ubuntu <WSL后续要放在哪个文件夹中> <镜像路径>
    wsl --import Ubuntu d:\ Program\WSL d:\ Program\WSL\Ubuntu\Ubuntu.tar

6. 重新查询WSL状态：
####
    wsl -l -v
![图片描述](/images/blog/wsl_lerobot_deployment/image6.png)

说明已经成功将WSL迁移到目标位置了。

PS：
1. 迁移后无需再设置用户名和密码；
2. 迁移之后，d:\ Program\WSL\Ubuntu目录下的Ubuntu.tar可以删除;
3. d:\ Program\WSL这个文件夹就是 WSL2 的系统盘，不要删除！

7. 如果迁移后默认账号是 root，可以修改默认账号为我们自己的账号。在wsl运行下编辑 wsl.conf文件：
####
    vim /etc/wsl.conf
![图片描述](/images/blog/wsl_lerobot_deployment/image7.png)

完成上述操作之后，重启一下电脑。
然后就可以在终端管理员中用WSL指令打开Ubuntu系统，可能出现加载用户设置失败的错误：

![图片描述](/images/blog/wsl_lerobot_deployment/image8.png)
解决方法也很简单：就是给新配置的Ubuntu终端添加一个可以识别到的ico图标文件。
![图片描述](/images/blog/wsl_lerobot_deployment/image9.png)
![图片描述](/images/blog/wsl_lerobot_deployment/image10.png)
![图片描述](/images/blog/wsl_lerobot_deployment/image11.png)

## 安装Anaconda

1. 首先需要更新一下WSL2的软件包:
####
    sudo apt update 和 sudo apt upgrade

2. 确保切换到根目录下：
####
    cd

3. 下载Anaconda的安装包：
####
    wget https://repo.anaconda.com/archive/Anaconda3-2024.02-1-Linux-x86_64.sh

4. 安装Anaconda：
####
    bash Anaconda3-2024.02-1-Linux-x86_64.sh

5. 设置Anaconda的环境变量：
   打开系统文件：
####
    nano ~/.bashrc

添加环境变量：
####
    export PATH="/home/用户名/anaconda3/bin:$PATH"

添加完成后，按Crrl+O保存，Crrl+X退出
更新环境变量：
####
    source ~/.bashrc

验证是否添加完成：
####
    conda –version

如果有信息则成功。

## 按需选择是否安装CUDA

由于WSL是Window11下的子系统，显卡驱动问题可以直接在Windows的NVIDIA软件中进行安装，打开PowerShell（以管理员身份）并运行以下命令：
![图片描述](/images/blog/wsl_lerobot_deployment/image12.png)
####
    nvidia-smi

若有信息显示，则无需在Ubuntu安装CUDA,否则可以参考：
[win11 WSL ubuntu安装CUDA、CUDNN、TensorRT最有效的方式](https://blog.csdn.net/qq_40102732/article/details/135182310?fromshare=blogdetail&sharetype=blogdetail&sharerId=135182310&sharerefer=PC&sharesource=qq_52365670&sharefrom=from_link)

## 安装Ubuntu图形化界面

1. 安装桌面环境
   在Ubuntu终端运行命令检查软件包更新：
####
    sudo apt-get update && sudo apt-get upgrade

接着输入桌面依赖：
####
    sudo apt-get install ubuntu-desktop unity compizconfig-settings-manager

2. VcXsrv安装与配置
   从SourceForge上面下载最新版本的VcXsrv,安装完成后启动开始菜单中的XLaunch，进行显示设置：勾选"One large window"和"Dissable access control"，以及建议保存一下配置，下次直接打开config.xlaunch就行，无需再配置。
![图片描述](/images/blog/wsl_lerobot_deployment/image13.png)
![图片描述](/images/blog/wsl_lerobot_deployment/image14.png)
![图片描述](/images/blog/wsl_lerobot_deployment/image15.png)
配置好打开config.xlaunch，会出现一个黑色界面，先不用管它，最小化即可。
![图片描述](/images/blog/wsl_lerobot_deployment/image16.png)
<!-- ![图片描述](/images/blog/wsl_lerobot_deployment/image17.png) -->

3. 配置xfce4
   在Ubuntu终端运行命令：
####
    sudo apt install -y xfce4

查看windows系统和WSL2通信使用的ip地址：打开powershell运行"ipconfig"指令查看IP地址。
![图片描述](/images/blog/wsl_lerobot_deployment/image18.png)
在Ubuntu终端配置一下通信：
####
    sudo nano /etc/resolv.conf

输入密码
![图片描述](/images/blog/wsl_lerobot_deployment/image19.png)

取消下面两行的注释禁用自动重新生成配置文件,否则重启后这个地址会变
####
    [network]
    generateResolvConf = false

接着输入：
####
    nano ~/.bashrc

在文件末尾加上以下两行内容：
####
    #（172.18.192.1是上面步骤查询到的ip地址，注释不要复制进去）
    export DISPLAY=172.18.192.1:0  
    export WAYLAND_DISPLAY=$DISPLAY

更新配置：
####
    source ~/.bashrc

启动xfce4：
####
    startxfce4
![图片描述](/images/blog/wsl_lerobot_deployment/image20.png)
![图片描述](/images/blog/wsl_lerobot_deployment/image21.png)
## 安装USBIPD-WIN

WSL 2 本身并不支持连接USB 设备，因此需要安装一下 usbipd-win 这个项目来帮助在 wsl2 中共享到宿主机的 usb 设备。

PS：这个过程一定要先关掉防火墙，关掉防火墙，关掉防火墙。

1. 在Ubuntu终端使用如下指令安装usbipd-win：
####
    sudo apt install linux-tools-generic hwdata
    sudo update-alternatives --install /usr/local/bin/usbip usbip /usr/lib/linux-tools/*-generic/usbip 20

2. WSL2连接宿主机USB设备
   在windows下按"win+X"打开终端管理员，运行以下指令查看设备连接情况（需要开着Ubuntu）：
####
    usbipd list
![图片描述](/images/blog/wsl_lerobot_deployment/image22.png)
需要关注的是BUSID和STATE,分别表示连接设备的唯一id和连接状态，由于有些设备已经共享到WSL2下，所以显示的是"Shared"，未附加的USB设备会显示"Not shared"，此时可以在windows的设备管理器查看到这些连接的USB设备。
![图片描述](/images/blog/wsl_lerobot_deployment/image23.png)
使用以下命令将USB设备（注意使用BUSID）共享到WSL2：
####
    usbipd bind --busid 1-14
![图片描述](/images/blog/wsl_lerobot_deployment/image24.png)
使用以下命令将已经共享的USB设备附加到WSL2：
####
    usbipd attach -w -b 2-4
![图片描述](/images/blog/wsl_lerobot_deployment/image25.png)
![图片描述](/images/blog/wsl_lerobot_deployment/image26.png)
3. 在Ubuntu上查看是否已经连接到USB设备：
####
    lsusb
![图片描述](/images/blog/wsl_lerobot_deployment/image27.png)
另外在windows的设备管理器已经检测不到附加到WSL2的USB设备，说明已经成功了。因为windows和WSL2不能共用USB设备，想要恢复最简单的方法就是物理断开连接，不过Ubuntu想要再使用就只需要重新附加连接，前提是WSL2要处在活跃状态。
![图片描述](/images/blog/wsl_lerobot_deployment/image28.png)
## 重构Ubuntu内核

按照上面的步骤，已经可以将端口COM附加到WSL2下的Ubuntu系统，在其终端中，只需要给对应端口开放权限，便可以使用改端口控制主从机械臂（PS:需要先安装并且标定好机械臂，若未安装好，可以先跳过下面的验证环节。）（要确定好系统连接的主从机械臂端口是哪两个，在我这里/dev/ttyACM0是主臂，/dev/ttyACM1是从动臂，每次连接都可能发生变化，注意使用前先确定好对应的端口。）
![图片描述](/images/blog/wsl_lerobot_deployment/image29.png)
####
    sudo chmod 777 /dev/ttyACM0
    sudo chmod 777 /dev/ttyACM1

可以通过大佬分享的网站：https://so-arm100.bambot.org/，在线控制机械臂，看看对应的端口。

但是，仅仅只是这样的方法开放权限给USB相机，还是无法在Ubuntu下打开，原因是WSL2作为windows的子系统，其中是不包含相机的驱动，想要相机能够运行起来，需要手动给Ubuntu重构内核。重构内核的方法，建议参考以下三个博主的文章：
[【WSL 2】在 Windows10 上配置 WSL 2 连接 USB 设备 D435i](https://blog.csdn.net/G_C_H/article/details/125939941?fromshare=blogdetail&sharetype=blogdetail&sharerId=125939941&sharerefer=PC&sharesource=qq_52365670&sharefrom=from_link)
[WSL2 使用 USB Camera](https://blog.csdn.net/chengpengfei09121870/article/details/142762468?fromshare=blogdetail&sharetype=blogdetail&sharerId=142762468&sharerefer=PC&sharesource=qq_52365670&sharefrom=from_link)
[WSL 使用内部 USB Camera 及 V4L2的简单接触](https://blog.csdn.net/qq_40087136/article/details/145190221?fromshare=blogdetail&sharetype=blogdetail&sharerId=145190221&sharerefer=PC&sharesource=qq_52365670&sharefrom=from_link)

我参考了前两篇文章，重构了Ubuntu的内核，但是在验证是否能调用摄像头的时候发生了问题：在Ubuntu中，我是能够检测到windows附加在WSL2中的摄像机信息，但是无法检测到任何的/dev/video端口，可以使用如下命令查看系统中所有的video设备。
####
    ls /dev/video*
![图片描述](/images/blog/wsl_lerobot_deployment/image30.png)
没有的话，建议在重构内核部分再仔细配置一下，确保教程中的配置没有遗漏，配置完后，最好是重启计算机而不是重启WSL，确保系统配置能够重新加载。
重启之后需要重新附加这些设备到USB中，并且在Ubuntu终端运行以下指令查看端口。
####
    ls /dev/video*
![图片描述](/images/blog/wsl_lerobot_deployment/image31.png)
给摄像头配置权限：
####
    sudo chmod 777 /dev/video*

接下来用test.py和test_2cam.py文件找到对应摄像头的index以及测试两个摄像头是否可以同时运行。
很奇怪的是，上面的代码成功运行了摄像头，但是我从教程中安装cheese以及系统自带的Camera并不能打开摄像头，原因未知，但是可以使用guvcview打开。
![图片描述](/images/blog/wsl_lerobot_deployment/image32.png)
另外可以使用第三篇文章进行抓图测试：
首先安装val2：
####
    sudo apt install v4l-utils

使用以下命令可以查询系统中连接的设备：
####
    v4l2-ctl --list-devices
![图片描述](/images/blog/wsl_lerobot_deployment/image33.png)
使用以下命令查询媒体设备的相关信息：
####
    v4l2-ctl -d /dev/video0 –all

需要查看摄像头的像素格式、分辨率和图像大小，后面运行lerobot代码有个坑在这里面。
![图片描述](/images/blog/wsl_lerobot_deployment/image34.png)
抓取图片：
####
    v4l2-ctl --device=/dev/video0 --set-fmt-video=width=640,height=480,pixelformat=MJPG --stream-mmap --stream-to=frame.jpg --stream-skip=20 --stream-count=1

## 安装Clash for windows(也可以用verge,只为科研!)

由于lerobot代码运行需要登录huggingface，所以需要梯子翻墙，否则很容易因为网络问题导致程序运行中断。

1. Clash for windows下载地址：Clash for Windows 下载 | Clash官网
![图片描述](/images/blog/wsl_lerobot_deployment/image35.png)
2. 软件配置
![图片描述](/images/blog/wsl_lerobot_deployment/image36.png)
当然这只是软件配置，真正能够翻墙还是要氪金，可以参考Clash for Windows 官网下载、设置教程。

3. 配置代理
4. 
   我们仍然需要用到上面步骤查到的以太网的ip地址：
进入WSL终端，使用以下命令添加环境变量：
####
    nano ~/.bashrc

在文件中添加两行代码：
####
    alias proxy='export all_proxy=http://[ip地址]:7890'  #上面软件配置时端口是7890
    alias unproxy='unset all_proxy'
![图片描述](/images/blog/wsl_lerobot_deployment/image37.png)
添加完成后"Ctrl+O"保存，"Ctrl+X"退出。
更新配置：
####
    source ~/.bashrc

激活环境输入以下命令（clash for windows保持活跃）：
####
    proxy # 激活代理
    unproxy # 取消代理
![图片描述](/images/blog/wsl_lerobot_deployment/image38.png)
可以用谷歌进行测试：
####
    curl www.google.com

如果出现网页源代码，则说明成功。
####
+++++++++++++++++++++++++++分割线+++++++++++++++++++++++++++
####
后面配置Lerobot的代码环境，可以参考：

[（七）lerobot开源项目so100新版本全流程操作（操作记录）](https://szzdzhp.blog.csdn.net/article/details/145903175?fromshare=blogdetail&sharetype=blogdetail&sharerId=145903175&sharerefer=PC&sharesource=qq_52365670&sharefrom=from_link)

[从零开始，手把手教你搭建Lerobot机械臂](https://szzdzhp.blog.csdn.net/article/details/145903175?fromshare=blogdetail&sharetype=blogdetail&sharerId=145903175&sharerefer=PC&sharesource=qq_52365670&sharefrom=from_link)
以下是记录我在完成整个流程所遇到的部分问题以及解决方案：
####
    conda install -y -c conda-forge ffmpeg
    pip uninstall -y opencv-python
    conda install -y -c conda-forge "opencv>=4.10.0"

我安装这两个会报错，这边记录一下解决方法：
1. 安装ffmpeg会一直卡在solving environment，刚开始以为用的国外源速度太慢了，先后尝试了清华，中科大和阿里云的镜像源，还是没有解决问题，后面用conda config --remove-key channels，擦除镜像源通道，用默认的解决了；
2. 安装opencv会报错：Error while loading conda entry point: conda-libmamba-solver (libarchive.so.19: cannot open shared object file: No such file or directory)，可以参考这篇文章：[联手ChatGPT解决使用conda命令出现的conda-libmamba-solver和load_entrypoints报错问题。](https://zhuanlan.zhihu.com/p/668565976)

上面步骤我们获得了摄像头的一些参数：图像大小，像素格式和分辨率，在lerobot代码中需要稍微修改下才能运行，在lerobot/common/robot_devices/cameras/opencv.py代码中添加：        
####
    # 设置像素格式为 MJPG
    self.camera.set(cv2.CAP_PROP_FOURCC,cv2.VideoWriter_fourcc(*'MJPG'))

![图片描述](/images/blog/wsl_lerobot_deployment/image39.png)
在运行推理代码时，会卡在"Activating torque on main follower arm."排查了原因，发现是conda和pip安装的依赖冲突了，解决方法是：重开一个conda环境+jpeg libtiff，以及专门通过 conda 安装 opencv，numpy。
![图片描述](/images/blog/wsl_lerobot_deployment/image40.png)

pi0推理时候报错batch['task']，解决方法：将图片中文件代码原tasks注释掉，自己设置一个tasks。
![图片描述](/images/blog/wsl_lerobot_deployment/image41.png)

Pi0推理的过程中，代码运行过程中会被killed掉，可以使用以下命令查看：
####
    sudo dmesg | tail -7

会发现出问题的根本原因是WSL2的内存不足,而WSL2内存由两块组成：物理内存和虚拟内存，WSL2物理内存最大可分配一般是windows系统实际物理内存的80%（过多容易导致windows系统卡顿、崩溃）。
内存可以通过"win+R"，输入cmd回车，使用以下命令查看：
####
    Systeminfo

![图片描述](/images/blog/wsl_lerobot_deployment/image42.png)
配置WSL2内存：
找到步骤8中保存的.wslconfig文件，用记事本打开，添加以下代码：
####
    memory=10GB # 分配给 WSL 2 的最大内存量
    swap=15GB # 分配给 WSL 2 的交换空间大小
    processors=4 # 分配给 WSL 2 的 CPU 核心数
    localhostForwarding=true # 允许从 Windows 访问 WSL 2 的 localhost 端口

保存后重启计算机，确保配置能够更新。重启后可以在WSL终端输入以下指令查看：
####
    free -h
![图片描述](/images/blog/wsl_lerobot_deployment/image43.png)
或者在Ubuntu系统的"System Monitor"中查看：
![图片描述](/images/blog/wsl_lerobot_deployment/image44.png)
实际在推理pi0过程中，可以用这种方法查看内存使用情况，在我电脑上推理，所需要的内存大约是17GB。

推理pi0时，从动臂抖动很明显，可以通过调节PID解决这个问题。
lerobot-main/lerobot/common/robot_devices/robots/manipulator.py下，找到set_so100_robot_preset方法，调节PID三个值可以使机械臂达到比较理想的状态。

![图片描述](/images/blog/wsl_lerobot_deployment/image45.png)

参考文章：

[WSL2的安装与配置（创建Anaconda虚拟环境、更新软件包、安装PyTorch、VSCode）](https://blog.csdn.net/weixin_44878336/article/details/133967607?fromshare=blogdetail&sharetype=blogdetail&sharerId=133967607&sharerefer=PC&sharesource=qq_52365670&sharefrom=from_link)

[Windows11部署WSL2以及迁移操作系统位置](https://blog.csdn.net/Xin_101/article/details/130537587?fromshare=blogdetail&sharetype=blogdetail&sharerId=130537587&sharerefer=PC&sharesource=qq_52365670&sharefrom=from_link)

[WSL2中使用VcXsrv实现xfce4图形界面+声音传输](https://zhuanlan.zhihu.com/p/150555651)

[极智开发 | 让wsl2读取宿主机usb设备](https://ultimatevision.blog.csdn.net/article/details/131380025?fromshare=blogdetail&sharetype=blogdetail&sharerId=131380025&sharerefer=PC&sharesource=qq_52365670&sharefrom=from_link)

[如何让Windows的代理作用于wsl2?](https://www.zhihu.com/question/435906813)

[Program Hangs at "Activating torque on main follower arm." During Teleoperation SO 100](https://github.com/huggingface/lerobot/issues/805)



####
云服务器利用pi0预训练模型微调私有数据集（含本地推理验证）
写这篇文章的目的一方面是记录自己在微调过程中遇到的问题以及解决方案，另一方面，也能给想要自己动手微调数据集且没有合适显卡的初学者提供一些参考。
书接上回，我用的是Leroot的so100机械臂，训练环境是在autodl租的L20显卡-48g显存，（因为我的4060ti显存只有16g，远远达不到微调的要求）。推荐autodl的原因是这个平台提供学术加速，可以访问huggingface的网站，在训练的过程中可以下载一些所需要的文件。在此之前已经验证过act、dp和pi0的策略，仅仅是抓取效果，在三种模型下效果逐渐降低，pi0甚至是0效果。所以我想试试利用官方的pi0预训练模型来微调我的数据集，看看效果怎么样。
####
pi0预训练下载官网：[lerobot/pi0 · HF Mirror](https://hf-mirror.com/lerobot/pi0)

pi0博客：https://hf-mirror.com/blog/pi0
![图片描述](/images/blog/wsl_lerobot_deployment/image46.png)
从官方的指令上看，我先前已经使用了PaliGemma 和 Expert Gemma 微调 π0 神经网络，但是效果并不好。
####
    python lerobot/scripts/train.py \
    --dataset.repo_id=${HF_USER}/so100_pi0_num300 \
    --policy.type=pi0 \
    --output_dir=outputs/train/so100_pi0_num300 \
    --job_name=so100_pi0_num300 \
    --wandb.enable=false
####
满足显卡要求（显存超过30g）可以直接在本地利用以下指令开始下载训练（默认前期配置工作已经做好，包括huggingface登录等）：

####
    python lerobot/scripts/train.py \
    --policy.path=lerobot/pi0 \ #官网的pi0预模型
    --dataset.repo_id=danaaubakirova/koch_test #替换成自己的数据集
####
使用云服务器的玩家可以提前下载把模型（26.1G）下载到本地，通过autodl平台的无卡模式将模型、私有数据集以及旧版本的lerobot代码上传到云服务器上（新版本的代码有问题，容易报错），当然也可以直接租L20直接下载，多花一点钱就可以了。
![图片描述](/images/blog/wsl_lerobot_deployment/image47.png)
lerobot是代码，huggingface是从本地缓存路径直接上传过来的，并把pi0预训练模型放在和用户同级下，数据集放在用户下了：
![图片描述](/images/blog/wsl_lerobot_deployment/image48.png)
为了区分两种pi0微调，我把预训练模型放在大写的PI0里面了。
由于云服务器的系统盘只有30g，无法同时将pi0预训练模型和数据集一块放在默认的缓存路径/root/.cache/huggingface，只能放在数据盘里面，但是训练的时候代码又回去默认的路径寻找，会找不到模型和数据集，所以需要更改以下默认路径：
在lerobot/lerobot/common/constants.py修改代码
![图片描述](/images/blog/wsl_lerobot_deployment/image49.png)
修改好使用以下指令开始训练（模型和数据集都要使用绝对路径，不然会报错或者重新到官网去下载模型）：
####
    python lerobot/scripts/train.py \
    --policy.path=/root/autodl-tmp/huggingface/lerobot/PI0 \
    --dataset.repo_id=/root/autodl-tmp/huggingface/lerobot/yunhezhui123/so100_pi0_num300
####
其他训练参数可以在lerobot/lerobot/configs/train.py，batch_size=1所需要的显存将近30g。
若是出现这种情况，说明模型路径不对，代码跑去官网重新下载了：
![图片描述](/images/blog/wsl_lerobot_deployment/image50.png)
可以自己在lerobot/lerobot/configs/policies.py中添加打印修改：
![图片描述](/images/blog/wsl_lerobot_deployment/image51.png)
另外，如果在运行过程中碰见以下问题：
![图片描述](/images/blog/wsl_lerobot_deployment/image52.png)
说明transformers版本太新了，有些方法已经被弃用了，建议卸载原先的版本再安装：
pip install transformers==4.50.0
出现个界面说明已经开始训练了，可以看出，利用了pi0预训练模型，初始的loss为0.068已经很低了，最终训练了20000步收敛到0.011。
![图片描述](/images/blog/wsl_lerobot_deployment/image53.png)

训练完了就可以把训练好的检查点下载下来，在本地进行推理验证（前期配置工作已经完成）：
####
    python lerobot/scripts/control_robot.py \
    --robot.type=so100 \
    --control.type=record \
    --control.fps=30 \
    --control.single_task="grap" \
    --control.repo_id=yunhezhui123/eval_so100_pi0 \
    --control.tags='["tutorial"]' \
    --control.warmup_time_s=5 \
    --control.episode_time_s=300 \
    --control.reset_time_s=30 \
    --control.num_episodes=10 \
    --control.push_to_hub=false \
    --control.policy.path=outputs/PI0_020000/pretrained_model
####
这么进行推理还是会报错，原因是用pi0预训练模型进行微调，训练出来的模型配置缺少了type参数：
![图片描述](/images/blog/wsl_lerobot_deployment/image55.png)
在config.json中添加以下代码即可：
"type": "pi0",
![图片描述](/images/blog/wsl_lerobot_deployment/image56.png)
附上实机验证效果：

目前的效果确实比上面pi0训练出来的效果要好，但是泛化能力不知道从哪体现出来，效果和act差不多，但是数据量和训练复杂度远比act要多，可能也是因为我本身的数据集不够全的原因。虽然跑出来效果，但是pi0不适合用在简单任务，感觉和act拉不开差距。目前还不清楚如何能够提高模型的泛化能力，增加数据量或许可以，后面再试试吧。