import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getAllPostSlugs, getPostData } from "@/lib/mdx"
import "highlight.js/styles/github-dark.css" // 导入代码高亮样式

export async function generateStaticParams() {
  const paths = getAllPostSlugs()
  return paths
}

export default async function BlogPost({ params }) {
  const post = await getPostData(params.slug)

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

          <div
            className="mt-8 prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-gray-800 prose-a:font-medium prose-a:decoration-gray-400 hover:prose-a:decoration-gray-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-gray-800"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags &&
              post.tags.map((tag) => (
                <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200 transition-colors">
                    {tag}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t py-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Zion Chu. 保留所有权利。</p>
        </div>
      </footer>
    </div>
  )
}
