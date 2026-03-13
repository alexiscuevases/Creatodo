import {
  type Env,
  hashPassword,
  generateSessionId,
  buildSessionCookie,
  SESSION_DURATION_DAYS,
} from "./_utils"

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}) => {
  try {
    const body = (await request.json()) as {
      username: string
      password: string
    }
    const { username, password } = body

    if (!username || !password) {
      return Response.json({ error: "Faltan credenciales" }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)

    const user = (await env.DB.prepare(
      "SELECT id FROM users WHERE username = ? AND password_hash = ?"
    )
      .bind(username, passwordHash)
      .first()) as { id: number } | null

    if (!user) {
      return Response.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      )
    }

    const sessionId = generateSessionId()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

    await env.DB.prepare(
      "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
    )
      .bind(sessionId, user.id, expiresAt.toISOString())
      .run()

    return Response.json(
      { success: true },
      {
        headers: {
          "Set-Cookie": buildSessionCookie(sessionId, expiresAt),
        },
      }
    )
  } catch {
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
