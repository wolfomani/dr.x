import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

const sql = neon(process.env.DATABASE_URL)

// User Management
export interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string | null
  createdAt: Date
  updatedAt: Date
  emailVerified: Date | null
  password: string | null
}

export interface UserPreferences {
  user_id: string
  language_preference: string | null
  theme_settings: any
  preferred_models: any
  enabled_tools: any
  created_at: Date
  updated_at: Date
}

// AI & Usage Tracking
export interface UsageLog {
  id: number
  user_id: string | null
  provider: string | null
  type: string | null
  prompt_length: number | null
  response_length: number | null
  processing_time: number | null
  tools_used: any
  created_at: Date
}

export interface AIResponseCache {
  id: number
  cache_key: string | null
  prompt_hash: string | null
  provider: string | null
  response: string | null
  tools: any
  created_at: Date
  expires_at: Date | null
}

// Projects & API Management
export interface Project {
  id: string
  user_id: string | null
  title: string | null
  description: string | null
  code: any
  tools: any
  status: string | null
  performance_score: number | null
  created_at: Date
  updated_at: Date
}

export interface ApiKey {
  id: string
  userId: string | null
  name: string | null
  key: string | null
  type: string | null
  permissions: string[]
  rateLimit: number | null
  isActive: boolean | null
  lastUsed: Date | null
  expiresAt: Date | null
  createdAt: Date
  updatedAt: Date
}

// Security & Monitoring
export interface SecurityAlert {
  id: string
  type: string | null
  severity: string | null
  message: string | null
  metadata: any
  resolved: boolean | null
  createdAt: Date
  updatedAt: Date
}

export interface SystemMetrics {
  id: number
  metric_name: string | null
  metric_value: number | null
  metadata: any
  recorded_at: Date
}

export class DrXDatabase {
  // User Management
  static async createUser(userData: Partial<User>): Promise<User> {
    const [user] = await sql`
      INSERT INTO "User" (name, email, image, role, password)
      VALUES (${userData.name || null}, ${userData.email || null}, ${userData.image || null}, 
              ${userData.role || "user"}, ${userData.password || null})
      RETURNING *
    `
    return user as User
  }

