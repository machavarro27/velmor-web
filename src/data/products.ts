import type { Product, Testimonial } from '@/types';

export const products: Product[] = [
  // 1. Skyr Fresa Artesanal 200g ($7.000) -> small-fresa.jpg
  {
    id: 'skyr-fresa-200',
    name: 'Skyr Fresa Artesanal 200g',
    nameEn: 'Artisanal Strawberry Skyr 200g',
    flavor: 'fresa',
    size: '200g',
    price: 7000,
    description:
      'Yogur cremoso con fresas seleccionadas del Eje Cafetero, alto en proteína y bajo en grasa. Presentación personal de 200g.',
    descriptionEn:
      'Creamy yogurt crafted with selected Coffee Region strawberries, high in protein and low in fat. 200g personal presentation.',
    image: '/images/small-fresa.jpg',
    badge: 'Popular',
    badgeEn: 'Popular',
    nutrition: {
      calories: 110,
      protein: 15,
      carbs: 8,
      fat: 0.5,
      calcium: 180,
    },
    stock: 25,
    rating: 4.9,
    reviews: 128,
    featured: true,
  },

  // 2. Skyr Fresa Artesanal 500g ($26.000) -> fresa.jpeg
  {
    id: 'skyr-fresa-500',
    name: 'Skyr Fresa Artesanal 500g',
    nameEn: 'Artisanal Strawberry Skyr 500g',
    flavor: 'fresa',
    size: '500g',
    price: 26000,
    description:
      'Yogur cremoso con fresas seleccionadas, alto en proteína y bajo en grasa. Envase grande de 500g ideal para compartir en casa.',
    descriptionEn:
      'Creamy yogurt crafted with selected strawberries, high in protein and low in fat. Large 500g container ideal for sharing at home.',
    image: '/images/fresa.jpeg',
    nutrition: {
      calories: 275,
      protein: 37.5,
      carbs: 20,
      fat: 1.2,
      calcium: 450,
    },
    stock: 18,
    rating: 4.9,
    reviews: 95,
    featured: true,
  },

  // 3. Skyr Mora Silvestre 200g ($7.000) -> small-mora.jpg
  {
    id: 'skyr-mora-200',
    name: 'Skyr Mora Silvestre 200g',
    nameEn: 'Wild Blackberry Skyr 200g',
    flavor: 'mora',
    size: '200g',
    price: 7000,
    description:
      'Rico en antioxidantes y elaborado con moras seleccionadas de las montañas del Eje Cafetero. Presentación pequeña de 200g.',
    descriptionEn:
      'Rich in antioxidants and crafted with selected wild Coffee Region blackberries. Small 200g presentation.',
    image: '/images/small-mora.jpg',
    badge: 'Premium',
    badgeEn: 'Premium',
    nutrition: {
      calories: 115,
      protein: 14.5,
      carbs: 9,
      fat: 0.5,
      calcium: 175,
    },
    stock: 22,
    rating: 4.8,
    reviews: 118,
    featured: true,
  },

  // 4. Skyr Mango Tropical 500g ($26.000) -> mango.jpeg
  {
    id: 'skyr-mango-500',
    name: 'Skyr Mango Tropical 500g',
    nameEn: 'Tropical Mango Skyr 500g',
    flavor: 'mango',
    size: '500g',
    price: 26000,
    description:
      'Dulzura natural de mangos madurados al sol con la textura densa del auténtico Skyr nórdico. Presentación grande de 500g.',
    descriptionEn:
      'Natural sweetness of sun-ripened mangoes blended with thick authentic Nordic Skyr. Large 500g presentation.',
    image: '/images/mango.jpeg',
    nutrition: {
      calories: 280,
      protein: 37,
      carbs: 21,
      fat: 1.0,
      calcium: 460,
    },
    stock: 15,
    rating: 4.8,
    reviews: 74,
    featured: true,
  },

  // 5. Skyr Mango Tropical 200g ($7.000) -> small-mango.jpg
  {
    id: 'skyr-mango-200',
    name: 'Skyr Mango Tropical 200g',
    nameEn: 'Tropical Mango Skyr 200g',
    flavor: 'mango',
    size: '200g',
    price: 7000,
    description:
      'Dulce y cremoso Skyr de mango elaborado con fruta fresca colombiana. Envase personal de 200g listo para disfrutar.',
    descriptionEn:
      'Sweet and creamy mango Skyr crafted with fresh Colombian fruit. Personal 200g tub ready to enjoy.',
    image: '/images/small-mango.jpg',
    badge: 'Nuevo',
    badgeEn: 'New',
    nutrition: {
      calories: 112,
      protein: 14.8,
      carbs: 8.5,
      fat: 0.4,
      calcium: 185,
    },
    stock: 20,
    rating: 4.9,
    reviews: 98,
  },

  // 6. Skyr Maracuyá Tropical 500g ($26.000) -> maracuya.jpeg
  {
    id: 'skyr-maracuya-500',
    name: 'Skyr Maracuyá Tropical 500g',
    nameEn: 'Tropical Passion Fruit Skyr 500g',
    flavor: 'maracuya',
    size: '500g',
    price: 26000,
    description:
      'El exótico sabor cítrico del maracuyá colombiano en presentación familiar de 500g. Sin conservantes ni azúcares añadidos.',
    descriptionEn:
      'The exotic citrus flavor of Colombian passion fruit in a 500g family presentation. No preservatives or added sugars.',
    image: '/images/maracuya.jpeg',
    nutrition: {
      calories: 270,
      protein: 37.5,
      carbs: 19.5,
      fat: 1.0,
      calcium: 465,
    },
    stock: 14,
    rating: 4.9,
    reviews: 83,
  },

  // 7. Skyr Maracuyá Tropical 200g ($7.000) -> small-maracuya.jpg
  {
    id: 'skyr-maracuya-200',
    name: 'Skyr Maracuyá Tropical 200g',
    nameEn: 'Tropical Passion Fruit Skyr 200g',
    flavor: 'maracuya',
    size: '200g',
    price: 7000,
    description:
      'Fusión refrescante entre la tradición nórdica del Skyr y pulpa natural de maracuyá. Presentación pequeña de 200g.',
    descriptionEn:
      'Refreshing fusion of Nordic Skyr tradition and natural passion fruit pulp. Small 200g presentation.',
    image: '/images/small-maracuya.jpg',
    badge: 'Exótico',
    badgeEn: 'Exotic',
    nutrition: {
      calories: 108,
      protein: 15.0,
      carbs: 8.0,
      fat: 0.4,
      calcium: 185,
    },
    stock: 22,
    rating: 4.8,
    reviews: 112,
  },

  // 8. Skyr Natural Clásico 500g ($26.000) -> natural.jpeg
  {
    id: 'skyr-natural-500',
    name: 'Skyr Natural Clásico 500g',
    nameEn: 'Classic Natural Skyr 500g',
    flavor: 'natural',
    size: '500g',
    price: 26000,
    description:
      'El clásico sabor natural artesanal en presentación grande de 500g. La base proteica perfecta para tus desayunos y recetas.',
    descriptionEn:
      'Classic artisanal natural flavor in a large 500g container. The perfect protein base for your breakfasts and recipes.',
    image: '/images/natural.jpeg',
    nutrition: {
      calories: 245,
      protein: 40.0,
      carbs: 13.5,
      fat: 0.5,
      calcium: 500,
    },
    stock: 19,
    rating: 5.0,
    reviews: 145,
    featured: true,
  },

  // 9. Skyr Natural Clásico 200g ($7.000) -> small-natural.jpg
  {
    id: 'skyr-natural-200',
    name: 'Skyr Natural Clásico 200g',
    nameEn: 'Classic Natural Skyr 200g',
    flavor: 'natural',
    size: '200g',
    price: 7000,
    description:
      'La receta islandesa más pura: leche fresca del Eje Cafetero y cultivos probióticos vivos en presentación personal de 200g.',
    descriptionEn:
      'The purest Icelandic recipe: fresh milk from the Coffee Region and live probiotic cultures in a 200g personal presentation.',
    image: '/images/small-natural.jpg',
    badge: 'Clásico',
    badgeEn: 'Classic',
    nutrition: {
      calories: 98,
      protein: 16.0,
      carbs: 5.5,
      fat: 0.2,
      calcium: 200,
    },
    stock: 28,
    rating: 5.0,
    reviews: 203,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'María Fernanda Gómez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    comment:
      'El Skyr de fresa de Velmor cambió mis desayunos por completo. Es increíblemente cremoso, me mantiene saciada toda la mañana y el sabor a fruta real del Eje Cafetero se nota desde la primera cucharada.',
    commentEn:
      'Velmor’s strawberry Skyr completely transformed my breakfasts. It is incredibly creamy, keeps me full all morning, and you can taste the real Coffee Region fruit from the very first spoonful.',
    date: '2025-02-15',
    verified: true,
    product: 'Skyr Fresa Artesanal 500g',
  },
  {
    id: '2',
    name: 'Carlos Andrés Rodríguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    comment:
      'Como deportista en Dosquebradas buscaba una fuente de proteína limpia y natural. El Skyr Natural de 500g es sencillamente brutal: 16g de proteína por porción y una textura artesanal inigualable.',
    commentEn:
      'As an athlete training in Dosquebradas, I was looking for a clean, natural protein source. The 500g Natural Skyr is simply unbeatable: 16g of protein per serving and unmatched artisanal texture.',
    date: '2025-02-10',
    verified: true,
    product: 'Skyr Natural Clásico 500g',
  },
  {
    id: '3',
    name: 'Laura Valentina Martínez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    comment:
      'Me encanta que usen leche fresca de las montañas del Eje Cafetero. Mis hijos aman el de mango y el de mora de 200g para la lonchera, y yo estoy tranquila porque es 100% natural.',
    commentEn:
      'I love that they use fresh milk from the Coffee Region mountains. My kids adore the 200g mango and blackberry tubs for their lunchbox, and I have peace of mind knowing it is 100% natural.',
    date: '2025-02-05',
    verified: true,
    product: 'Skyr Mora Silvestre 200g',
  },
  {
    id: '4',
    name: 'Alejandro Torres',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    comment:
      'Viví en Islandia dos años y pensé que nunca volvería a probar un Skyr auténtico en Colombia. Velmor logró exactamente esa textura densa y aterciopelada en Dosquebradas. ¡El de maracuyá de 500g es espectacular!',
    commentEn:
      'I lived in Iceland for two years and thought I would never taste authentic Skyr in Colombia again. Velmor achieved that exact dense, velvety texture in Dosquebradas. The 500g passion fruit flavor is spectacular!',
    date: '2025-01-28',
    verified: true,
    product: 'Skyr Maracuyá Tropical 500g',
  },
  {
    id: '5',
    name: 'Diana Carolina Pérez',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    comment:
      'La atención por WhatsApp es súper rápida y organizada, y el pedido llega frío y perfecto a casa en Dosquebradas en menos de 24 horas. El de mango con granola es mi postre favorito.',
    commentEn:
      'Customer service on WhatsApp is super fast and organized, and the order arrives cold and in perfect condition in Dosquebradas in under 24 hours. Mango Skyr with granola is my favorite dessert.',
    date: '2025-01-20',
    verified: true,
    product: 'Skyr Mango Tropical 500g',
  },
  {
    id: '6',
    name: 'Santiago Morales',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    comment:
      'Calidad 10/10. Se siente el trabajo artesanal y el respeto por los ingredientes del campo del Eje Cafetero. El descuento de primera compra con VELMOR10 funcionó perfecto.',
    commentEn:
      '10/10 quality. You can truly taste the artisanal craftsmanship and respect for local Coffee Region ingredients. The first-order discount with VELMOR10 worked seamlessly.',
    date: '2025-01-15',
    verified: true,
    product: 'Skyr Fresa Artesanal 500g',
  },
];

