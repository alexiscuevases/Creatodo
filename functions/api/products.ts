/// <reference types="@cloudflare/workers-types" />
import { type Env, SESSION_COOKIE, parseCookies } from "./auth/_utils"

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
  if (!sessionId) return Response.json({ error: "No autorizado" }, { status: 401 })

  const session = await env.DB.prepare(
    `SELECT s.id FROM sessions s WHERE s.id = ? AND s.expires_at > datetime('now')`
  )
    .bind(sessionId)
    .first()

  if (!session) return Response.json({ error: "Sesión inválida" }, { status: 401 })
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

// GET /api/products
export const onRequestGet = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}) => {
  try {
    const url = new URL(request.url)
    const categoryId = url.searchParams.get("categoryId")

    let query = `SELECT id, title, description, price, category_id, image, created_at, updated_at
                 FROM products`
    const bindings: string[] = []

    if (categoryId) {
      query += ` WHERE category_id = ?`
      bindings.push(categoryId)
    }

    query += ` ORDER BY created_at ASC`

    const stmt = env.DB.prepare(query)
    const { results } = bindings.length
      ? await stmt.bind(...bindings).all<ProductRow>()
      : await stmt.all<ProductRow>()

    return Response.json({ products: (results ?? []).map(rowToProduct) })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST /api/products  (auth required)
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
    const body = await request.json() as {
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
      return Response.json({ error: "La categoría es requerida" }, { status: 400 })
    }

    const categoryExists = await env.DB.prepare(
      `SELECT id FROM categories WHERE id = ?`
    )
      .bind(categoryId)
      .first()

    if (!categoryExists) {
      return Response.json({ error: "Categoría no encontrada" }, { status: 400 })
    }

    const id = `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    await env.DB.prepare(
      `INSERT INTO products (id, title, description, price, category_id, image)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(id, title.trim(), description, price, categoryId, image)
      .run()

    const created = await env.DB.prepare(
      `SELECT id, title, description, price, category_id, image, created_at, updated_at
       FROM products WHERE id = ?`
    )
      .bind(id)
      .first<ProductRow>()

    return Response.json({ product: rowToProduct(created!) }, { status: 201 })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
