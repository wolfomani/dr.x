"use client"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { theme } = useTheme()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      toast.success("تم نسخ الكود")
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      toast.error("فشل في نسخ الكود")
    }
  }

  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "")
          const codeString = String(children).replace(/\n$/, "")

          if (!inline && match) {
            return (
              <div className="relative group">
                <div className="flex items-center justify-between bg-slate-800 dark:bg-slate-900 px-4 py-2 rounded-t-lg border border-blue-200 dark:border-blue-700">
                  <span className="text-sm text-slate-300 font-medium">{match[1]}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCode(codeString)}
                    className="h-6 px-2 text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    {copiedCode === codeString ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
                <SyntaxHighlighter
                  style={theme === "dark" ? oneDark : oneLight}
                  language={match[1]}
                  PreTag="div"
                  className="!mt-0 !rounded-t-none border border-t-0 border-blue-200 dark:border-blue-700"
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            )
          }

          return (
            <code
              className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-1.5 py-0.5 rounded text-sm font-mono border border-blue-200 dark:border-blue-700"
              {...props}
            >
              {children}
            </code>
          )
        },
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {children}
          </h2>
        ),
        h3: ({ children }) => <h3 className="text-lg font-medium mb-2 text-blue-600 dark:text-blue-400">{children}</h3>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gradient-to-b from-blue-500 to-purple-500 pl-4 py-2 my-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-r-lg">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
        li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
        p: ({ children }) => <p className="mb-3 leading-relaxed text-sm">{children}</p>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 underline decoration-blue-300 hover:decoration-purple-300 transition-colors"
          >
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-blue-200 dark:border-blue-700 rounded-lg overflow-hidden">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left font-medium text-blue-900 dark:text-blue-100 border-b border-blue-200 dark:border-blue-700">
            {children}
          </th>
        ),
        td: ({ children }) => <td className="px-4 py-2 border-b border-blue-100 dark:border-blue-800">{children}</td>,
        hr: () => (
          <hr className="my-6 border-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent dark:via-blue-600" />
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-blue-700 dark:text-blue-300">{children}</strong>
        ),
        em: ({ children }) => <em className="italic text-purple-600 dark:text-purple-400">{children}</em>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