export const flavorColors: Record<
  string,
  { bg: string; text: string; accent: string; borderBottom: string; badgeBg: string }
> = {
  fresa: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    accent: 'border-rose-300',
    borderBottom: 'border-b-pink-500',
    badgeBg: 'bg-pink-500',
  },
  mora: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    accent: 'border-purple-300',
    borderBottom: 'border-b-purple-600',
    badgeBg: 'bg-purple-600',
  },
  mango: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    accent: 'border-amber-300',
    borderBottom: 'border-b-amber-500',
    badgeBg: 'bg-amber-500',
  },
  maracuya: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    accent: 'border-yellow-300',
    borderBottom: 'border-b-yellow-500',
    badgeBg: 'bg-yellow-500',
  },
  natural: {
    bg: 'bg-sky-50',
    text: 'text-sky-800',
    accent: 'border-sky-300',
    borderBottom: 'border-b-sky-600',
    badgeBg: 'bg-sky-600',
  },
};

export const sizeLabels: Record<string, string> = {
  '200g': 'Pequeño (200g)',
  '500g': 'Familiar (500g)',
};

export const sizeLabelsEn: Record<string, string> = {
  '200g': 'Small (200g)',
  '500g': 'Family (500g)',
};

export const flavorLabels: Record<string, string> = {
  fresa: 'Fresa',
  mora: 'Mora',
  mango: 'Mango',
  maracuya: 'Maracuyá',
  natural: 'Natural',
};

export const flavorLabelsEn: Record<string, string> = {
  fresa: 'Strawberry',
  mora: 'Blackberry',
  mango: 'Mango',
  maracuya: 'Passion Fruit',
  natural: 'Natural',
};

export function getLocalizedProductName(product: Product, lang: string): string {
  return lang?.startsWith('en') && product.nameEn ? product.nameEn : product.name;
}

export function getLocalizedProductDesc(product: Product, lang: string): string {
  return lang?.startsWith('en') && product.descriptionEn ? product.descriptionEn : product.description;
}

export function getLocalizedFlavor(flavor: string, lang: string): string {
  return lang?.startsWith('en') ? (flavorLabelsEn[flavor] || flavor) : (flavorLabels[flavor] || flavor);
}

export function getLocalizedSize(size: string, lang: string): string {
  return lang?.startsWith('en') ? (sizeLabelsEn[size] || size) : (sizeLabels[size] || size);
}
