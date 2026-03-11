import { ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

import { useCategories } from '../hooks/useCategories';

export function CatalogSection() {
  const { categories } = useCategories();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <Heart className="size-4 text-primary" />
            <span className="text-sm text-primary uppercase tracking-wider">Nuestros Catálogos</span>
          </div>
          <h2 className="text-3xl md:text-4xl text-foreground font-script">
            Descubre nuestras creaciones
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora nuestra selección de productos y servicios, cada uno diseñado con amor y dedicación
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link
              to="/catalog"
              key={category.id}
              className="group relative block bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-primary/40 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-64 md:h-72 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${category.accent || 'from-primary/20 to-secondary/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10`} />
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-end justify-center pb-6">
                  <div className="flex items-center gap-2 text-white">
                    <span className="font-medium">Ver más</span>
                    <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-2">
                <h3 className="text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
