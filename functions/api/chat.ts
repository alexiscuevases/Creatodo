/// <reference types="@cloudflare/workers-types" />
import { type Env, requireUserId } from "./auth/_utils"

const MODEL = "@cf/meta/llama-3.1-8b-instruct"
const MAX_HISTORY_MESSAGES = 20
const SYSTEM_PROMPT =
  "Eres un asistente para administrar el catálogo de una tienda de regalos. " +
  "Respondes en español, breve y útil."

interface ChatRow {
  id: number
  role: "user" | "assistant" | "system"
  content: string
  tokens: number
  created_at: string
}

// GET /api/chat  -> { messages: ChatRow[] }
export const onRequestGet = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}) => {
  const userId = await requireUserId(request, env)
  if (!userId) return Response.json({ error: "No autorizado" }, { status: 401 })

  const { results } = await env.DB.prepare(
    `SELECT id, role, content, tokens, created_at
     FROM chat_messages
     WHERE user_id = ?
     ORDER BY id ASC`
  )
    .bind(userId)
    .all<ChatRow>()

  return Response.json({ messages: results ?? [] })
}

// POST /api/chat  body: { message: string }
// -> { reply: string, usage: { prompt_tokens, completion_tokens, total_tokens } }
export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}) => {
  const userId = await requireUserId(request, env)
  if (!userId) return Response.json({ error: "No autorizado" }, { status: 401 })

  let body: { message?: string }
  try {
    body = (await request.json()) as { message?: string }
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 })
  }
  const message = body.message?.trim()
  if (!message) {
    return Response.json({ error: "Mensaje vacío" }, { status: 400 })
  }

  // Load recent history (most recent N), ordered chronologically
  const { results: history } = await env.DB.prepare(
    `SELECT role, content FROM chat_messages
     WHERE user_id = ?
     ORDER BY id DESC
     LIMIT ?`
  )
    .bind(userId, MAX_HISTORY_MESSAGES)
    .all<{ role: "user" | "assistant"; content: string }>()

  const ordered = (history ?? []).reverse()

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...ordered,
    { role: "user", content: message },
  ]

  // Call Workers AI
  let aiRes: {
    response?: string
    usage?: {
      prompt_tokens?: number
      completion_tokens?: number
      total_tokens?: number
    }
  }
  try {
    aiRes = (await env.AI.run(MODEL as never, { messages } as never)) as never
  } catch (err) {
    console.error("AI run failed", err)
    return Response.json(
      { error: "Error al consultar el modelo" },
      { status: 502 }
    )
  }

  const reply = (aiRes.response ?? "").trim()
  const usage = {
    prompt_tokens: aiRes.usage?.prompt_tokens ?? 0,
    completion_tokens: aiRes.usage?.completion_tokens ?? 0,
    total_tokens: aiRes.usage?.total_tokens ?? 0,
  }

  // Persist both messages
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO chat_messages (user_id, role, content, tokens) VALUES (?, 'user', ?, ?)`
    ).bind(userId, message, usage.prompt_tokens),
    env.DB.prepare(
      `INSERT INTO chat_messages (user_id, role, content, tokens) VALUES (?, 'assistant', ?, ?)`
    ).bind(userId, reply, usage.completion_tokens),
  ])

  return Response.json({ reply, usage })
}

// DELETE /api/chat -> clears the user's chat history
export const onRequestDelete = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}) => {
  const userId = await requireUserId(request, env)
  if (!userId) return Response.json({ error: "No autorizado" }, { status: 401 })

  await env.DB.prepare(`DELETE FROM chat_messages WHERE user_id = ?`)
    .bind(userId)
    .run()

  return Response.json({ success: true })
}
