import { useParams, Link } from 'react-router-dom';
import { SocialFooter } from '../components/SocialFooter';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { ArrowLeft } from 'lucide-react';
import { Hero } from '@/components/Hero';

export function ProductPage() {
  const { id } = useParams();
  const { products } = useProducts();
  const { categories } = useCategories();
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Hero />
        <main className="flex-1 flex items-center justify-center py-20 bg-background">
          <div className="text-center space-y-6 px-4">
            <h1 className="text-4xl font-bold text-foreground">Producto no encontrado</h1>
            <p className="text-muted-foreground">Lo sentimos, no pudimos encontrar el producto que buscas.</p>
            <Link to="/catalog" className="inline-flex items-center justify-center h-12 px-8 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Volver al catálogo
            </Link>
          </div>
        </main>
        <SocialFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <main className="flex-1 flex flex-col py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link to="/catalog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="size-4" />
            <span>Volver al catálogo</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image */}
            <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-border/50">
              <div className="aspect-square relative">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Details */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
                  {categories.find(c => c.id === product.categoryId)?.name || 'Sin Categoría'}
                </div>
                <h1 className="text-4xl md:text-5xl font-medium text-foreground leading-tight font-script">{product.title}</h1>
                <p className="text-3xl font-semibold text-primary">
                  ${product.price.toLocaleString('es-CO')}
                </p>
              </div>
              
              <div className="space-y-6 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground">Descripción del producto</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              <div className="pt-8 flex flex-col sm:flex-row gap-4">
                {/* <button className="flex-1 flex items-center justify-center gap-2 h-14 bg-primary text-primary-foreground rounded-xl font-medium text-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-0.5">
                  <ShoppingCart className="size-5" />
                  Añadir al carrito
                </button> */}
                <button className="flex-1 flex items-center justify-center gap-2 h-14 bg-green-500 text-white rounded-xl font-medium text-lg hover:bg-green-600 transition-all hover:shadow-lg hover:-translate-y-0.5">
                  Comprar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SocialFooter />
    </div>
  );
}
