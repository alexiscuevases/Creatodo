/// <reference types="@cloudflare/workers-types" />
import { type Env, SESSION_COOKIE, parseCookies } from "../auth/_utils"

interface ProductRow {
  id: string
  title: string
  description: string
  price: number
  category_id: string
  image: string
  created_at: string
  updated_at: string
}

async function requireAuth(
  request: Request,
  env: Env
): Promise<Response | null> {
  const cookies = parseCookies(request.headers.get("Cookie"))
  const sessionId = cookies[SESSION_COOKIE]
  if (!sessionId)
    return Response.json({ error: "No autorizado" }, { status: 401 })

  const session = await env.DB.prepare(
    `SELECT s.id FROM sessions s WHERE s.id = ? AND s.expires_at > datetime('now')`
  )
    .bind(sessionId)
    .first()

  if (!session)
    return Response.json({ error: "Sesión inválida" }, { status: 401 })
  return null
}

function rowToProduct(row: ProductRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    categoryId: row.category_id,
    image: row.image,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

// GET /api/products/:id
export const onRequestGet = async ({
  params,
  env,
}: {
  params: { id: string }
  env: Env
  request: Request
}) => {
  try {
    const product = await env.DB.prepare(
      `SELECT id, title, description, price, category_id, image, created_at, updated_at
       FROM products WHERE id = ?`
    )
      .bind(params.id)
      .first<ProductRow>()

    if (!product) {
      return Response.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return Response.json({ product: rowToProduct(product) })
  } catch (err) {
    console.error(err)
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PUT /api/products/:id  (auth required)
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
      `SELECT id FROM products WHERE id = ?`
    )
      .bind(params.id)
      .first()

    if (!existing) {
      return Response.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    const body = (await request.json()) as {
      title?: string
      description?: string
      price?: number
      categoryId?: string
      image?: string
    }

    const { title, description = "", price = 0, categoryId, image = "" } = body

    if (!title?.trim()) {
      return Response.json({ error: "El título es requerido" }, { status: 400 })
    }
    if (!categoryId) {
      return Response.json(
        { error: "La categoría es requerida" },
        { status: 400 }
      )
    }

    await env.DB.prepare(
      `UPDATE products
       SET title = ?, description = ?, price = ?, category_id = ?, image = ?, updated_at = datetime('now')
       WHERE id = ?`
    )
      .bind(title.trim(), description, price, categoryId, image, params.id)
      .run()

    const updated = await env.DB.prepare(
      `SELECT id, title, description, price, category_id, image, created_at, updated_at
       FROM products WHERE id = ?`
    )
      .bind(params.id)
      .first<ProductRow>()

    return Response.json({ product: rowToProduct(updated!) })
  } catch (err) {
    console.error(err)
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// DELETE /api/products/:id  (auth required)
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
      `SELECT id FROM products WHERE id = ?`
    )
      .bind(params.id)
      .first()

    if (!existing) {
      return Response.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    await env.DB.prepare(`DELETE FROM products WHERE id = ?`)
      .bind(params.id)
      .run()

    return Response.json({ success: true })
  } catch (err) {
    console.error(err)
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
