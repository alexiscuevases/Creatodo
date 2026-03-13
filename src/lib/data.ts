export const generateSlug = (text: string): string => {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export interface Category {
  id: string
  name: string
  description: string
  image: string
  accent?: string
  slug?: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  categoryId: string
  image: string
}
