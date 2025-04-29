import { NextResponse } from "next/server"
import { getAllPosts, getAllTags, getPostsByTag } from "@/lib/mdx"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get("tag")

  // 获取文章和标签
  const posts = tag ? getPostsByTag(tag) : getAllPosts()
  const tags = getAllTags()

  return NextResponse.json({
    posts,
    tags,
  })
}
