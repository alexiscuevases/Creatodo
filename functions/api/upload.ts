/// <reference types="@cloudflare/workers-types" />
import { type Env, SESSION_COOKIE, parseCookies } from "./auth/_utils"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

// POST /api/upload  (auth required)
export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}) => {
  // Auth check
  const cookies = parseCookies(request.headers.get("Cookie"))
  const sessionId = cookies[SESSION_COOKIE]
  if (!sessionId) {
    return Response.json({ error: "No autorizado" }, { status: 401 })
  }

  const session = await env.DB.prepare(
    `SELECT s.id FROM sessions s WHERE s.id = ? AND s.expires_at > datetime('now')`
  )
    .bind(sessionId)
    .first()

  if (!session) {
    return Response.json({ error: "Sesión inválida" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json(
        { error: "No se recibió ningún archivo" },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { error: "Tipo de archivo no permitido. Use JPG, PNG, WEBP o GIF" },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return Response.json(
        { error: "El archivo supera el tamaño máximo de 5 MB" },
        { status: 400 }
      )
    }

    // Build a unique key without subdirectories so the route [key] matches it.
    // Format: <timestamp>-<random>.<ext>  e.g. 1741876800000-a3f9z2k.jpg
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const key = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`

    const arrayBuffer = await file.arrayBuffer()

    await env.STORAGE.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    })

    // Return the public URL served through the /api/images/[key] route,
    // which proxies the object directly from R2.
    const base = new URL(request.url).origin
    const publicUrl = `${base}/api/images/${key}`

    return Response.json({ url: publicUrl }, { status: 201 })
  } catch (err) {
    console.error(err)
    return Response.json(
      { error: "Error al subir el archivo" },
      { status: 500 }
    )
  }
}
