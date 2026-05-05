/// <reference types="@cloudflare/workers-types" />
import { type Env, requireUserId } from "./auth/_utils"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB (remove.bg accepts up to ~12MB)

// POST /api/remove-bg  (auth required)
// Body: multipart/form-data with field "file"
// Returns: { url: string }  (PNG with transparent background, stored in R2)
export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}) => {
  const userId = await requireUserId(request, env)
  if (!userId) {
    return Response.json({ error: "No autorizado" }, { status: 401 })
  }

  if (!env.REMOVE_BG_API_KEY) {
    return Response.json(
      { error: "Falta REMOVE_BG_API_KEY en el servidor" },
      { status: 500 }
    )
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
        { error: "Tipo no permitido. Usa JPG, PNG o WEBP" },
        { status: 400 }
      )
    }
    if (file.size > MAX_SIZE_BYTES) {
      return Response.json(
        { error: "El archivo supera el tamaño máximo de 10 MB" },
        { status: 400 }
      )
    }

    // Forward to remove.bg
    const fd = new FormData()
    fd.append("image_file", file)
    fd.append("size", "auto")
    fd.append("format", "png")

    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": env.REMOVE_BG_API_KEY },
      body: fd,
    })

    if (!res.ok) {
      let detail = ""
      try {
        const errBody = (await res.json()) as {
          errors?: Array<{ title?: string }>
        }
        detail = errBody.errors?.[0]?.title || ""
      } catch {
        detail = await res.text().catch(() => "")
      }
      return Response.json(
        { error: `remove.bg: ${detail || res.statusText}` },
        { status: 502 }
      )
    }

    const pngBuffer = await res.arrayBuffer()

    // Store in R2 with a unique key, like /api/upload does
    const key = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}-nobg.png`
    await env.STORAGE.put(key, pngBuffer, {
      httpMetadata: { contentType: "image/png" },
    })

    const base = new URL(request.url).origin
    const publicUrl = `${base}/api/images/${key}`

    return Response.json({ url: publicUrl }, { status: 201 })
  } catch (err) {
    console.error(err)
    return Response.json(
      { error: "Error al procesar la imagen" },
      { status: 500 }
    )
  }
}
