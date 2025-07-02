"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MessageBubble } from "@/components/message-bubble"
import { TypingIndicator } from "@/components/typing-indicator"
import {
  Send,
  Settings,
  Zap,
  Brain,
  Cpu,
  Activity,
  Sparkles,
  MessageSquare,
  Trash2,
  Download,
  RefreshCw,
  Gauge,
  Target,
  Database,
} from "lucide-react"
import Image from "next/image"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  model?: string
  tokens?: number
  processingTime?: number
}

interface AISettings {
  provider: "groq" | "together" | "gemini" | "auto"
  model: string
  temperature: number
  maxTokens: number
  topP: number
  enableThinking: boolean
  enableSearch: boolean
  enableRAG: boolean
  systemPrompt: string
}

const defaultSettings: AISettings = {
  provider: "auto",
  model: "auto",
  temperature: 0.7,
  maxTokens: 4000,
  topP: 0.95,
  enableThinking: true,
  enableSearch: false,
  enableRAG: false,
  systemPrompt: "أنت drx3، مساعد ذكي متخصص في الذكاء الاصطناعي والبرمجة والتكنولوجيا.",
}

const aiProviders = {
  groq: {
    name: "Groq",
    models: ["qwen-qwq-32b", "llama-3.3-70b-versatile", "mixtral-8x7b-32768"],
    color: "from-orange-500 to-red-500",
    icon: Zap,
  },
  together: {
    name: "Together AI",
    models: ["deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free", "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"],
    color: "from-blue-500 to-purple-500",
    icon: Brain,
  },
  gemini: {
    name: "Google Gemini",
    models: ["gemini-2.5-pro", "gemini-1.5-pro"],
    color: "from-green-500 to-teal-500",
    icon: Sparkles,
  },
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<AISettings>(defaultSettings)
  const [systemStatus, setSystemStatus] = useState({
    groq: false,
    together: false,
    gemini: false,
    database: false,
    redis: false,
  })
  const [showSettings, setShowSettings] = useState(false)
  const [activeProvider, setActiveProvider] = useState<string>("auto")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // فحص حالة النظام عند التحميل
  useEffect(() => {
    checkSystemHealth()
    const interval = setInterval(checkSystemHealth, 30000) // فحص كل 30 ثانية
    return () => clearInterval(interval)
  }, [])

  // التمرير التلقائي للرسائل
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const checkSystemHealth = async () => {
    try {
      const response = await fetch("/api/ai/health")
      const data = await response.json()

      setSystemStatus({
        groq: data.providers?.groq || false,
        together: data.providers?.together || false,
        gemini: data.providers?.gemini || false,
        database: data.database || false,
        redis: data.redis || false,
      })
    } catch (error) {
      console.error("فشل في فحص حالة النظام:", error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          settings,
          history: messages.slice(-6), // آخر 6 رسائل للسياق
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "عذراً، لم أتمكن من إنتاج رد مناسب.",
        timestamp: new Date(),
        model: data.model,
        tokens: data.tokens,
        processingTime: data.processingTime,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setActiveProvider(
        data.model?.toLowerCase().includes("groq")
          ? "groq"
          : data.model?.toLowerCase().includes("together")
            ? "together"
            : data.model?.toLowerCase().includes("gemini")
              ? "gemini"
              : "auto",
      )
    } catch (error) {
      console.error("خطأ في إرسال الرسالة:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const exportChat = () => {
    const chatData = {
      messages,
      settings,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `drx3-chat-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const quickActions = [
    {
      label: "شرح مفهوم",
      prompt: "اشرح لي مفهوم الذكاء الاصطناعي بطريقة مبسطة",
      icon: Brain,
      color: "from-blue-500 to-purple-600",
    },
    {
      label: "كتابة كود",
      prompt: "اكتب لي كود Python لتحليل البيانات",
      icon: Cpu,
      color: "from-green-500 to-teal-600",
    },
    {
      label: "حل مشكلة",
      prompt: "ساعدني في حل مشكلة تقنية",
      icon: Target,
      color: "from-orange-500 to-red-600",
    },
    {
      label: "تحليل بيانات",
      prompt: "كيف يمكنني تحليل مجموعة بيانات كبيرة؟",
      icon: Activity,
      color: "from-purple-500 to-pink-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt="drx3 Logo"
                  width={40}
                  height={40}
                  className="rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  style={{
                    filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))",
                  }}
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  drx3 AI Assistant
                </h1>
                <p className="text-sm text-muted-foreground">
                  مساعد ذكي متقدم • {Object.values(systemStatus).filter(Boolean).length}/5 خدمات نشطة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* مؤشرات حالة النظام */}
              <div className="flex items-center gap-1">
                {Object.entries(systemStatus).map(([service, status]) => (
                  <div
                    key={service}
                    className={`w-2 h-2 rounded-full ${status ? "bg-green-500" : "bg-red-500"}`}
                    title={`${service}: ${status ? "متصل" : "غير متصل"}`}
                  />
                ))}
              </div>

              <Badge
                variant="outline"
                className={`${
                  activeProvider === "groq"
                    ? "border-orange-500 text-orange-600"
                    : activeProvider === "together"
                      ? "border-blue-500 text-blue-600"
                      : activeProvider === "gemini"
                        ? "border-green-500 text-green-600"
                        : "border-gray-500 text-gray-600"
                }`}
              >
                {activeProvider === "auto"
                  ? "تلقائي"
                  : aiProviders[activeProvider as keyof typeof aiProviders]?.name || activeProvider}
              </Badge>

              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      إعدادات الذكاء الاصطناعي
                    </DialogTitle>
                  </DialogHeader>

                  <Tabs defaultValue="models" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="models">النماذج</TabsTrigger>
                      <TabsTrigger value="parameters">المعاملات</TabsTrigger>
                      <TabsTrigger value="advanced">متقدم</TabsTrigger>
                    </TabsList>

                    <TabsContent value="models" className="space-y-4">
                      <div className="space-y-3">
                        <Label>مزود الخدمة</Label>
                        <Select
                          value={settings.provider}
                          onValueChange={(value) => setSettings((prev) => ({ ...prev, provider: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">تلقائي (الأفضل)</SelectItem>
                            <SelectItem value="groq">Groq (سريع)</SelectItem>
                            <SelectItem value="together">Together AI (متوازن)</SelectItem>
                            <SelectItem value="gemini">Google Gemini (متقدم)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {settings.provider !== "auto" && (
                        <div className="space-y-3">
                          <Label>النموذج</Label>
                          <Select
                            value={settings.model}
                            onValueChange={(value) => setSettings((prev) => ({ ...prev, model: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {aiProviders[settings.provider]?.models.map((model) => (
                                <SelectItem key={model} value={model}>
                                  {model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* معلومات النماذج */}
                      <div className="grid gap-3">
                        {Object.entries(aiProviders).map(([key, provider]) => {
                          const Icon = provider.icon
                          return (
                            <Card key={key} className="p-3">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-gradient-to-r ${provider.color}`}>
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{provider.name}</h4>
                                  <p className="text-sm text-muted-foreground">{provider.models.length} نماذج متاحة</p>
                                </div>
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    systemStatus[key as keyof typeof systemStatus] ? "bg-green-500" : "bg-red-500"
                                  }`}
                                />
                              </div>
                            </Card>
                          )
                        })}
                      </div>
                    </TabsContent>

                    <TabsContent value="parameters" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>درجة الحرارة: {settings.temperature}</Label>
                          <Slider
                            value={[settings.temperature]}
                            onValueChange={([value]) => setSettings((prev) => ({ ...prev, temperature: value }))}
                            max={2}
                            min={0}
                            step={0.1}
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground">
                            قيم أقل = إجابات أكثر تركيزاً، قيم أعلى = إجابات أكثر إبداعاً
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>الحد الأقصى للرموز: {settings.maxTokens}</Label>
                          <Slider
                            value={[settings.maxTokens]}
                            onValueChange={([value]) => setSettings((prev) => ({ ...prev, maxTokens: value }))}
                            max={8000}
                            min={100}
                            step={100}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Top P: {settings.topP}</Label>
                          <Slider
                            value={[settings.topP]}
                            onValueChange={([value]) => setSettings((prev) => ({ ...prev, topP: value }))}
                            max={1}
                            min={0.1}
                            step={0.05}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>تفعيل وضع التفكير</Label>
                          <Switch
                            checked={settings.enableThinking}
                            onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableThinking: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>تفعيل البحث المتقدم</Label>
                          <Switch
                            checked={settings.enableSearch}
                            onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableSearch: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>تفعيل RAG</Label>
                          <Switch
                            checked={settings.enableRAG}
                            onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableRAG: checked }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>رسالة النظام المخصصة</Label>
                          <textarea
                            value={settings.systemPrompt}
                            onChange={(e) => setSettings((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                            className="w-full p-3 border rounded-lg resize-none h-24"
                            placeholder="أدخل رسالة النظام المخصصة..."
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm" onClick={clearChat}>
                <Trash2 className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={exportChat}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {messages.length === 0 ? (
          /* شاشة الترحيب */
          <div className="text-center space-y-8 py-12">
            <div className="relative inline-block">
              <Image
                src="/images/logo.png"
                alt="drx3 Logo"
                width={120}
                height={120}
                className="rounded-2xl shadow-2xl mx-auto animate-pulse"
                style={{
                  filter: "drop-shadow(0 0 40px rgba(59, 130, 246, 0.6))",
                }}
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                مرحباً بك في drx3
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                مساعد ذكي متقدم يستخدم أحدث تقنيات الذكاء الاصطناعي لمساعدتك في البرمجة والتحليل والإبداع
              </p>
            </div>

            {/* الإجراءات السريعة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Card
                    key={index}
                    className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-700"
                    onClick={() => setInput(action.prompt)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">{action.label}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{action.prompt}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* إحصائيات النظام */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-2xl mx-auto">
              {Object.entries(systemStatus).map(([service, status]) => (
                <div key={service} className="text-center">
                  <div
                    className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                      status ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-red-500 shadow-lg shadow-red-500/50"
                    }`}
                  />
                  <p className="text-xs font-medium capitalize">{service}</p>
                  <p className="text-xs text-muted-foreground">{status ? "متصل" : "غير متصل"}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* منطقة المحادثة */
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}

        {/* منطقة الإدخال */}
        <div className="sticky bottom-0 pt-4 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 dark:to-transparent">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    className="pr-12 border-0 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    disabled={isLoading}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>

              {/* معلومات الحالة */}
              {(isLoading || messages.length > 0) && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      {messages.length} رسالة
                    </span>
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      {settings.provider === "auto" ? "تلقائي" : aiProviders[settings.provider]?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3 h-3" />
                      {settings.temperature}° حرارة
                    </span>
                  </div>

                  {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      جاري المعالجة...
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
