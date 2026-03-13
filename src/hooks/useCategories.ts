import { useState, useEffect, useCallback } from "react"
import type { Category } from "../lib/data"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/categories")
      if (!res.ok) throw new Error("Error al cargar categorías")
      const data = (await res.json()) as { categories: Category[] }
      setCategories(data.categories)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const addCategory = async (
    category: Omit<Category, "id" | "slug">
  ): Promise<Category> => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })
    if (!res.ok) {
      const err = (await res.json()) as { error: string }
      throw new Error(err.error || "Error al crear categoría")
    }
    const data = (await res.json()) as { category: Category }
    setCategories((prev) => [...prev, data.category])
    return data.category
  }

  const updateCategory = async (category: Category): Promise<Category> => {
    const res = await fetch(`/api/categories/${category.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })
    if (!res.ok) {
      const err = (await res.json()) as { error: string }
      throw new Error(err.error || "Error al actualizar categoría")
    }
    const data = (await res.json()) as { category: Category }
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? data.category : c))
    )
    return data.category
  }

  const deleteCategory = async (id: string): Promise<void> => {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const err = (await res.json()) as { error: string }
      throw new Error(err.error || "Error al eliminar categoría")
    }
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  }
}
