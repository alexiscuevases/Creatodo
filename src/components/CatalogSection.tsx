import { ArrowRight, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Catalog {
  id: string;
  title: string;
  description: string;
  image: string;
  accent: string;
}

const catalogs: Catalog[] = [
  {
    id: '1',
    title: 'Decoraciones',
    description: 'Ambientes únicos para tus eventos especiales',
    image: 'https://images.unsplash.com/photo-1760361571388-1f68e1414332?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWNvcmF0aXZlJTIwaG9tZSUyMGRlY29yJTIwcHVycGxlfGVufDF8fHx8MTc3MzE4NDY2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: '2',
    title: 'Regalos para Mujer',
    description: 'Detalles pensados especialmente para ella',
    image: 'https://images.unsplash.com/photo-1770022056640-a35506f027be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwd29tYW4lMjBqZXdlbHJ5fGVufDF8fHx8MTc3MzE4NDY3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'from-pink-500/20 to-rose-500/20',
  },
  {
    id: '3',
    title: 'Arreglos Florales',
    description: 'Flores frescas que expresan tus sentimientos',
    image: 'https://images.unsplash.com/photo-1645436959707-54c70919340d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG93ZXIlMjBib3VxdWV0JTIwcm9zZXMlMjBhcnJhbmdlbWVudHxlbnwxfHx8fDE3NzMxODQ2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'from-pink-400/20 to-purple-400/20',
  },
  {
    id: '4',
    title: 'Globos y Fiestas',
    description: 'Dale color y alegría a tus celebraciones',
    image: 'https://images.unsplash.com/photo-1771368188458-302d6396c33f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxsb29uJTIwZGVjb3JhdGlvbiUyMHBhcnR5JTIwcHVycGxlJTIwcGlua3xlbnwxfHx8fDE3NzMxODQ2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'from-purple-400/20 to-indigo-400/20',
  },
  {
    id: '5',
    title: 'Postres y Dulces',
    description: 'Endulza tus momentos especiales',
    image: 'https://images.unsplash.com/photo-1465254736783-2af8d0745fca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZSUyMGN1cGNha2UlMjBwaW5rfGVufDF8fHx8MTc3MzE4NDY3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'from-rose-400/20 to-pink-400/20',
  },
  {
    id: '6',
    title: 'Regalos Personalizados',
    description: 'Creaciones únicas con tu toque personal',
    image: 'https://images.unsplash.com/photo-1768726135017-23fe2212868f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjBnaWZ0JTIwd29tYW4lMjBwcmVzZW50fGVufDF8fHx8MTc3MzE4NDY2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'from-purple-500/20 to-fuchsia-500/20',
  },
];

export function CatalogSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <Heart className="size-4 text-primary" />
            <span className="text-sm text-primary uppercase tracking-wider">Nuestros Catálogos</span>
          </div>
          <h2 className="text-3xl md:text-4xl text-foreground">
            Descubre Nuestras Creaciones
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora nuestra selección de productos y servicios, cada uno diseñado con amor y dedicación
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {catalogs.map((catalog) => (
            <div
              key={catalog.id}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-primary/40 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-64 md:h-72 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${catalog.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10`} />
                <ImageWithFallback
                  src={catalog.image}
                  alt={catalog.title}
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
                  {catalog.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {catalog.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
