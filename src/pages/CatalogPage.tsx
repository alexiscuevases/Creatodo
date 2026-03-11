import { Header } from '../components/Header';
import { SocialFooter } from '../components/SocialFooter';
import { dummyProducts } from '../lib/data';
import { Link } from 'react-router-dom';

export function CatalogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Catálogo Completo</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explora todos nuestros productos disponibles y encuentra el regalo perfecto.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {dummyProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
                    {product.category}
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
        </div>
      </main>
      <SocialFooter />
    </div>
  );
}
