import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeHighlight from "rehype-highlight"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"

// 博客文章目录
const postsDirectory = path.join(process.cwd(), "content/blog")
// 博客图片目录 - 统一存放在public/images/blog下
const blogImagesDirectory = path.join(process.cwd(), "public/images/blog")

// 确保目录存在
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true })
}

if (!fs.existsSync(blogImagesDirectory)) {
  fs.mkdirSync(blogImagesDirectory, { recursive: true })
}

// 获取所有博客文章的元数据
export function getAllPosts() {
  // 获取目录中的所有.md文件
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
    .map((fileName) => {
      // 从文件名中移除".md"或".mdx"以获取id
      const slug = fileName.replace(/\.mdx?$/, "")

      // 读取markdown文件作为字符串
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")

      // 使用gray-matter解析文章元数据部分
      const matterResult = matter(fileContents)

      // 将数据与slug组合
      return {
        slug,
        ...matterResult.data,
        content: matterResult.content,
      }
    })

  // 按日期排序
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

// 获取最新的N篇博客文章
export function getLatestPosts(count = 3) {
  const allPosts = getAllPosts()
  return allPosts.slice(0, count)
}

// 获取所有博客文章的slug
export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
    .map((fileName) => {
      return {
        params: {
          slug: fileName.replace(/\.mdx?$/, ""),
        },
      }
    })
}

// 获取单篇博客文章的数据
export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`)

  let filePath = ""
  if (fs.existsSync(fullPath)) {
    filePath = fullPath
  } else if (fs.existsSync(mdxPath)) {
    filePath = mdxPath
  } else {
    return null
  }

  const fileContents = fs.readFileSync(filePath, "utf8")

  // 使用gray-matter解析文章元数据部分
  const matterResult = matter(fileContents)

  // 将Markdown转换为HTML
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, { ignoreMissing: true, detect: true }) // 添加代码高亮，自动检测语言
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(matterResult.content)

  const contentHtml = processedContent.toString()

  // 将数据与slug组合
  return {
    slug,
    contentHtml,
    ...matterResult.data,
  }
}

// 获取所有标签
export function getAllTags() {
  const posts = getAllPosts()
  const tagsSet = new Set<string>()

  posts.forEach((post) => {
    const tags = post.tags || []
    if (Array.isArray(tags)) {
      tags.forEach((tag) => tagsSet.add(tag))
    }
  })

  return Array.from(tagsSet)
}

// 按标签获取文章
export function getPostsByTag(tag: string) {
  const posts = getAllPosts()
  return posts.filter((post) => {
    const tags = post.tags || []
    return Array.isArray(tags) && tags.includes(tag)
  })
}