  static async getUserById(id: string): Promise<User | null> {
    const [user] = await sql`
      SELECT * FROM "User" WHERE id = ${id}
    `
    return (user as User) || null
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await sql`
      SELECT * FROM "User" WHERE email = ${email}
    `
    return (user as User) || null
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const [user] = await sql`
      UPDATE "User" 
      SET name = COALESCE(${userData.name}, name),
          email = COALESCE(${userData.email}, email),
          image = COALESCE(${userData.image}, image),
          role = COALESCE(${userData.role}, role),
          "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return user as User
  }

  // User Preferences
  static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const [prefs] = await sql`
      SELECT * FROM user_preferences WHERE user_id = ${userId}
    `
    return (prefs as UserPreferences) || null
  }

  static async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const [prefs] = await sql`
      INSERT INTO user_preferences (user_id, language_preference, theme_settings, preferred_models, enabled_tools)
      VALUES (${userId}, ${preferences.language_preference || "ar"}, 
              ${JSON.stringify(preferences.theme_settings || {})},
              ${JSON.stringify(preferences.preferred_models || {})},
              ${JSON.stringify(preferences.enabled_tools || {})})
      ON CONFLICT (user_id) DO UPDATE SET
        language_preference = EXCLUDED.language_preference,
        theme_settings = EXCLUDED.theme_settings,
        preferred_models = EXCLUDED.preferred_models,
        enabled_tools = EXCLUDED.enabled_tools,
        updated_at = NOW()
      RETURNING *
    `
    return prefs as UserPreferences
  }

  // Usage Logging
  static async logUsage(usageData: Omit<UsageLog, "id" | "created_at">): Promise<UsageLog> {
    const [log] = await sql`
      INSERT INTO usage_logs (user_id, provider, type, prompt_length, response_length, processing_time, tools_used)
      VALUES (${usageData.user_id}, ${usageData.provider}, ${usageData.type},
              ${usageData.prompt_length}, ${usageData.response_length}, 
              ${usageData.processing_time}, ${JSON.stringify(usageData.tools_used || {})})
      RETURNING *
    `
    return log as UsageLog
  }

  static async getUsageStats(userId?: string, days = 30) {
    const whereClause = userId ? sql`WHERE user_id = ${userId} AND` : sql`WHERE`

    return await sql`
      SELECT 
        provider,
        COUNT(*) as request_count,
        AVG(processing_time) as avg_processing_time,
        SUM(prompt_length + response_length) as total_tokens,
        DATE_TRUNC('day', created_at) as date
      FROM usage_logs 
      ${whereClause} created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY provider, DATE_TRUNC('day', created_at)
      ORDER BY date DESC
    `
  }

  // AI Response Caching
  static async getCachedResponse(cacheKey: string): Promise<AIResponseCache | null> {
    const [cached] = await sql`
      SELECT * FROM ai_responses_cache 
      WHERE cache_key = ${cacheKey} AND (expires_at IS NULL OR expires_at > NOW())
    `
    return (cached as AIResponseCache) || null
  }

  static async setCachedResponse(cacheData: Omit<AIResponseCache, "id" | "created_at">): Promise<AIResponseCache> {
    const [cached] = await sql`
      INSERT INTO ai_responses_cache (cache_key, prompt_hash, provider, response, tools, expires_at)
      VALUES (${cacheData.cache_key}, ${cacheData.prompt_hash}, ${cacheData.provider},
              ${cacheData.response}, ${JSON.stringify(cacheData.tools || {})}, ${cacheData.expires_at})
      RETURNING *
    `
    return cached as AIResponseCache
  }

  // Project Management
  static async createProject(projectData: Omit<Project, "created_at" | "updated_at">): Promise<Project> {
    const [project] = await sql`
      INSERT INTO projects (id, user_id, title, description, code, tools, status, performance_score)
      VALUES (${projectData.id}, ${projectData.user_id}, ${projectData.title}, 
              ${projectData.description}, ${JSON.stringify(projectData.code || {})},
              ${JSON.stringify(projectData.tools || {})}, ${projectData.status || "active"},
              ${projectData.performance_score || 0})
      RETURNING *
    `
    return project as Project
  }

  static async getUserProjects(userId: string): Promise<Project[]> {
    return (await sql`
      SELECT * FROM projects WHERE user_id = ${userId} ORDER BY updated_at DESC
    `) as Project[]
  }

  static async updateProject(id: string, projectData: Partial<Project>): Promise<Project> {
    const [project] = await sql`
      UPDATE projects 
      SET title = COALESCE(${projectData.title}, title),
          description = COALESCE(${projectData.description}, description),
          code = COALESCE(${JSON.stringify(projectData.code)}, code),
          tools = COALESCE(${JSON.stringify(projectData.tools)}, tools),
          status = COALESCE(${projectData.status}, status),
          performance_score = COALESCE(${projectData.performance_score}, performance_score),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return project as Project
  }

  // API Key Management
  static async createApiKey(keyData: Omit<ApiKey, "createdAt" | "updatedAt">): Promise<ApiKey> {
    const [apiKey] = await sql`
      INSERT INTO "ApiKey" (id, "userId", name, key, type, permissions, "rateLimit", "isActive", "expiresAt")
      VALUES (${keyData.id}, ${keyData.userId}, ${keyData.name}, ${keyData.key},
              ${keyData.type || "standard"}, ${keyData.permissions || []}, 
              ${keyData.rateLimit || 1000}, ${keyData.isActive !== false}, ${keyData.expiresAt})
      RETURNING *
    `
    return apiKey as ApiKey
  }

  static async getApiKey(key: string): Promise<ApiKey | null> {
    const [apiKey] = await sql`
      SELECT * FROM "ApiKey" WHERE key = ${key} AND "isActive" = true
    `
    return (apiKey as ApiKey) || null
  }

