import { useParams, Link } from 'react-router-dom';
import { Hero } from '@/components/Hero';
import { SocialFooter } from '../components/SocialFooter';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { generateSlug } from '../lib/data';
import { ArrowLeft } from 'lucide-react';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useProducts();
  const { categories } = useCategories();

  // Find the category by slug
  const category = categories.find(
    (c) => c.slug === slug || generateSlug(c.name) === slug
  );

  // Filter products by category ID
  const categoryProducts = products.filter(
    (product) => category && product.categoryId === category.id
  );

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-3xl font-bold mb-4">Categoría no encontrada</h1>
        <Link to="/" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <main className="flex-1 flex flex-col py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4">
              <ArrowLeft className="size-4" />
              <span>Volver a Inicio</span>
            </Link>
          </div>

          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-script">{category.name}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>
          
          {categoryProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No hay productos disponibles en esta categoría por el momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {categoryProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
                      {category.name}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 space-y-3">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 pb-2 flex-1">{product.description}</p>
                    <div className="pt-2 border-t border-border mt-auto">
                      <p className="text-lg font-bold text-primary">
                        ${product.price.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <SocialFooter />
    </div>
  );
}
