import { Link } from 'react-router-dom';

export function Header() {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-accent/20 to-secondary/30">
      {/* Decorative elements */}
      <div className="absolute top-0 left-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-[-10%] w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full group-hover:bg-primary/40 transition-all duration-500" />
              <img 
                src={"/logo.png"} 
                alt="Creatodo Logo" 
                className="relative w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl text-primary font-bold">
                creatodo_
              </h1>
              <p className="text-accent-foreground tracking-[0.2em] uppercase text-[10px] md:text-xs">
                Detalles Creativos
              </p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors font-medium">Inicio</Link>
            <Link to="/catalog" className="text-foreground/80 hover:text-primary transition-colors font-medium">Catálogo</Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
