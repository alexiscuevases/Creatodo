import { useState, useEffect } from 'react';
import type { Category } from '../lib/data';
import { dummyCategories } from '../lib/data';

const STORAGE_KEY = 'creatodo_categories';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() => {
    // Intentar leer de localStorage al inicializar
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored categories', e);
      }
    }
    return dummyCategories;
  });

  useEffect(() => {
    // Sincronizar estado entre diferentes pestañas o eventos locales
    const handleStorageChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setCategories(JSON.parse(stored));
        } catch (e) {
          console.error('Error parsing stored categories on update', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('categories-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('categories-updated', handleStorageChange);
    };
  }, []);

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCategories));
    // Disparar evento personalizado para que otras instancias del hook (en la misma ventana) se actualicen reactivamente
    window.dispatchEvent(new Event('categories-updated'));
  };

  const addCategory = (category: Category) => {
    saveCategories([...categories, category]);
  };

  const updateCategory = (updatedCategory: Category) => {
    saveCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };

  const deleteCategory = (id: string) => {
    saveCategories(categories.filter(c => c.id !== id));
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
