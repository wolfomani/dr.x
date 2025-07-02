import { type NextRequest, NextResponse } from "next/server"

interface ChatRequest {
  message: string
  settings: {
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
  history: Array<{
    role: "user" | "assistant"
    content: string
  }>
}

// Groq API call
async function callGroqAPI(messages: any[], settings: any) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: settings.model === "auto" ? "qwen-qwq-32b" : settings.model,
      messages,
      temperature: settings.temperature,
      max_completion_tokens: settings.maxTokens,
      top_p: settings.topP,
      stream: false,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Groq API error: ${response.status} - ${errorText}`)
  }

  return response.json()
}

// Together AI API call
async function callTogetherAPI(messages: any[], settings: any) {
  const response = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: settings.model === "auto" ? "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free" : settings.model,
      messages,
      temperature: settings.temperature,
      max_tokens: settings.maxTokens,
      top_p: settings.topP,
      stream: false,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Together API error: ${response.status} - ${errorText}`)
  }

  return response.json()
}

// Gemini API call
async function callGeminiAPI(messages: any[], settings: any) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: messages.map((msg: any) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
        generationConfig: {
          temperature: settings.temperature,
          maxOutputTokens: settings.maxTokens,
          topP: settings.topP,
          ...(settings.enableThinking && {
            thinkingConfig: {
              thinkingBudget: 10467,
            },
          }),
        },
        ...(settings.enableSearch && {
          tools: [{ codeExecution: {} }],
        }),
      }),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  // تحويل استجابة Gemini إلى تنسيق موحد
  return {
    choices: [
      {
        message: {
          content: data.candidates?.[0]?.content?.parts?.[0]?.text || "لم يتم إنتاج رد مناسب.",
        },
      },
    ],
    usage: {
      total_tokens: data.usageMetadata?.totalTokenCount || 0,
    },
  }
}

// Create enhanced system prompt
function createSystemPrompt(settings: any): string {
  let prompt =
    settings.systemPrompt ||
    `أنت drx3، مساعد ذكي متخصص في الذكاء الاصطناعي والبرمجة والتكنولوجيا.

خصائصك:
- خبير في Python، JavaScript، الذكاء الاصطناعي، والتعلم الآلي
- تجيب باللغة العربية بشكل أساسي مع دعم الإنجليزية عند الحاجة
- تقدم إجابات منظمة ومفصلة ومفيدة
- تستخدم التنسيق المناسب (عناوين، قوائم، كود)
- تشرح المفاهيم بطريقة واضحة ومنطقية

إرشادات التنسيق:
- استخدم العناوين (# ## ###) لتنظيم المحتوى
- استخدم القوائم المرقمة والنقطية عند الحاجة
- ضع الكود في صناديق مع تحديد اللغة
- استخدم النص الغامق للنقاط المهمة
- نظم الإجابة بشكل هرمي وواضح`

  if (settings.enableThinking) {
    prompt += "\n- فكر خطوة بخطوة قبل الإجابة وأظهر عملية التفكير"
  }

  if (settings.enableSearch) {
    prompt += "\n- ابحث في معرفتك بعمق للحصول على أفضل إجابة شاملة"
  }

  if (settings.enableRAG) {
    prompt += "\n- استخدم قاعدة المعرفة المتاحة للحصول على معلومات دقيقة ومحدثة"
  }

  return prompt
}

