"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1 relative">
          <div className="relative">
            <Image
              src="/images/logo.png"
              alt="drx3 Assistant"
              width={32}
              height={32}
              className="rounded-full shadow-lg animate-pulse"
              style={{
                filter: "drop-shadow(0 0 15px rgba(59, 130, 246, 0.6))",
              }}
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-40 animate-pulse"></div>
          </div>

          {/* مؤشر الكتابة */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm animate-bounce" />
        </div>

        <Card className="bg-white dark:bg-slate-800 border shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
                <span className="font-semibold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  drx3 Assistant
                </span>
              </div>
              <span className="text-xs text-blue-600 animate-pulse">جاري الكتابة...</span>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-xs text-muted-foreground ml-2">يفكر ويحلل...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
