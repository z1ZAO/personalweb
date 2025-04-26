"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// 这个函数在实际应用中会从数据库或CMS获取博客文章
// 现在使用模拟数据
function getBlogPost(slug) {
  const posts = {
    "solving-rk3588-adb-issues": {
      title: "ubuntu虚拟机连板调试rk3588-debug adb",
      date: "2025-4-26",
      content: `
背景：最近想把实验室工控机上的工业检测项目整套移植到RK3588上，目前在Arm核上（torch）和NPU（C++ 和 python）均已跑通，因此想通过连板方式查看onnx->rknn的模型量化精度。


我是使用Nanopi R6C，已经使用ssh和uart 在pc端实现连接。

1. typec 连pc，可用串口调试助手检查

2.打开虚拟机，弹出窗口后选择ubuntu系统

3.在ubuntu系统下载adb: sudo apt-get install adb

4.ssh rk3588,

再 cd /usr/bin目录，执行 start_rknn.sh（NanoPi R6C/zh - FriendlyELEC WiKi）

5.在虚拟机（已装好rk环境）查看 adb devices 看看是否已经有设备id ，如果没有，查看adb驱动

找到设备可以运行校准程序.py 若有报错，如

adb: unable to connect for root: closed
adb: error: remote object '/userdata/dumps' does not exist
mv: cannot stat './snapshot/runtime/dumps': No such file or directory
E accuracy_analysis: Traceback (most recent call last):
参考：运行mobilenet的"模型精度评估"例程报错，板端提示failed open dump path: /userdata/dumps/000_InputOperator_input_shape_1_3_224_224_uint8.npy · Issue #118 · airockchip/rknn-toolkit2

执行以下步骤：
  
adb shell在板端创建文件夹

1.如果报一些userdata权限相关问题，可以在adb shell里chmod 777以下这个文件夹

2.root相关，也有可能是权限问题

        执行：sudo chmod 777 /usr/bin/adb 

最后根据官方提供例程，可以在npu上执行，并生成以下一些文件，接下来就可以根据精度自行修改模型或者量化方法
                        
原文链接：https://blog.csdn.net/Zao5544/article/details/147415846
      `,
      tags: ["Linux", "ONNX", "ADB", "RK3588"],
    },
    "docker-debugging-tips": {
      title: "Docker 容器调试技巧",
      date: "2023-10-28",
      content: `
# Docker 容器调试技巧

Docker 已经成为现代开发流程中不可或缺的工具，但在容器环境中调试应用程序可能会比传统环境更具挑战性。本文分享我在 Docker 环境中调试微服务的一些经验和技巧。

## 常见调试场景

### 1. 容器无法启动或崩溃

当容器无法启动或意外崩溃时，首先查看容器日志：

\`\`\`bash
docker logs <container_id>
\`\`\`

如果容器立即退出，可以修改启动命令以保持容器运行：

\`\`\`bash
docker run -it --entrypoint /bin/sh your-image
\`\`\`

### 2. 网络连接问题

使用 \`docker network inspect\` 检查网络配置：

\`\`\`bash
docker network inspect <network_name>
\`\`\`

在容器内部使用网络工具进行诊断：

\`\`\`bash
docker exec -it <container_id> /bin/sh
# 然后在容器内运行
ping <service_name>
curl -v <service_url>
\`\`\`

### 3. 性能问题

使用 \`docker stats\` 监控容器资源使用情况：

\`\`\`bash
docker stats <container_id>
\`\`\`

## 高级调试技巧

### 1. 使用调试工具

对于 Node.js 应用，可以启用调试模式并映射调试端口：

\`\`\`bash
docker run -p 9229:9229 your-node-app --inspect=0.0.0.0:9229
\`\`\`

然后使用 Chrome DevTools 或 VS Code 连接到调试端口。

### 2. 文件系统检查

有时需要检查容器内的文件系统状态：

\`\`\`bash
# 将容器文件复制到主机
docker cp <container_id>:/path/in/container /path/on/host

# 或者进入容器文件系统
docker exec -it <container_id> /bin/sh
\`\`\`

### 3. 环境变量问题

检查容器的环境变量：

\`\`\`bash
docker exec <container_id> env
\`\`\`

## 实用工具推荐

1. **Portainer** - Docker 可视化管理工具
2. **ctop** - 容器资源监控工具
3. **dive** - 分析 Docker 镜像层的工具

## 最佳实践

1. 在 Dockerfile 中包含调试工具
2. 使用卷挂载来简化日志访问
3. 为开发环境创建专用的 Docker Compose 配置
4. 实现健康检查

希望这些技巧能帮助你更有效地调试 Docker 容器中的应用！
      `,
      tags: ["Docker", "微服务", "调试"],
    },
  }

  return posts[slug] || null
}

export default function BlogPost({ params }) {
  const post = getBlogPost(params.slug)

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">文章未找到</h1>
        <p className="mt-2 text-gray-600">抱歉，您请求的文章不存在。</p>
        <Link href="/blog" className="mt-4 text-sm font-medium hover:underline">
          返回博客列表
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600"
          >
            Zion Chu
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
              首页
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-gray-600 transition-colors">
              博客
            </Link>
            <Link href="/#contact" className="text-sm font-medium hover:text-gray-600 transition-colors">
              联系
            </Link>
          </nav>
        </div>
      </header>

      {/* Blog Post */}
      <article className="container mx-auto px-4 py-16">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center text-sm font-medium hover:text-gray-600 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          返回博客列表
        </Link>

        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            {post.title}
          </h1>
          <time dateTime={post.date} className="block text-sm text-gray-500">
            {post.date}
          </time>

          <div className="mt-8 prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-gray-800 prose-a:font-medium prose-a:decoration-gray-400 hover:prose-a:decoration-gray-700 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-gray-800">
            {/* 在实际应用中，这里会使用Markdown渲染器 */}
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br>") }} />
          </div>

          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t py-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} DevName. 保留所有权利。</p>
        </div>
      </footer>
    </div>
  )
}
