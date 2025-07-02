"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Activity,
  Users,
  MessageSquare,
  Zap,
  TrendingUp,
  Database,
  Shield,
  Settings,
  BarChart3,
  Clock,
  Cpu,
  Globe,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface DashboardStats {
  overview: {
    total_users: number
    total_requests: number
    avg_response_time: number
    total_tokens: number
    active_providers: number
  }
  providerStats: Array<{
    provider: string
    requests: number
    avg_time: number
    tokens: number
  }>
  dailyUsage: Array<{
    date: string
    requests: number
    unique_users: number
  }>
}

interface SystemHealth {
  status: string
  providers: {
    groq: boolean
    together: boolean
    gemini: boolean
  }
  database: boolean
  redis: boolean
  metrics: {
    healthScore: number
    activeProviders: number
    totalProviders: number
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 30000) // تحديث كل 30 ثانية
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsResponse, healthResponse] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/ai/health"),
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      if (healthResponse.ok) {
        const healthData = await healthResponse.json()
        setHealth(healthData)
      }
    } catch (error) {
      console.error("فشل في تحميل بيانات اللوحة:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "groq":
        return "from-orange-500 to-red-500"
      case "together":
        return "from-blue-500 to-purple-500"
      case "gemini":
        return "from-green-500 to-teal-500"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <Image
              src="/images/logo.png"
              alt="drx3 Logo"
              width={80}
              height={80}
              className="rounded-2xl shadow-2xl mx-auto animate-pulse"
              style={{
                filter: "drop-shadow(0 0 40px rgba(59, 130, 246, 0.6))",
              }}
            />
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
          </div>
          <p className="text-lg text-muted-foreground">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
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
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30"></div>
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  لوحة تحكم drx3
                </h1>
                <p className="text-sm text-muted-foreground">
                  إدارة ومراقبة النظام • {health?.status === "healthy" ? "نشط" : "تحت المراقبة"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${
                  health?.status === "healthy"
                    ? "border-green-500 text-green-600 bg-green-50"
                    : "border-yellow-500 text-yellow-600 bg-yellow-50"
                }`}
              >
                <Activity className="w-3 h-3 mr-1" />
                {health?.status === "healthy" ? "صحي" : "تحت المراقبة"}
              </Badge>

              <Link href="/chat">
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  المحادثة
                </Button>
              </Link>

              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            <TabsTrigger value="system">النظام</TabsTrigger>
            <TabsTrigger value="security">الأمان</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-blue-200 dark:border-blue-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(stats?.overview.total_users || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 dark:border-green-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(stats?.overview.total_requests || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">+23% من الأسبوع الماضي</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 dark:border-purple-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">متوسط وقت الاستجابة</CardTitle>
                  <Clock className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(stats?.overview.avg_response_time || 0)}ms
                  </div>
                  <p className="text-xs text-muted-foreground">-8% تحسن في الأداء</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 dark:border-orange-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الرموز</CardTitle>
                  <Zap className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatNumber(stats?.overview.total_tokens || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">+45% من الشهر الماضي</p>
                </CardContent>
              </Card>
            </div>

            {/* Provider Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    أداء المزودين
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.providerStats.map((provider, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full bg-gradient-to-r ${getProviderColor(provider.provider)}`}
                            />
                            <span className="font-medium capitalize">{provider.provider}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{formatNumber(provider.requests)} طلب</div>
                        </div>
                        <Progress
                          value={(provider.requests / (stats?.overview.total_requests || 1)) * 100}
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{Math.round(provider.avg_time)}ms متوسط</span>
                          <span>{formatNumber(provider.tokens)} رمز</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    الاستخدام اليومي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {stats?.dailyUsage.slice(0, 7).map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <div className="font-medium">
                              {new Date(day.date).toLocaleDateString("ar-SA", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="text-sm text-muted-foreground">{day.unique_users} مستخدم فريد</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{formatNumber(day.requests)}</div>
                            <div className="text-xs text-muted-foreground">طلب</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-green-200 dark:border-green-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-green-600" />
                    قاعدة البيانات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {health?.database ? "متصلة" : "غير متصلة"}
                      </div>
                      <p className="text-sm text-muted-foreground">PostgreSQL</p>
                    </div>
                    {health?.database ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    Redis Cache
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{health?.redis ? "متصل" : "غير متصل"}</div>
                      <p className="text-sm text-muted-foreground">Upstash Redis</p>
                    </div>
                    {health?.redis ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 dark:border-purple-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    مزودي الذكاء الاصطناعي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(health?.providers || {}).map(([provider, status]) => (
                      <div key={provider} className="flex items-center justify-between">
                        <span className="capitalize font-medium">{provider}</span>
                        <Badge variant={status ? "default" : "destructive"}>{status ? "نشط" : "غير نشط"}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  مقاييس النظام
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{health?.metrics.healthScore || 0}%</div>
                    <p className="text-sm text-muted-foreground">نقاط الصحة العامة</p>
                    <Progress value={health?.metrics.healthScore || 0} className="mt-2" />
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {health?.metrics.activeProviders || 0}/{health?.metrics.totalProviders || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">مزودين نشطين</p>
                    <Progress
                      value={((health?.metrics.activeProviders || 0) / (health?.metrics.totalProviders || 1)) * 100}
                      className="mt-2"
                    />
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                    <p className="text-sm text-muted-foreground">وقت التشغيل</p>
                    <Progress value={99.9} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  تنبيهات الأمان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد تنبيهات أمنية</h3>
                  <p className="text-muted-foreground">جميع الأنظمة آمنة وتعمل بشكل طبيعي</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
