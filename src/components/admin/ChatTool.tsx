import { useEffect, useRef, useState } from "react"
import { Loader2, Send, Trash2, Bot, User as UserIcon } from "lucide-react"

interface ChatMessage {
  id: number
  role: "user" | "assistant" | "system"
  content: string
  tokens: number
  created_at: string
}

interface Usage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

export function ChatTool() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUsage, setLastUsage] = useState<Usage | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const totalTokens = messages.reduce((acc, m) => acc + (m.tokens || 0), 0)

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json() as Promise<{ messages: ChatMessage[] }>)
      .then((d) => setMessages(d.messages || []))
      .catch(() => setError("No se pudo cargar el historial"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, sending])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setError(null)
    setSending(true)

    // Optimistic user message
    const optimistic: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: text,
      tokens: 0,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])
    setInput("")

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(err.error || "Error en el chat")
      }
      const data = (await res.json()) as { reply: string; usage: Usage }
      setLastUsage(data.usage)
      // Replace optimistic with real (refetch lightweight: append assistant + update token count of the last user msg)
      setMessages((prev) => {
        const next = [...prev]
        const lastUser = next[next.length - 1]
        if (lastUser && lastUser.id === optimistic.id) {
          next[next.length - 1] = {
            ...lastUser,
            tokens: data.usage.prompt_tokens,
          }
        }
        next.push({
          id: optimistic.id + 1,
          role: "assistant",
          content: data.reply,
          tokens: data.usage.completion_tokens,
          created_at: new Date().toISOString(),
        })
        return next
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
      setInput(text)
    } finally {
      setSending(false)
    }
  }

  const clear = async () => {
    if (!confirm("¿Borrar todo el historial del chat?")) return
    try {
      await fetch("/api/chat", { method: "DELETE" })
      setMessages([])
      setLastUsage(null)
    } catch {
      setError("No se pudo borrar el historial")
    }
  }

  return (
    <div className="flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Asistente con memoria
          </h2>
          <p className="text-xs text-muted-foreground">
            Modelo: Llama 3.1 8B (Workers AI) · Memoria persistente en D1
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right text-xs text-muted-foreground sm:block">
            <div>
              <span className="font-semibold text-foreground">
                {totalTokens.toLocaleString()}
              </span>{" "}
              tokens totales
            </div>
            {lastUsage && (
              <div>
                Último: {lastUsage.prompt_tokens}↑ / {lastUsage.completion_tokens}↓
              </div>
            )}
          </div>
          <button
            onClick={clear}
            disabled={messages.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-40"
            title="Borrar historial"
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {loading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 size-5 animate-spin" />
            Cargando historial...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <Bot className="size-10" />
            <p className="text-sm">
              Empieza una conversación. El asistente recuerda los mensajes
              anteriores.
            </p>
          </div>
        ) : (
          messages.map((m) => <Bubble key={m.id} msg={m} />)
        )}
        {sending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Pensando...
          </div>
        )}
      </div>

      {error && (
        <div className="border-t border-destructive/30 bg-destructive/10 px-6 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <form
        onSubmit={send}
        className="flex items-center gap-2 border-t border-border bg-background/50 px-4 py-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
          placeholder="Escribe un mensaje..."
          className="h-11 flex-1 rounded-xl border border-input bg-background px-4 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex h-11 items-center gap-2 rounded-xl bg-primary px-5 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
        >
          {sending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          Enviar
        </button>
      </form>
    </div>
  )
}

function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user"
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
        }`}
      >
        {isUser ? <UserIcon className="size-4" /> : <Bot className="size-4" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-foreground"
          }`}
        >
          {msg.content}
        </div>
        {msg.tokens > 0 && (
          <span className="px-2 text-[10px] text-muted-foreground">
            {msg.tokens} tokens
          </span>
        )}
      </div>
    </div>
  )
}
