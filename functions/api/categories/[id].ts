/// <reference types="@cloudflare/workers-types" />
import { type Env, SESSION_COOKIE, parseCookies } from "../auth/_utils"

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

// GET /api/categories/:id
export const onRequestGet = async ({
  params,
  env,
}: {
  params: { id: string }
  env: Env
  request: Request
}) => {
  try {
    const category = await env.DB.prepare(
      `SELECT id, name, description, image, accent, slug, created_at, updated_at
       FROM categories WHERE id = ?`
    )
      .bind(params.id)
      .first<CategoryRow>()

    if (!category) {
      return Response.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    return Response.json({ category })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT /api/categories/:id  (auth required)
export const onRequestPut = async ({
  request,
  params,
  env,
}: {
  request: Request
  params: { id: string }
  env: Env
}) => {
  const authError = await requireAuth(request, env)
  if (authError) return authError

  try {
    const existing = await env.DB.prepare(
      `SELECT id FROM categories WHERE id = ?`
    )
      .bind(params.id)
      .first()

    if (!existing) {
      return Response.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    const body = await request.json() as Partial<CategoryRow>
    const { name, description, image, accent } = body

    if (!name?.trim()) {
      return Response.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const slug = generateSlug(name)

    await env.DB.prepare(
      `UPDATE categories
       SET name = ?, description = ?, image = ?, accent = ?, slug = ?, updated_at = datetime('now')
       WHERE id = ?`
    )
      .bind(name.trim(), description ?? "", image ?? "", accent ?? "", slug, params.id)
      .run()

    const updated = await env.DB.prepare(
      `SELECT id, name, description, image, accent, slug, created_at, updated_at
       FROM categories WHERE id = ?`
    )
      .bind(params.id)
      .first<CategoryRow>()

    return Response.json({ category: updated })
  } catch (err: unknown) {
    console.error(err)
    if (err instanceof Error && err.message?.includes("UNIQUE")) {
      return Response.json({ error: "Ya existe una categoría con ese nombre" }, { status: 409 })
    }
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE /api/categories/:id  (auth required)
export const onRequestDelete = async ({
  request,
  params,
  env,
}: {
  request: Request
  params: { id: string }
  env: Env
}) => {
  const authError = await requireAuth(request, env)
  if (authError) return authError

  try {
    const existing = await env.DB.prepare(
      `SELECT id FROM categories WHERE id = ?`
    )
      .bind(params.id)
      .first()

    if (!existing) {
      return Response.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    await env.DB.prepare(`DELETE FROM categories WHERE id = ?`)
      .bind(params.id)
      .run()

    return Response.json({ success: true })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