  static async updateApiKeyUsage(keyId: string): Promise<void> {
    await sql`
      UPDATE "ApiKey" SET "lastUsed" = NOW() WHERE id = ${keyId}
    `
  }

  // Security & Monitoring
  static async createSecurityAlert(alertData: Omit<SecurityAlert, "createdAt" | "updatedAt">): Promise<SecurityAlert> {
    const [alert] = await sql`
      INSERT INTO "SecurityAlert" (id, type, severity, message, metadata, resolved)
      VALUES (${alertData.id}, ${alertData.type}, ${alertData.severity}, 
              ${alertData.message}, ${JSON.stringify(alertData.metadata || {})}, 
              ${alertData.resolved || false})
      RETURNING *
    `
    return alert as SecurityAlert
  }

  static async getUnresolvedAlerts(): Promise<SecurityAlert[]> {
    return (await sql`
      SELECT * FROM "SecurityAlert" WHERE resolved = false ORDER BY "createdAt" DESC
    `) as SecurityAlert[]
  }

  static async recordSystemMetric(metricData: Omit<SystemMetrics, "id" | "recorded_at">): Promise<SystemMetrics> {
    const [metric] = await sql`
      INSERT INTO system_metrics (metric_name, metric_value, metadata)
      VALUES (${metricData.metric_name}, ${metricData.metric_value}, 
              ${JSON.stringify(metricData.metadata || {})})
      RETURNING *
    `
    return metric as SystemMetrics
  }

  static async getSystemMetrics(metricName?: string, hours = 24) {
    const whereClause = metricName ? sql`WHERE metric_name = ${metricName} AND` : sql`WHERE`

    return await sql`
      SELECT * FROM system_metrics 
      ${whereClause} recorded_at >= NOW() - INTERVAL '${hours} hours'
      ORDER BY recorded_at DESC
    `
  }

  // Dashboard Analytics
  static async getDashboardStats(userId?: string) {
    const userFilter = userId ? sql`WHERE user_id = ${userId}` : sql``

    const [stats] = await sql`
      SELECT 
        COUNT(DISTINCT ul.user_id) as total_users,
        COUNT(ul.id) as total_requests,
        AVG(ul.processing_time) as avg_response_time,
        SUM(ul.prompt_length + ul.response_length) as total_tokens,
        COUNT(DISTINCT ul.provider) as active_providers
      FROM usage_logs ul
      ${userFilter}
      WHERE ul.created_at >= NOW() - INTERVAL '30 days'
    `

    const providerStats = await sql`
      SELECT 
        provider,
        COUNT(*) as requests,
        AVG(processing_time) as avg_time,
        SUM(prompt_length + response_length) as tokens
      FROM usage_logs
      ${userFilter}
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY provider
      ORDER BY requests DESC
    `

    const dailyUsage = await sql`
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        COUNT(*) as requests,
        COUNT(DISTINCT user_id) as unique_users
      FROM usage_logs
      ${userFilter}
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date DESC
    `

    return {
      overview: stats,
      providerStats,
      dailyUsage,
    }
  }

  // Health Check
  static async healthCheck(): Promise<boolean> {
    try {
      await sql`SELECT 1`
      return true
    } catch (error) {
      console.error("Database health check failed:", error)
      return false
    }
  }

  // Cleanup old data
  static async cleanupOldData(daysToKeep = 90): Promise<number> {
    const [result] = await sql`
      WITH deleted AS (
        DELETE FROM usage_logs 
        WHERE created_at < NOW() - INTERVAL '${daysToKeep} days'
        RETURNING id
      )
      SELECT COUNT(*) as deleted_count FROM deleted
    `

    // Clean up expired cache entries
    await sql`
      DELETE FROM ai_responses_cache 
      WHERE expires_at IS NOT NULL AND expires_at < NOW()
    `

    return result.deleted_count || 0
  }
}

export { sql }
export default DrXDatabase
