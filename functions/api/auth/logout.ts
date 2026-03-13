import {
  type Env,
  SESSION_COOKIE,
  clearSessionCookie,
  parseCookies,
} from "./_utils"

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}) => {
  try {
    const cookies = parseCookies(request.headers.get("Cookie"))
    const sessionId = cookies[SESSION_COOKIE]

    if (sessionId) {
      await env.DB.prepare("DELETE FROM sessions WHERE id = ?")
        .bind(sessionId)
        .run()
    }

    return Response.json(
      { success: true },
      {
        headers: {
          "Set-Cookie": clearSessionCookie(),
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
