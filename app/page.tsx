import Link from "next/link"
import Image from "next/image"
import { Github, Users, FileText, Music, ExternalLink, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLatestPosts } from "@/lib/mdx"

export default function Home() {
  // 获取最新的博客文章
  const latestPosts = getLatestPosts(3)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600"
          >
            Zihao Zhu
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
              首页
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-gray-600 transition-colors">
              博客
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-gray-600 transition-colors">
              联系
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-80 z-0"></div>
        <div className="absolute -right-64 -top-64 w-96 h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute -left-64 -bottom-64 w-96 h-96 bg-gradient-to-tr from-gray-200 to-gray-300 rounded-full blur-3xl opacity-70"></div>
        <div className="container mx-auto px-4 relative z-1 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h1 className="mb-6 text-5xl font-bold md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800">
              <span className="font-extrabold">Zao's blog</span>
            </h1>
            <p className="mx-auto md:mx-0 mb-10 max-w-2xl text-lg text-gray-600 leading-relaxed">工程师 | 音乐人</p>
            <div className="flex justify-center md:justify-start gap-4">
              <Button
                size="lg"
                className="rounded-full shadow-lg bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 transition-all duration-300"
              >
                <Link href="/blog">查看我的博客</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Link href="#contact">联系我</Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 md:mt-0 relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <Image
                src="/1.jpg"
                alt="朱子豪照片"
                width={320}
                height={320}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white z-0"></div>
        <div className="container mx-auto px-4 relative z-1">
          <h2 className="mb-12 text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            我的主页链接
          </h2>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <SocialCard
              title="Gitee"
              description="查看我的开源项目和贡献"
              icon={<Github className="h-6 w-6" />}
              url="https://gitee.com/z1ZAO"
              color="from-gray-800 to-gray-700"
            />
            <SocialCard
              title="脉脉"
              description="我的职业经历和技能"
              icon={<Users className="h-6 w-6" />}
              url="https://maimai.cn/profile/detail?dstu=238128148"
              color="from-blue-600 to-blue-500"
            />
            <SocialCard
              title="网易云音乐"
              description="我的音乐作品和歌单"
              icon={<Music className="h-6 w-6" />}
              url="https://music.163.com/#/artist/album?id=35949259"
              color="from-red-600 to-red-500"
            />
            <SocialCard
              title="CSDN博客"
              description="深度技术文章和教程"
              icon={<FileText className="h-6 w-6" />}
              url="https://blog.csdn.net/Zao5544?spm=1000.2115.3001.5343"
              color="from-emerald-600 to-emerald-500"
            />
            <SocialCard
              title="技术社区"
              description="我的技术社区贡献"
              icon={<ExternalLink className="h-6 w-6" />}
              url="https://community.com/yourusername"
              color="from-violet-600 to-violet-500"
            />
            <SocialCard
              title="邮件联系"
              description="直接发送邮件给我"
              icon={<Mail className="h-6 w-6" />}
              url="mailto:zhuzihao54@gmail.com"
              color="from-amber-600 to-amber-500"
            />
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 z-0"></div>
        <div className="absolute -right-64 top-64 w-96 h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-3xl opacity-50"></div>
        <div className="container mx-auto px-4 relative z-1">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              最新博客文章
            </h2>
            <Link
              href="/blog"
              className="group text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              查看全部
              <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <BlogPostCard
                key={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                slug={post.slug}
                tags={post.tags || []}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white z-0"></div>
        <div className="absolute -left-64 top-64 w-96 h-96 bg-gradient-to-tr from-gray-200 to-gray-300 rounded-full blur-3xl opacity-50"></div>
        <div className="container mx-auto px-4 relative z-1">
          <h2 className="mb-12 text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            联系我
          </h2>
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
              <p className="mb-6 text-center text-gray-600">有项目想合作或者技术问题需要讨论？请随时联系我。</p>
              <div className="flex justify-center gap-4">
                <Button className="rounded-full shadow-lg bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 transition-all duration-300">
                  <Link href="mailto:your.email@example.com" className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    发送邮件
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-2 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Link href="https://github.com/z1ZAO" className="flex items-center">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
              </div>
            </div>
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

function SocialCard({ title, description, icon, url, color }) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center rounded-xl border bg-white p-6 text-center transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
    >
      <div
        className={`mb-4 rounded-full p-3 bg-gradient-to-r ${color} text-white transform transition-transform group-hover:scale-110 duration-300`}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  )
}

function BlogPostCard({ title, excerpt, date, slug, tags }) {
  return (
    <div className="rounded-xl border bg-white p-6 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 flex flex-col h-full">
      <div className="mb-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
            {tag}
          </span>
        ))}
      </div>
      <time dateTime={date} className="text-sm text-gray-500">
        {date}
      </time>
      <h3 className="mb-2 mt-2 text-xl font-semibold">
        <Link href={`/blog/${slug}`} className="hover:text-gray-600 transition-colors">
          {title}
        </Link>
      </h3>
      <p className="mb-4 text-gray-600 flex-grow">{excerpt}</p>
      <Link
        href={`/blog/${slug}`}
        className="group text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors inline-flex items-center"
      >
        阅读更多
        <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </div>
  )
}
