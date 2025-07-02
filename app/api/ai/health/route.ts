import { NextResponse } from "next/server"

export async function GET() {
  try {
    // فحص توفر مزودي الخدمة
    const providers = {
      groq: !!process.env.GROQ_API_KEY,
      together: !!process.env.TOGETHER_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
    }

    // فحص قاعدة البيانات
    const database = !!process.env.DATABASE_URL

    // فحص Redis
    const redis = !!process.env.KV_REST_API_URL

    // فحص الخدمات الإضافية
    const services = {
      blob: !!process.env.BLOB_READ_WRITE_TOKEN,
      auth: !!process.env.STACK_SECRET_SERVER_KEY,
      github: !!process.env.GITHUB_TOKEN,
    }

    const activeProviders = Object.values(providers).filter(Boolean).length
    const activeServices = Object.values(services).filter(Boolean).length
    const totalHealth = (activeProviders + (database ? 1 : 0) + (redis ? 1 : 0) + activeServices) / 8

    // اختبار سريع للاتصال بالخدمات
    const healthChecks = await Promise.allSettled([
      // فحص Groq
      providers.groq
        ? fetch("https://api.groq.com/openai/v1/models", {
            headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
          }).then((r) => r.ok)
        : Promise.resolve(false),

      // فحص Together AI
      providers.together
        ? fetch("https://api.together.xyz/v1/models", {
            headers: { Authorization: `Bearer ${process.env.TOGETHER_API_KEY}` },
          }).then((r) => r.ok)
        : Promise.resolve(false),

      // فحص Redis
      redis
        ? fetch(`${process.env.KV_REST_API_URL}/ping`, {
            headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
          }).then((r) => r.ok)
        : Promise.resolve(false),
    ])

    const connectivityStatus = {
      groq: healthChecks[0].status === "fulfilled" ? healthChecks[0].value : false,
      together: healthChecks[1].status === "fulfilled" ? healthChecks[1].value : false,
      redis: healthChecks[2].status === "fulfilled" ? healthChecks[2].value : false,
    }

    return NextResponse.json({
      status: totalHealth > 0.5 ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      providers,
      database,
      redis,
      services,
      connectivity: connectivityStatus,
      metrics: {
        activeProviders,
        totalProviders: Object.keys(providers).length,
        activeServices,
        totalServices: Object.keys(services).length,
        healthScore: Math.round(totalHealth * 100),
      },
      recommendations: generateRecommendations(providers, database, redis, services),
    })
  } catch (error) {
    console.error("Health check error:", error)

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "خطأ غير معروف",
        providers: { groq: false, together: false, gemini: false },
        database: false,
        redis: false,
      },
      { status: 500 },
    )
  }
}

function generateRecommendations(providers: any, database: boolean, redis: boolean, services: any): string[] {
  const recommendations = []

  if (!providers.groq && !providers.together && !providers.gemini) {
    recommendations.push("تحتاج إلى إضافة مفتاح API واحد على الأقل للذكاء الاصطناعي")
  }

  if (!database) {
    recommendations.push("قاعدة البيانات غير متصلة - تحقق من DATABASE_URL")
  }

  if (!redis) {
    recommendations.push("Redis غير متصل - تحقق من KV_REST_API_URL")
  }

  if (!services.blob) {
    recommendations.push("خدمة التخزين غير متاحة - أضف BLOB_READ_WRITE_TOKEN")
  }

  if (!services.auth) {
    recommendations.push("نظام المصادقة غير مفعل - أضف STACK_SECRET_SERVER_KEY")
  }

  if (recommendations.length === 0) {
    recommendations.push("جميع الخدمات تعمل بشكل طبيعي!")
  }

  return recommendations
}
