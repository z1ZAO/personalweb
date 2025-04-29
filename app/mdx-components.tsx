import type { MDXComponents } from "mdx/types"
import Image from "next/image"
import Link from "next/link"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="mb-4 text-3xl font-bold md:text-4xl">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-4 mt-8 text-2xl font-bold md:text-3xl">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-4 mt-6 text-xl font-bold md:text-2xl">{children}</h3>,
    a: ({ href, children }) => (
      <Link
        href={href || "#"}
        className="text-gray-800 font-medium underline decoration-gray-400 hover:decoration-gray-700"
      >
        {children}
      </Link>
    ),
    img: ({ src, alt }) => (
      <Image src={src || ""} alt={alt || ""} width={800} height={500} className="rounded-lg my-6" />
    ),
    code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm text-gray-800">{children}</code>,
    pre: ({ children }) => (
      <pre className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4 overflow-x-auto my-6">{children}</pre>
    ),
    ...components,
  }
}
