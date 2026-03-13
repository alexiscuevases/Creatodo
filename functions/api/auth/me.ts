import { type Env, SESSION_COOKIE, parseCookies } from "./_utils"

export const onRequestGet = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}) => {
  try {
    const cookies = parseCookies(request.headers.get("Cookie"))
    const sessionId = cookies[SESSION_COOKIE]

    if (!sessionId) {
      return Response.json({ authenticated: false }, { status: 401 })
    }

    const session = (await env.DB.prepare(
      `SELECT s.id, u.username
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > datetime('now')`
    )
      .bind(sessionId)
      .first()) as { id: string; username: string } | null

    if (!session) {
      return Response.json({ authenticated: false }, { status: 401 })
    }

    return Response.json({ authenticated: true, username: session.username })
  } catch {
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
