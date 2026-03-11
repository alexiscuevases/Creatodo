import { useState, useEffect } from 'react';
import type { Product } from '../lib/data';
import { dummyProducts } from '../lib/data';

const STORAGE_KEY = 'creatodo_products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    // Intentar leer de localStorage al inicializar
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
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

  // Extraer categorías únicas de forma dinámica de todos los productos
  const categories = Array.from(new Set(products.map(p => p.category)));

  return {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
