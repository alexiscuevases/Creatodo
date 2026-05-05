import { Instagram, Facebook, Send } from "lucide-react"

export function SocialFooter() {
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/creatodo_",
      color: "hover:text-pink-600",
      handle: "@creatodo_",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/profile.php?id=61552491329182",
      color: "hover:text-blue-600",
      handle: "Creatodo_",
    },
    {
      name: "WhatsApp",
      icon: Send,
      url: "https://wa.me/message/4C4HWHWPQGULI1",
      color: "hover:text-green-600",
      handle: "Escríbenos",
    },
  ]

  return (
    <footer className="border-t border-border bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/15">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-primary">Creatodo</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Creando momentos mágicos con amor y dedicación. Transformamos tus
              ideas en realidad con detalles que perduran en el corazón.
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
                  className={`flex items-center gap-3 text-muted-foreground ${social.color} group transition-colors`}
                >
                  <div className="rounded-full bg-white/80 p-2.5 shadow-sm transition-shadow group-hover:shadow-md">
                    <social.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {social.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {social.handle}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>
              © {new Date().getFullYear()} Creatodo. Todos los derechos
              reservados.
            </p>
            <p className="flex items-center gap-1">
              Hecho con <span className="text-primary">❤</span> desde
              Barranquilla
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
