import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import type { ReactNode } from "react"

interface AuthState {
  authenticated: boolean
  username: string | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    authenticated: false,
    username: null,
    loading: true,
  })

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = (await res.json()) as {
          authenticated: boolean
          username?: string
        }
        setState({
          authenticated: data.authenticated,
          username: data.username ?? null,
          loading: false,
        })
      } else {
        setState({ authenticated: false, username: null, loading: false })
      }
    } catch {
      setState({ authenticated: false, username: null, loading: false })
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const login = async (
    username: string,
    password: string
  ): Promise<{ error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = (await res.json()) as { success?: boolean; error?: string }
      if (res.ok && data.success) {
        await checkSession()
        return {}
      }
      return { error: data.error ?? "Error al iniciar sesión" }
    } catch {
      return { error: "Error de conexión" }
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setState({ authenticated: false, username: null, loading: false })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