// Auto-select best provider based on availability and request type
async function selectBestProvider(settings: any): Promise<string> {
  if (settings.provider !== "auto") {
    return settings.provider
  }

  // فحص توفر المزودين
  const providers = []

  if (process.env.GROQ_API_KEY) providers.push("groq")
  if (process.env.TOGETHER_API_KEY) providers.push("together")
  if (process.env.GEMINI_API_KEY) providers.push("gemini")

  if (providers.length === 0) {
    throw new Error("لا توجد مزودي خدمة متاحين")
  }

  // اختيار المزود الأفضل حسب النوع
  if (settings.enableThinking && providers.includes("gemini")) {
    return "gemini" // Gemini أفضل للتفكير المتقدم
  } else if (settings.temperature > 1.5 && providers.includes("together")) {
    return "together" // Together AI أفضل للإبداع
  } else if (providers.includes("groq")) {
    return "groq" // Groq أسرع للاستجابات العامة
  }

  return providers[0]
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, settings, history } = body

    // Validate input
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // اختيار المزود الأمثل
    const selectedProvider = await selectBestProvider(settings)

    // Prepare messages for API
    const messages = [
      {
        role: "system",
        content: createSystemPrompt(settings),
      },
      // Add recent history for context
      ...history.slice(-6).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ]

    const startTime = Date.now()
    let response
    let actualModel = selectedProvider
    let fallbackUsed = false

    try {
      // Call the selected provider
      if (selectedProvider === "groq") {
        response = await callGroqAPI(messages, settings)
        actualModel = "Groq (Qwen-QwQ-32B)"
      } else if (selectedProvider === "together") {
        response = await callTogetherAPI(messages, settings)
        actualModel = "Together AI (DeepSeek-R1)"
      } else if (selectedProvider === "gemini") {
        response = await callGeminiAPI(messages, settings)
        actualModel = "Google Gemini 2.5 Pro"
      }
    } catch (error) {
      console.error(`Primary provider (${selectedProvider}) failed:`, error)
      fallbackUsed = true

      // Try fallback providers
      const fallbackProviders = ["groq", "together", "gemini"].filter(
        (p) => p !== selectedProvider && process.env[`${p.toUpperCase()}_API_KEY`],
      )

      for (const fallbackProvider of fallbackProviders) {
        try {
          if (fallbackProvider === "groq") {
            response = await callGroqAPI(messages, settings)
            actualModel = "Groq (Qwen-QwQ-32B) - Fallback"
          } else if (fallbackProvider === "together") {
            response = await callTogetherAPI(messages, settings)
            actualModel = "Together AI (DeepSeek-R1) - Fallback"
          } else if (fallbackProvider === "gemini") {
            response = await callGeminiAPI(messages, settings)
            actualModel = "Google Gemini 2.5 Pro - Fallback"
          }
          break
        } catch (fallbackError) {
          console.error(`Fallback provider (${fallbackProvider}) also failed:`, fallbackError)
          continue
        }
      }

      if (!response) {
        return NextResponse.json(
          {
            content: "عذراً، أواجه مشكلة تقنية مؤقتة في جميع الخدمات. يرجى المحاولة مرة أخرى.",
            model: "error",
            tokens: 0,
            processingTime: Date.now() - startTime,
            fallbackUsed: true,
          },
          { status: 500 },
        )
      }
    }

    const processingTime = Date.now() - startTime
    const content = response.choices[0]?.message?.content || "عذراً، لم أتمكن من إنتاج رد مناسب."

    // Log usage for analytics
    try {
      await fetch("/api/webhooks/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedProvider,
          model: actualModel,
          tokens: response.usage?.total_tokens || 0,
          processingTime,
          fallbackUsed,
          success: true,
        }),
      })
    } catch (logError) {
      console.warn("Failed to log usage:", logError)
    }

    return NextResponse.json({
      content,
      model: actualModel,
      tokens: response.usage?.total_tokens || Math.floor(content.length / 4),
      processingTime,
      fallbackUsed,
      provider: selectedProvider,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        content: "حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.",
        model: "error",
        tokens: 0,
        processingTime: 0,
        error: error instanceof Error ? error.message : "خطأ غير معروف",
      },
      { status: 500 },
    )
  }
}

// Health check endpoint
export async function GET() {
  const providers = {
    groq: !!process.env.GROQ_API_KEY,
    together: !!process.env.TOGETHER_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
  }

  const database = !!process.env.DATABASE_URL
  const redis = !!process.env.KV_REST_API_URL

  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    providers,
    database,
    redis,
    activeProviders: Object.values(providers).filter(Boolean).length,
    totalServices: Object.keys(providers).length + 2, // +2 for database and redis
  })
}
