import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { SocialFooter } from '../components/SocialFooter';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import type { Product, Category } from '../lib/data';
import { Plus, Edit, Trash2, X, Package, FolderTree } from 'lucide-react';

export function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({});

  const handleOpenModal = (product?: Product) => {
    // Set form data based on editing product or empty defaults
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        id: `prod-${Date.now()}`,
        title: '',
        description: '',
        price: 0,
        categoryId: categories.length > 0 ? categories[0].id : '',
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(formData as Product);
    } else {
      addProduct(formData as Product);
    }
    handleCloseModal();
  };

  const handleOpenCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryFormData(category);
    } else {
      setEditingCategory(null);
      setCategoryFormData({
        id: `cat-${Date.now()}`,
        name: '',
        description: '',
        image: ''
      });
    }
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryFormData({});
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(categoryFormData as Category);
    } else {
      addCategory(categoryFormData as Category);
    }
    handleCloseCategoryModal();
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <main className="flex-1 flex flex-col py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Administración</h1>
              <p className="text-muted-foreground mt-2">Gestiona el catálogo de productos y categorías de forma centralizada.</p>
            </div>
            <button 
              onClick={() => activeTab === 'products' ? handleOpenModal() : handleOpenCategoryModal()}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all hover:scale-105 shrink-0"
            >
              <Plus className="size-5" />
              {activeTab === 'products' ? 'Nuevo Producto' : 'Nueva Categoría'}
            </button>
          </div>

          <div className="flex bg-secondary/30 p-1 rounded-xl w-full sm:w-fit mb-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'products' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
            >
              <Package className="size-4" />
              Productos
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'categories' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
            >
              <FolderTree className="size-4" />
              Categorías
            </button>
          </div>

          {activeTab === 'products' ? (
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/20">
                    <th className="py-4 px-6 font-semibold text-foreground">Imagen</th>
                    <th className="py-4 px-6 font-semibold text-foreground">Nombre / Descripción</th>
                    <th className="py-4 px-6 font-semibold text-foreground">Categoría</th>
                    <th className="py-4 px-6 font-semibold text-foreground">Precio</th>
                    <th className="py-4 px-6 font-semibold text-foreground text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map(product => (
                    <tr key={product.id} className="group hover:bg-secondary/10 transition-colors">
                      <td className="py-4 px-6 w-24">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="w-16 h-16 object-cover rounded-xl border border-border" 
                        />
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-foreground text-base mb-1">{product.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-sm">{product.description}</p>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className="bg-primary/10 text-primary font-medium px-3 py-1.5 rounded-full inline-block">
                          {categories.find(c => c.id === product.categoryId)?.name || 'Sin Categoría'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-lg text-foreground">
                        ${product.price.toLocaleString('es-CO')}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => handleOpenModal(product)} 
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all rounded-lg"
                            title="Editar"
                          >
                            <Edit className="size-5" />
                          </button>
                          <button 
                            onClick={() => { if(confirm(`¿Estás seguro de eliminar "${product.title}"?`)) deleteProduct(product.id) }} 
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg"
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
                      <td colSpan={5} className="py-16 text-center text-muted-foreground">
                        <p className="text-lg">No hay productos en el catálogo.</p>
                        <button 
                          onClick={() => handleOpenModal()} 
                          className="text-primary hover:underline mt-2 font-medium"
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
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-secondary/20">
                      <th className="py-4 px-6 font-semibold text-foreground">Imagen</th>
                      <th className="py-4 px-6 font-semibold text-foreground">Nombre</th>
                      <th className="py-4 px-6 font-semibold text-foreground">Descripción</th>
                      <th className="py-4 px-6 font-semibold text-foreground text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {categories.map(category => (
                      <tr key={category.id} className="group hover:bg-secondary/10 transition-colors">
                        <td className="py-4 px-6 w-24">
                          <img 
                            src={category.image} 
                            alt={category.name} 
                            className="w-16 h-16 object-cover rounded-xl border border-border" 
                          />
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-semibold text-foreground text-base mb-1">{category.name}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm text-muted-foreground line-clamp-2 max-w-sm">{category.description}</p>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => handleOpenCategoryModal(category)} 
                              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all rounded-lg"
                              title="Editar"
                            >
                              <Edit className="size-5" />
                            </button>
                            <button 
                              onClick={() => { if(confirm(`¿Estás seguro de eliminar "${category.name}"?`)) deleteCategory(category.id) }} 
                              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg"
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
                        <td colSpan={4} className="py-16 text-center text-muted-foreground">
                          <p className="text-lg">No hay categorías en el catálogo.</p>
                          <button 
                            onClick={() => handleOpenCategoryModal()} 
                            className="text-primary hover:underline mt-2 font-medium"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h2>
              <button 
                onClick={handleCloseModal} 
                className="text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors p-2 rounded-xl"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Título del producto</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Ej. Arreglo Floral Especial"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Descripción</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                    placeholder="Descripción detallada del producto, materiales, tamaños..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Precio ($ COP)</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Categoría</label>
                    <select
                      required
                      value={formData.categoryId || ''}
                      onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                    >
                      <option value="" disabled>Selecciona una categoría</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="text-xs text-destructive">Primero debes crear una categoría.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Imagen (URL)</label>
                  <input
                    required
                    type="url"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {formData.image && (
                    <div className="mt-4 flex items-center gap-4 p-4 border border-border rounded-xl bg-secondary/20">
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-border shrink-0 bg-background">
                        <img 
                          src={formData.image} 
                          alt="Previsualización" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            // Fallback in case of broken image URL
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlcnJvcnxlbnwwfHx8fDE3NzMxODQ2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080';
                          }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">Previsualización de la imagen.</p>
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-border bg-card flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-secondary transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="product-form"
                className="px-6 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                {editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Category Modal Form */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">
                {editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
              </h2>
              <button 
                onClick={handleCloseCategoryModal} 
                className="text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors p-2 rounded-xl"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="category-form" onSubmit={handleCategorySubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Nombre de la categoría</label>
                  <input
                    required
                    type="text"
                    value={categoryFormData.name}
                    onChange={e => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Ej. Decoraciones Especiales"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Descripción</label>
                  <textarea
                    required
                    rows={4}
                    value={categoryFormData.description}
                    onChange={e => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                    className="w-full p-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                    placeholder="Descripción detallada de la categoría..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Imagen (URL)</label>
                  <input
                    required
                    type="url"
                    value={categoryFormData.image}
                    onChange={e => setCategoryFormData({ ...categoryFormData, image: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {categoryFormData.image && (
                    <div className="mt-4 flex items-center gap-4 p-4 border border-border rounded-xl bg-secondary/20">
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-border shrink-0 bg-background">
                        <img 
                          src={categoryFormData.image} 
                          alt="Previsualización" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlcnJvcnxlbnwwfHx8fDE3NzMxODQ2Njl8MA&ixlib=rb-4.1.0&q=80&w=1080';
                          }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">Previsualización de la imagen.</p>
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-border bg-card flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={handleCloseCategoryModal}
                className="px-6 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-secondary transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="category-form"
                className="px-6 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                {editingCategory ? 'Actualizar Categoría' : 'Guardar Categoría'}
              </button>
            </div>
          </div>
        </div>
      )}
      <SocialFooter />
    </div>
  );
}
