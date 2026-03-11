import { useState, useEffect } from 'react';
import type { Product } from '../lib/data';
import { dummyProducts, dummyCategories } from '../lib/data';

const STORAGE_KEY = 'creatodo_products';

const sanitizeProducts = (prods: any[]): Product[] => {
  return prods.map(p => {
    // Si ya tiene categoryId lo devolvemos tal cual
    if (p.categoryId) return p as Product;
    
    // Si sigue usando category en formato viejo, intentamos buscar el id de esa categoría
    const matchedCategory = dummyCategories.find(c => c.name === p.category);
    
    // Removemos la prop vieja category, y agregamos categoryId
    const { category, ...rest } = p;
    return {
      ...rest,
      categoryId: matchedCategory ? matchedCategory.id : dummyCategories[0]?.id || 'cat-1'
    } as Product;
  });
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    // Intentar leer de localStorage al inicializar
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? sanitizeProducts(parsed) : dummyProducts;
      } catch (e) {
        console.error('Error parsing stored products', e);
      }
    }
    return dummyProducts;
  });

  useEffect(() => {
    // Sincronizar estado entre diferentes pestañas o eventos locales
    const handleStorageChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setProducts(JSON.parse(stored));
        } catch (e) {
          console.error('Error parsing stored products on update', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('products-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('products-updated', handleStorageChange);
    };
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
    // Disparar evento personalizado para que otras instancias del hook (en la misma ventana) se actualicen reactivamente
    window.dispatchEvent(new Event('products-updated'));
  };

  const addProduct = (product: Product) => {
    saveProducts([...products, product]);
  };

  const updateProduct = (updatedProduct: Product) => {
    saveProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    saveProducts(products.filter(p => p.id !== id));
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
