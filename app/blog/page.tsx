"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
  // 客户端状态
  const [posts, setPosts] = useState([])
  const [allTags, setAllTags] = useState([])
  const [selectedTag, setSelectedTag] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // 获取博客文章和标签
  useEffect(() => {
    async function fetchData() {
      // 使用fetch API获取数据
      const response = await fetch("/api/blog")
      const data = await response.json()
      setPosts(data.posts)
      setAllTags(data.tags)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  // 筛选文章
  const filteredPosts = selectedTag ? posts.filter((post) => post.tags && post.tags.includes(selectedTag)) : posts

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
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full bg-white shadow-sm hover:shadow transition-all ${selectedTag === null ? "bg-gray-800 text-white hover:bg-gray-700" : ""}`}
              onClick={() => setSelectedTag(null)}
            >
              全部
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                className={`rounded-full bg-white shadow-sm hover:shadow transition-all ${selectedTag === tag ? "bg-gray-800 text-white hover:bg-gray-700" : ""}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-gray-500">加载中...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <BlogPostCard
                  key={post.slug}
                  post={{
                    id: post.slug,
                    title: post.title,
                    excerpt: post.excerpt,
                    date: post.date,
                    slug: post.slug,
                    tags: post.tags || [],
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">没有找到相关文章</p>
            </div>
          )}
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
