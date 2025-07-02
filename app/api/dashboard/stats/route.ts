import { NextResponse } from "next/server"
import DrXDatabase from "@/lib/database"

export async function GET() {
  try {
    const stats = await DrXDatabase.getDashboardStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Dashboard stats error:", error)

    return NextResponse.json(
      {
        error: "فشل في جلب إحصائيات اللوحة",
        details: error instanceof Error ? error.message : "خطأ غير معروف",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    const stats = await DrXDatabase.getDashboardStats(userId)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("User dashboard stats error:", error)

    return NextResponse.json(
      {
        error: "فشل في جلب إحصائيات المستخدم",
        details: error instanceof Error ? error.message : "خطأ غير معروف",
      },
      { status: 500 },
    )
  }
}
