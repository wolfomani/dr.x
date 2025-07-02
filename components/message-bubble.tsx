"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { User, Bot, Copy, ThumbsUp, ThumbsDown, Clock, Zap, Activity } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  model?: string
  tokens?: number
  processingTime?: number
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState<boolean | null>(null)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("فشل في النسخ:", error)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getModelColor = (model?: string) => {
    if (!model) return "bg-gray-100 text-gray-600"

    if (model.toLowerCase().includes("groq")) {
      return "bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200"
    } else if (model.toLowerCase().includes("together")) {
      return "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200"
    } else if (model.toLowerCase().includes("gemini")) {
      return "bg-gradient-to-r from-green-100 to-teal-100 text-green-700 border-green-200"
    }

    return "bg-gray-100 text-gray-600"
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex items-start gap-3 max-w-[80%]">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20">
                <span className="text-xs text-white/70 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(message.timestamp)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-6 px-2 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? "تم النسخ" : "نسخ"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start gap-3 max-w-[85%]">
        <div className="flex-shrink-0 mt-1 relative">
          <div className="relative">
            <Image
              src="/images/logo.png"
              alt="drx3 Assistant"
              width={32}
              height={32}
              className="rounded-full shadow-lg"
              style={{
                filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.4))",
              }}
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
          </div>

          {/* مؤشر النشاط */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
        </div>

        <Card className="bg-white dark:bg-slate-800 border shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-4">
            {/* Header مع معلومات النموذج */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    drx3 Assistant
                  </span>
                </div>

                {message.model && (
                  <Badge variant="outline" className={`text-xs ${getModelColor(message.model)}`}>
                    {message.model.includes("groq")
                      ? "Groq"
                      : message.model.includes("together")
                        ? "Together AI"
                        : message.model.includes("gemini")
                          ? "Gemini"
                          : message.model}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatTime(message.timestamp)}
              </div>
            </div>

            {/* محتوى الرسالة */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <MarkdownRenderer content={message.content} />
            </div>

            {/* Footer مع الإحصائيات والإجراءات */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {message.tokens && (
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {message.tokens.toLocaleString()} رمز
                  </span>
                )}

                {message.processingTime && (
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {message.processingTime}ms
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-7 px-2 text-xs">
                  <Copy className="w-3 h-3 mr-1" />
                  {copied ? "تم النسخ" : "نسخ"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLiked(true)}
                  className={`h-7 px-2 ${liked === true ? "text-green-600 bg-green-50" : ""}`}
                >
                  <ThumbsUp className="w-3 h-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLiked(false)}
                  className={`h-7 px-2 ${liked === false ? "text-red-600 bg-red-50" : ""}`}
                >
                  <ThumbsDown className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
