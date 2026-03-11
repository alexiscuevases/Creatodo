import { useState, useEffect } from 'react';
import type { Category } from '../lib/data';
import { dummyCategories, generateSlug } from '../lib/data';

const STORAGE_KEY = 'creatodo_categories';

// Ensure backward compatibility: add slugs to old categories
const sanitizeCategories = (cats: any[]): Category[] => {
  return cats.map(c => ({
    ...c,
    slug: c.slug || generateSlug(c.name)
  }));
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() => {
    // Intentar leer de localStorage al inicializar
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? sanitizeCategories(parsed) : dummyCategories;
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
