import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
  // 这里可以从数据库或CMS获取博客文章
  // 现在使用模拟数据
  const posts = [
    {
      id: 1,
      title: "ubuntu虚拟机连板调试rk3588-debug adb",
      excerpt: "通过连板方式查看onnx->rknn的模型量化精度",
      date: "2025-4-26",
      slug: "solving-rk3588-adb-issues",
      tags: ["Linux", "ONNX", "ADB", "RK3588"],
    },
    {
      id: 2,
      title: "Docker 容器调试技巧",
      excerpt: "分享我在 Docker 环境中调试微服务的经验，以及一些有用的命令和工具。",
      date: "2023-10-28",
      slug: "docker-debugging-tips",
      tags: ["Docker", "微服务", "调试"],
    },
    // {
    //   id: 3,
    //   title: "TypeScript 类型系统深入解析",
    //   excerpt: "探索 TypeScript 类型系统的高级特性，以及如何利用它们编写更安全、更可维护的代码。",
    //   date: "2023-10-10",
    //   slug: "typescript-type-system-deep-dive",
    //   tags: ["TypeScript", "类型系统"],
    // },
    // {
    //   id: 4,
    //   title: "Git 工作流程和常见问题解决",
    //   excerpt: "记录团队协作中的 Git 工作流程，以及如何解决合并冲突等常见问题。",
    //   date: "2023-09-22",
    //   slug: "git-workflow-and-troubleshooting",
    //   tags: ["Git", "团队协作", "问题解决"],
    // },
    // {
    //   id: 5,
    //   title: "Node.js 内存泄漏调查与修复",
    //   excerpt: "详细记录了如何发现、分析和修复 Node.js 应用中的内存泄漏问题。",
    //   date: "2023-09-05",
    //   slug: "nodejs-memory-leak-investigation",
    //   tags: ["Node.js", "内存泄漏", "调试"],
    // },
    // {
    //   id: 6,
    //   title: "构建高性能 API 的最佳实践",
    //   excerpt: "总结了设计和实现高性能、可扩展 API 的经验和最佳实践。",
    //   date: "2023-08-18",
    //   slug: "building-high-performance-apis",
    //   tags: ["API", "性能", "最佳实践"],
    // },
  ]

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

      {/* Blog Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-80 z-0"></div>
        <div className="absolute -right-64 -top-64 w-96 h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute -left-64 -bottom-64 w-96 h-96 bg-gradient-to-tr from-gray-200 to-gray-300 rounded-full blur-3xl opacity-70"></div>
        <div className="container mx-auto px-4 text-center relative z-1">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800">
            博客
          </h1>
          <p className="mx-auto max-w-2xl text-gray-600">分享我的编程经验、调试记录和技术见解</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-full bg-white shadow-sm hover:shadow transition-all">
              全部
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-white shadow-sm hover:shadow transition-all">
              Linux
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-white shadow-sm hover:shadow transition-all">
              Debug
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-white shadow-sm hover:shadow transition-all">
              C/C++
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-white shadow-sm hover:shadow transition-all">
              其他
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Zion Chu. 保留所有权利。</p>
        </div>
      </footer>
    </div>
  )
}

function BlogPostCard({ post }) {
  return (
    <div className="rounded-xl border bg-white p-6 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 flex flex-col h-full">
      <div className="mb-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
            {tag}
          </span>
        ))}
      </div>
      <time dateTime={post.date} className="text-sm text-gray-500">
        {post.date}
      </time>
      <h3 className="mb-2 mt-2 text-xl font-semibold">
        <Link href={`/blog/${post.slug}`} className="hover:text-gray-600 transition-colors">
          {post.title}
        </Link>
      </h3>
      <p className="mb-4 text-gray-600 flex-grow">{post.excerpt}</p>
      <Link
        href={`/blog/${post.slug}`}
        className="group text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors inline-flex items-center"
      >
        阅读更多
        <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </div>
  )
}
