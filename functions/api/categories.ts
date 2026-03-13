/// <reference types="@cloudflare/workers-types" />
import { type Env, SESSION_COOKIE, parseCookies } from "./auth/_utils"

interface CategoryRow {
  id: string
  name: string
  description: string
  image: string
  accent: string
  slug: string
  created_at: string
  updated_at: string
}

function generateSlug(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

async function requireAuth(
  request: Request,
  env: Env
): Promise<Response | null> {
  const cookies = parseCookies(request.headers.get("Cookie"))
  const sessionId = cookies[SESSION_COOKIE]
  if (!sessionId) return Response.json({ error: "No autorizado" }, { status: 401 })

  const session = await env.DB.prepare(
    `SELECT s.id FROM sessions s WHERE s.id = ? AND s.expires_at > datetime('now')`
  )
    .bind(sessionId)
    .first()

  if (!session) return Response.json({ error: "Sesión inválida" }, { status: 401 })
  return null
}

// GET /api/categories
export const onRequestGet = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}) => {
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, name, description, image, accent, slug, created_at, updated_at
       FROM categories ORDER BY created_at ASC`
    ).all<CategoryRow>()

    return Response.json({ categories: results ?? [] })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST /api/categories  (auth required)
export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}) => {
  const authError = await requireAuth(request, env)
  if (authError) return authError

  try {
    const body = await request.json() as Partial<CategoryRow>
    const { name, description = "", image = "", accent = "" } = body

    if (!name?.trim()) {
      return Response.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const id = `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const slug = generateSlug(name)

    await env.DB.prepare(
      `INSERT INTO categories (id, name, description, image, accent, slug)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(id, name.trim(), description, image, accent, slug)
      .run()

    const created = await env.DB.prepare(
      `SELECT id, name, description, image, accent, slug, created_at, updated_at
       FROM categories WHERE id = ?`
    )
      .bind(id)
      .first<CategoryRow>()

    return Response.json({ category: created }, { status: 201 })
  } catch (err: unknown) {
    console.error(err)
    if (err instanceof Error && err.message?.includes("UNIQUE")) {
      return Response.json({ error: "Ya existe una categoría con ese nombre" }, { status: 409 })
    }
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
