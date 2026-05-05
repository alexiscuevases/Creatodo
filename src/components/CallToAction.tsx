import { MessageCircle, Instagram } from 'lucide-react';
import { buttonVariants } from './ui/button';

const WHATSAPP_URL = 'https://wa.me/573013085567';
const INSTAGRAM_URL = 'https://instagram.com/creatodo_';

export function CallToAction() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-secondary to-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-white">
              ¿Listo para hacer realidad tu idea?
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Cuéntanos qué tienes en mente y crearemos algo especial juntos. 
              Cada proyecto es único y merece toda nuestra atención.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                size: "lg",
                className:
                  "bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 text-lg group",
              })}
            >
              <MessageCircle className="size-5 mr-2 group-hover:scale-110 transition-transform" />
              Contáctanos por WhatsApp
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className:
                  "border-2 border-white text-white hover:bg-white hover:text-primary shadow-lg transition-all duration-300 px-8 py-6 text-lg group",
              })}
            >
              <Instagram className="size-5 mr-2 group-hover:scale-110 transition-transform" />
              Ver Instagram
            </a>
          </div>

          {/* Trust Badge */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Envíos a toda la ciudad</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Atención personalizada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Calidad garantizada</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
