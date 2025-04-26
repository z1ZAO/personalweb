import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "朱子豪 - 朱子豪个人网站",
  description: "朱子豪的个人网站和技术博客",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}


import './globals.css'