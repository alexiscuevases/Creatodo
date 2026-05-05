/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database
  STORAGE: R2Bucket
  AI: Ai
  REMOVE_BG_API_KEY?: string
}

/** Returns the authenticated user id from the session cookie, or null. */
export async function requireUserId(
  request: Request,
  env: Env
): Promise<number | null> {
  const cookies = parseCookies(request.headers.get("Cookie"))
  const sessionId = cookies[SESSION_COOKIE]
  if (!sessionId) return null
  const row = (await env.DB.prepare(
    `SELECT user_id FROM sessions WHERE id = ? AND expires_at > datetime('now')`
  )
    .bind(sessionId)
    .first()) as { user_id: number } | null
  return row?.user_id ?? null
}

export const SESSION_COOKIE = "creatodo_session"
export const SESSION_DURATION_DAYS = 7

/** SHA-256 hash using Web Crypto (available in Workers) */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

/** Generate a cryptographically random session ID */
export function generateSessionId(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/** Build a Set-Cookie header string */
export function buildSessionCookie(sessionId: string, expires: Date): string {
  return `${SESSION_COOKIE}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}`
}

/** Build a cookie that clears the session */
export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

/** Parse cookies from a request header */
export function parseCookies(
  cookieHeader: string | null
): Record<string, string> {
  if (!cookieHeader) return {}
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...v] = c.trim().split("=")
      return [key.trim(), v.join("=").trim()]
    })
  )
}
