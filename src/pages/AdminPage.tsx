import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Hero } from "@/components/Hero"
import { SocialFooter } from "../components/SocialFooter"
import { useProducts } from "../hooks/useProducts"
import { useCategories } from "../hooks/useCategories"
import type { Product, Category } from "../lib/data"
import { useAuth } from "../lib/auth"
import {
  Plus,
  Edit,
  Trash2,
  X,
  Package,
  FolderTree,
  LogOut,
} from "lucide-react"

export function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const { categories, addCategory, updateCategory, deleteCategory } =
    useCategories()
  const { logout, username } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/admin/login")
  }

  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "products"
  )

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Product>>({})

  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>(
    {}
  )

  const handleOpenModal = (product?: Product) => {
    // Set form data based on editing product or empty defaults
    if (product) {
      setEditingProduct(product)
      setFormData(product)
    } else {
      setEditingProduct(null)
      setFormData({
        id: `prod-${Date.now()}`,
        title: "",
        description: "",
        price: 0,
        categoryId: categories.length > 0 ? categories[0].id : "",
        image: "",
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct) {
      updateProduct(formData as Product)
    } else {
      addProduct(formData as Product)
    }
    handleCloseModal()
  }

  const handleOpenCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setCategoryFormData(category)
    } else {
      setEditingCategory(null)
      setCategoryFormData({
        id: `cat-${Date.now()}`,
        name: "",
        description: "",
        image: "",
      })
    }
    setIsCategoryModalOpen(true)
  }

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false)
    setEditingCategory(null)
    setCategoryFormData({})
  }

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory) {
      updateCategory(categoryFormData as Category)
    } else {
      addCategory(categoryFormData as Category)
    }
    handleCloseCategoryModal()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <main className="flex flex-1 flex-col bg-background py-12 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Administración
              </h1>
              <p className="mt-2 text-muted-foreground">
                Gestiona el catálogo de productos y categorías de forma
                centralizada.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {username && (
                <span className="hidden text-sm text-muted-foreground sm:block">
                  {username}
                </span>
              )}
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 font-medium text-foreground transition-all hover:bg-muted"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
              <button
                onClick={() =>
                  activeTab === "products"
                    ? handleOpenModal()
                    : handleOpenCategoryModal()
                }
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90"
              >
                <Plus className="size-5" />
                {activeTab === "products"
                  ? "Nuevo Producto"
                  : "Nueva Categoría"}
              </button>
            </div>
          </div>

          <div className="mb-8 flex w-full rounded-xl bg-secondary/30 p-1 sm:w-fit">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-medium transition-all sm:flex-none ${activeTab === "products" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
            >
              <Package className="size-4" />
              Productos
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-medium transition-all sm:flex-none ${activeTab === "categories" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
            >
              <FolderTree className="size-4" />
              Categorías
            </button>
          </div>

          {activeTab === "products" ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-secondary/20">
                      <th className="px-6 py-4 font-semibold text-foreground">
                        Imagen
                      </th>
                      <th className="px-6 py-4 font-semibold text-foreground">
                        Nombre / Descripción
                      </th>
                      <th className="px-6 py-4 font-semibold text-foreground">
                        Categoría
                      </th>
                      <th className="px-6 py-4 font-semibold text-foreground">
                        Precio
                      </th>
                      <th className="px-6 py-4 text-right font-semibold text-foreground">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="group transition-colors hover:bg-secondary/10"
                      >
                        <td className="w-24 px-6 py-4">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="h-16 w-16 rounded-xl border border-border object-cover"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <p className="mb-1 text-base font-semibold text-foreground">
                            {product.title}
                          </p>
                          <p className="line-clamp-2 max-w-sm text-sm text-muted-foreground">
                            {product.description}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-block rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary">
                            {categories.find((c) => c.id === product.categoryId)
                              ?.name || "Sin Categoría"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-lg font-semibold text-foreground">
                          ${product.price.toLocaleString("es-CO")}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleOpenModal(product)}
                              className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                              title="Editar"
                            >
                              <Edit className="size-5" />
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `¿Estás seguro de eliminar "${product.title}"?`
                                  )
                                )
                                  deleteProduct(product.id)
                              }}
                              className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                              title="Eliminar"
                            >
                              <Trash2 className="size-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-16 text-center text-muted-foreground"
                        >
                          <p className="text-lg">
                            No hay productos en el catálogo.
                          </p>
                          <button
                            onClick={() => handleOpenModal()}
                            className="mt-2 font-medium text-primary hover:underline"
                          >
                            ¡Agrega el primer producto!
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-secondary/20">
                      <th className="px-6 py-4 font-semibold text-foreground">
                        Imagen
                      </th>
                      <th className="px-6 py-4 font-semibold text-foreground">
                        Nombre
                      </th>
                      <th className="px-6 py-4 font-semibold text-foreground">
                        Descripción
                      </th>
                      <th className="px-6 py-4 text-right font-semibold text-foreground">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {categories.map((category) => (
                      <tr
                        key={category.id}
                        className="group transition-colors hover:bg-secondary/10"
                      >
                        <td className="w-24 px-6 py-4">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-16 w-16 rounded-xl border border-border object-cover"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <p className="mb-1 text-base font-semibold text-foreground">
                            {category.name}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="line-clamp-2 max-w-sm text-sm text-muted-foreground">
                            {category.description}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleOpenCategoryModal(category)}
                              className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                              title="Editar"
                            >
                              <Edit className="size-5" />
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `¿Estás seguro de eliminar "${category.name}"?`
                                  )
                                )
                                  deleteCategory(category.id)
                              }}
                              className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                              title="Eliminar"
                            >
                              <Trash2 className="size-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-16 text-center text-muted-foreground"
                        >
                          <p className="text-lg">
                            No hay categorías en el catálogo.
                          </p>
                          <button
                            onClick={() => handleOpenCategoryModal()}
                            className="mt-2 font-medium text-primary hover:underline"
                          >
                            ¡Agrega la primera categoría!
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-2xl font-bold text-foreground">
                {editingProduct ? "Editar Producto" : "Crear Nuevo Producto"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="custom-scrollbar overflow-y-auto p-6">
              <form
                id="product-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Título del producto
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                    placeholder="Ej. Arreglo Floral Especial"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Descripción
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full resize-none rounded-xl border border-input bg-background p-4 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                    placeholder="Descripción detallada del producto, materiales, tamaños..."
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Precio ($ COP)
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value),
                        })
                      }
                      className="h-12 w-full rounded-xl border border-input bg-background px-4 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Categoría
                    </label>
                    <select
                      required
                      value={formData.categoryId || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      className="h-12 w-full cursor-pointer rounded-xl border border-input bg-background px-4 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                    >
                      <option value="" disabled>
                        Selecciona una categoría
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="text-xs text-destructive">
                        Primero debes crear una categoría.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Imagen (URL)
                  </label>
                  <input
                    required
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {formData.image && (
                    <div className="mt-4 flex items-center gap-4 rounded-xl border border-border bg-secondary/20 p-4">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
                        <img
                          src={formData.image}
                          alt="Previsualización"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // Fallback in case of broken image URL
                            ;(e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1560393464-5c69a73c5770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlcnJvcnxlbnwwfHx8fDE3NzMxODQ2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                          }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Previsualización de la imagen.
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="flex shrink-0 justify-end gap-3 border-t border-border bg-card p-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-xl px-6 py-2.5 font-medium text-muted-foreground transition-colors hover:bg-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="product-form"
                className="rounded-xl bg-primary px-6 py-2.5 font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                {editingProduct ? "Actualizar Producto" : "Guardar Producto"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Category Modal Form */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-2xl font-bold text-foreground">
                {editingCategory ? "Editar Categoría" : "Crear Nueva Categoría"}
              </h2>
              <button
                onClick={handleCloseCategoryModal}
                className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="custom-scrollbar overflow-y-auto p-6">
              <form
                id="category-form"
                onSubmit={handleCategorySubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Nombre de la categoría
                  </label>
                  <input
                    required
                    type="text"
                    value={categoryFormData.name}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        name: e.target.value,
                      })
                    }
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                    placeholder="Ej. Decoraciones Especiales"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Descripción
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={categoryFormData.description}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        description: e.target.value,
                      })
                    }
                    className="w-full resize-none rounded-xl border border-input bg-background p-4 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                    placeholder="Descripción detallada de la categoría..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Imagen (URL)
                  </label>
                  <input
                    required
                    type="url"
                    value={categoryFormData.image}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        image: e.target.value,
                      })
                    }
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {categoryFormData.image && (
                    <div className="mt-4 flex items-center gap-4 rounded-xl border border-border bg-secondary/20 p-4">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
                        <img
                          src={categoryFormData.image}
                          alt="Previsualización"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1560393464-5c69a73c5770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlcnJvcnxlbnwwfHx8fDE3NzMxODQ2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                          }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Previsualización de la imagen.
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="flex shrink-0 justify-end gap-3 border-t border-border bg-card p-6">
              <button
                type="button"
                onClick={handleCloseCategoryModal}
                className="rounded-xl px-6 py-2.5 font-medium text-muted-foreground transition-colors hover:bg-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="category-form"
                className="rounded-xl bg-primary px-6 py-2.5 font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                {editingCategory ? "Actualizar Categoría" : "Guardar Categoría"}
              </button>
            </div>
          </div>
        </div>
      )}
      <SocialFooter />
    </div>
  )
}
