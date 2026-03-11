import { Instagram, Facebook, Send, Phone, Mail, MapPin } from 'lucide-react';

export function SocialFooter() {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/creatodo_',
      color: 'hover:text-pink-600',
      handle: '@creatodo_',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: '#',
      color: 'hover:text-blue-600',
      handle: 'Creatodo',
    },
    {
      name: 'WhatsApp',
      icon: Send,
      url: '#',
      color: 'hover:text-green-600',
      handle: 'Escríbenos',
    },
  ];

  const contactInfo = [
    {
      icon: Phone,
      text: '+57 300 123 4567',
      href: 'tel:+573001234567',
    },
    {
      icon: Mail,
      text: 'info@creatodo.com',
      href: 'mailto:info@creatodo.com',
    },
    {
      icon: MapPin,
      text: 'Barranquilla, Colombia',
      href: '#',
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/15 border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-primary">Creatodo</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Creando momentos mágicos con amor y dedicación. 
              Transformamos tus ideas en realidad con detalles que perduran en el corazón.
            </p>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <h4 className="text-foreground">Síguenos</h4>
            <div className="space-y-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 text-muted-foreground ${social.color} transition-colors group`}
                >
                  <div className="bg-white/80 p-2.5 rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                    <social.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{social.name}</p>
                    <p className="text-xs text-muted-foreground">{social.handle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-foreground">Contacto</h4>
            <div className="space-y-3">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="bg-secondary/50 p-2.5 rounded-full group-hover:bg-secondary transition-colors">
                    <info.icon className="size-4 text-primary" />
                  </div>
                  <span className="text-sm">{info.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Creatodo. Todos los derechos reservados.
            </p>
            <p className="flex items-center gap-1">
              Hecho con <span className="text-primary">❤</span> desde Barranquilla
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
