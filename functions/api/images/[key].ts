/// <reference types="@cloudflare/workers-types" />
import { type Env } from "../auth/_utils"

// GET /api/images/:key  — serves objects stored in R2
export const onRequestGet = async ({
  params,
  env,
}: {
  params: { key: string }
  env: Env
}) => {
  const key = params.key

  if (!key) {
    return new Response("Not found", { status: 404 })
  }

  try {
    const object = await env.STORAGE.get(key)

    if (!object) {
      return new Response("Not found", { status: 404 })
    }

    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set("etag", object.httpEtag)
    // Cache for 1 year since images are immutable (content-addressed keys)
    headers.set("cache-control", "public, max-age=31536000, immutable")

    return new Response(object.body, { headers })
  } catch (err) {
    console.error("Error serving image from R2:", err)
    return new Response("Internal Server Error", { status: 500 })
  }
}
