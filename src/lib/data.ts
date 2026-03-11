export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  accent?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export const dummyCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Decoraciones',
    description: 'Ambientes únicos para tus eventos especiales',
    image: 'https://images.unsplash.com/photo-1760361571388-1f68e1414332?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWNvcmF0aXZlJTIwaG9tZSUyMGRlY29yJTIwcHVycGxlfGVufDF8fHx8MTc3MzE4NDY2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 'cat-2',
    name: 'Regalos para Mujer',
    description: 'Detalles pensados especialmente para ella',
    image: 'https://images.unsplash.com/photo-1770022056640-a35506f027be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwd29tYW4lMjBqZXdlbHJ5fGVufDF8fHx8MTc3MzE4NDY3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'from-pink-500/20 to-rose-500/20',
  },
  {
    id: 'cat-3',
    name: 'Arreglos Florales',
    description: 'Flores frescas que expresan tus sentimientos',
    image: 'https://images.unsplash.com/photo-1645436959707-54c70919340d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG93ZXIlMjBib3VxdWV0JTIwcm9zZXMlMjBhcnJhbmdlbWVudHxlbnwxfHx8fDE3NzMxODQ2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'from-pink-400/20 to-purple-400/20',
  },
  {
    id: 'cat-4',
    name: 'Globos y Fiestas',
    description: 'Dale color y alegría a tus celebraciones',
    image: 'https://images.unsplash.com/photo-1771368188458-302d6396c33f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxsb29uJTIwZGVjb3JhdGlvbiUyMHBhcnR5JTIwcHVycGxlJTIwcGlua3xlbnwxfHx8fDE3NzMxODQ2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'from-purple-400/20 to-indigo-400/20',
  },
  {
    id: 'cat-5',
    name: 'Postres y Dulces',
    description: 'Endulza tus momentos especiales',
    image: 'https://images.unsplash.com/photo-1465254736783-2af8d0745fca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZSUyMGN1cGNha2UlMjBwaW5rfGVufDF8fHx8MTc3MzE4NDY3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'from-rose-400/20 to-pink-400/20',
  },
  {
    id: 'cat-6',
    name: 'Regalos Personalizados',
    description: 'Creaciones únicas con tu toque personal',
    image: 'https://images.unsplash.com/photo-1768726135017-23fe2212868f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjBnaWZ0JTIwd29tYW4lMjBwcmVzZW50fGVufDF8fHx8MTc3MzE4NDY2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    accent: 'from-purple-500/20 to-fuchsia-500/20',
  },
];

  export const dummyProducts: Product[] = [
    {
      id: 'prod-1',
      title: 'Arreglo Floral "Amor Eterno"',
      description: 'Hermoso arreglo de rosas rojas con follaje premium en base de cerámica decorativa, perfecto para aniversarios o declarar tu amor.',
      price: 120000,
      category: 'Arreglos Florales',
      image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjByb3NlcyUyMGJvdXF1ZXR8ZW58MHx8fHwxNzEzOTM5NTU4fDA&ixlib=rb-4.0.3&q=80&w=1080',
    },
    {
      id: 'prod-2',
      title: 'Caja Regalo "Spa Relax"',
      description: 'Caja de madera personalizada que incluye sales de baño, jabones artesanales, vela aromática y toalla bordada para un momento de relajación.',
      price: 85000,
      category: 'Regalos para Mujer',
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBnaWZ0JTIwYm94fGVufDB8fHx8MTcxMzkzOTU1OHww&ixlib=rb-4.0.3&q=80&w=1080',
    },
    {
      id: 'prod-3',
      title: 'Desayuno Sorpresa "Feliz Día"',
      description: 'El detalle ideal para empezar la mañana. Incluye jugo natural, sándwich gourmet, fruta, postre y taza personalizada, todo en guacal de madera decorado.',
      price: 95000,
      category: 'Regalos Personalizados',
      image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY3J1bXB0aW91cyUyMGJyZWFrZmFzdHxlbnwwfHx8fDE3MTM5Mzk1NTh8MA&ixlib=rb-4.0.3&q=80&w=1080',
    },
    {
      id: 'prod-4',
      title: 'Decoración "Fiesta Neón"',
      description: 'Set completo de globos, luces UV y accesorios brillantes para transformar cualquier espacio en una fiesta inolvidable.',
      price: 250000,
      category: 'Decoraciones',
      image: 'https://images.unsplash.com/photo-1516997187425-a130f14d9b23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwcGFydHklMjBsaWdodHN8ZW58MHx8fHwxNzEzOTM5NTU4fDA&ixlib=rb-4.0.3&q=80&w=1080',
    },
    {
      id: 'prod-5',
      title: 'Bouquet de Globos "Cumpleaños Feliz"',
      description: 'Arreglo espectacular de globos inflados con helio, número gigante metalizado y globos de látex en tonos pastel.',
      price: 70000,
      category: 'Globos y Fiestas',
      image: 'https://images.unsplash.com/photo-1530103862676-de8892bc957f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxsb29ucyUyMGJvdXF1ZXR8ZW58MHx8fHwxNzEzOTM5NTU4fDA&ixlib=rb-4.0.3&q=80&w=1080',
    },
    {
      id: 'prod-6',
      title: 'Caja Dulce "Antojo Extremo"',
      description: 'Selección de los mejores chocolates, gomitas y galletas artesanales empacados en una hermosa caja con lazo y tarjeta.',
      price: 55000,
      category: 'Postres y Dulces',
      image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGVzJTIwYm94fGVufDB8fHx8MTcxMzkzOTU1OHww&ixlib=rb-4.0.3&q=80&w=1080',
    },
    {
      id: 'prod-7',
      title: 'Mug Mágico Personalizado',
      description: 'Taza de cerámica que revela tu foto o frase favorita al verter líquido caliente. Un regalo divertido y sorprendente.',
      price: 35000,
      category: 'Regalos Personalizados',
      image: 'https://images.unsplash.com/photo-1519636254060-1e56a7cdd922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtdWd8ZW58MHx8fHwxNzEzOTM5NTU4fDA&ixlib=rb-4.0.3&q=80&w=1080',
    },
    {
      id: 'prod-8',
      title: 'Arreglo "Girasoles del Campo"',
      description: 'Radiante arreglo con girasoles, follaje verde y base rústica de madera, ideal para alegrar el día de alguien especial.',
      price: 90000,
      category: 'Arreglos Florales',
      image: 'https://images.unsplash.com/photo-1521198558485-6184aa143e57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5mbG93ZXIlMjBib3VxdWV0fGVufDB8fHx8MTcxMzkzOTU1OHww&ixlib=rb-4.0.3&q=80&w=1080',
    }
  ];
