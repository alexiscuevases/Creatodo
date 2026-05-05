import { useRef, useState } from "react"
import { Loader2, Upload, Download, Image as ImageIcon } from "lucide-react"

export function RemoveBgTool() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setResultUrl(null)
    setOriginalUrl(URL.createObjectURL(file))
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/remove-bg", { method: "POST", body: fd })
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(err.error || "Error al procesar la imagen")
      }
      const data = (await res.json()) as { url: string }
      setResultUrl(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const reset = () => {
    setOriginalUrl(null)
    setResultUrl(null)
    setError(null)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Remover fondo de imágenes
          </h2>
          <p className="text-sm text-muted-foreground">
            Sube una imagen y obtén la versión con fondo transparente (PNG).
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFile}
        />
        <div className="flex gap-2">
          {(originalUrl || resultUrl) && !loading && (
            <button
              onClick={reset}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted"
            >
              Limpiar
            </button>
          )}
          <button
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {loading ? "Procesando..." : "Subir imagen"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Panel label="Original" url={originalUrl} />
        <Panel label="Sin fondo" url={resultUrl} loading={loading} download />
      </div>
    </div>
  )
}

function Panel({
  label,
  url,
  loading,
  download,
}: {
  label: string
  url: string | null
  loading?: boolean
  download?: boolean
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {download && url && (
          <a
            href={url}
            download
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <Download className="size-3.5" />
            Descargar
          </a>
        )}
      </div>
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-border"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
        }}
      >
        {loading ? (
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        ) : url ? (
          <img
            src={url}
            alt={label}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="size-8" />
            <span className="text-xs">Sin imagen</span>
          </div>
        )}
      </div>
    </div>
  )
}
