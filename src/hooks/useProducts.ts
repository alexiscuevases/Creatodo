import { useState, useEffect, useCallback } from "react"
import type { Product } from "../lib/data"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async (categoryId?: string) => {
    setLoading(true)
    setError(null)
    try {
      const url = categoryId
        ? `/api/products?categoryId=${encodeURIComponent(categoryId)}`
        : "/api/products"
      const res = await fetch(url)
      if (!res.ok) throw new Error("Error al cargar productos")
      const data = (await res.json()) as { products: Product[] }
      setProducts(data.products)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const addProduct = async (product: Omit<Product, "id">): Promise<Product> => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
    if (!res.ok) {
      const err = (await res.json()) as { error: string }
      throw new Error(err.error || "Error al crear producto")
    }
    const data = (await res.json()) as { product: Product }
    setProducts((prev) => [...prev, data.product])
    return data.product
  }

  const updateProduct = async (product: Product): Promise<Product> => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
    if (!res.ok) {
      const err = (await res.json()) as { error: string }
      throw new Error(err.error || "Error al actualizar producto")
    }
    const data = (await res.json()) as { product: Product }
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? data.product : p))
    )
    return data.product
  }

  const deleteProduct = async (id: string): Promise<void> => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const err = (await res.json()) as { error: string }
      throw new Error(err.error || "Error al eliminar producto")
    }
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  }
}
