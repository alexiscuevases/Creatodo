import { Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/30">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full group-hover:bg-primary/40 transition-all duration-500" />
              <img 
                src={"/logo.png"} 
                alt="Creatodo Logo" 
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Brand Name */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="size-6 text-primary animate-pulse" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-primary">
                creatodo_
              </h1>
              <Sparkles className="size-6 text-primary animate-pulse" />
            </div>
            <p className="text-accent-foreground tracking-[0.3em] uppercase text-xs md:text-sm">
              Detalles Creativos
            </p>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
              Transformamos tus momentos especiales en recuerdos inolvidables
            </p>
            <p className="text-base text-muted-foreground">
              Especializados en decoraciones únicas, regalos personalizados y arreglos florales que expresan amor y creatividad. 
              Cada detalle cuenta una historia, cada creación lleva nuestro corazón.
            </p>
          </div>

          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-foreground/70">Barranquilla, Colombia</span>
          </div>
        </div>
      </div>
    </div>
  );
}
