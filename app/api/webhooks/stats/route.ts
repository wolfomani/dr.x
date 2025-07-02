import { type NextRequest, NextResponse } from "next/server"
import DrXDatabase from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // تسجيل إحصائيات الاستخدام
    await DrXDatabase.logUsage({
      user_id: data.userId || null,
      provider: data.provider,
      type: data.type || "chat",
      prompt_length: data.promptLength || 0,
      response_length: data.responseLength || 0,
      processing_time: data.processingTime || 0,
      tools_used: data.toolsUsed || {},
    })

    // تسجيل مقاييس النظام
    if (data.processingTime) {
      await DrXDatabase.recordSystemMetric({
        metric_name: "response_time",
        metric_value: data.processingTime,
        metadata: {
          provider: data.provider,
          model: data.model,
          success: data.success,
        },
      })
    }

    if (data.tokens) {
      await DrXDatabase.recordSystemMetric({
        metric_name: "tokens_used",
        metric_value: data.tokens,
        metadata: {
          provider: data.provider,
          model: data.model,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Stats logging error:", error)

    return NextResponse.json(
      {
        error: "فشل في تسجيل الإحصائيات",
        details: error instanceof Error ? error.message : "خطأ غير معروف",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const stats = await DrXDatabase.getSystemMetrics()

    return NextResponse.json({
      metrics: stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Get stats error:", error)

    return NextResponse.json(
      {
        error: "فشل في جلب الإحصائيات",
        details: error instanceof Error ? error.message : "خطأ غير معروف",
      },
      { status: 500 },
    )
  }
}
