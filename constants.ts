import { Product } from './types';

export const PRODUCTS: Product[] = [
  // Home Decor
  {
    id: 'hd-1',
    name: 'Minimalist Ceramic Vase',
    description: 'Hand-crafted ceramic vase with a matte finish. Perfect for dried flowers.',
    price: 4500.00,
    originalPrice: 5500.00,
    category: 'Home Decor',
    image: 'https://picsum.photos/400/500?random=1',
    isFeatured: true,
    colors: ['#E5E7EB', '#000000', '#D1D5DB'],
    reviews: [
      { id: 'r1', userName: 'Sarah K.', rating: 5, comment: 'Absolutely beautiful vase! Fits perfectly with my minimal decor.', date: '2024-03-15' },
      { id: 'r2', userName: 'Mike R.', rating: 4, comment: 'Great quality, but slightly smaller than expected.', date: '2024-03-10' }
    ],
    rating: 4.5
  },
  {
    id: 'hd-2',
    name: 'Boho Macrame Wall Hanging',
    description: 'Intricate cotton macrame piece to add texture to your living space.',
    price: 3250.00,
    category: 'Home Decor',
    image: 'https://picsum.photos/400/500?random=2',
    isFeatured: false,
    rating: 4.8
  },
  {
    id: 'hd-3',
    name: 'Scented Soy Candle - Lavender',
    description: 'Eco-friendly soy wax candle with a calming lavender scent.',
    price: 1800.00,
    category: 'Home Decor',
    image: 'https://picsum.photos/400/500?random=3',
    isFeatured: true,
    sizes: ['Small (4oz)', 'Large (8oz)'],
    rating: 5.0
  },
  {
    id: 'hd-4',
    name: 'Velvet Throw Pillow',
    description: 'Luxuriously soft velvet pillow cover in dusty rose.',
    price: 2400.00,
    originalPrice: 3000.00,
    category: 'Home Decor',
    image: 'https://picsum.photos/400/500?random=4',
    isFeatured: false,
    colors: ['#FECDD3', '#1F2937', '#D1FAE5'],
    rating: 4.2
  },

  // Stationery
  {
    id: 'st-1',
    name: 'Marble Hardcover Journal',
    description: 'Premium 120gsm paper journal with a gold-foiled marble cover.',
    price: 2200.00,
    category: 'Stationery',
    image: 'https://picsum.photos/400/500?random=5',
    isFeatured: false,
    rating: 4.7
  },
  {
    id: 'st-2',
    name: 'Pastel Gel Pen Set',
    description: 'Set of 6 smooth-writing gel pens in aesthetic pastel shades.',
    price: 1200.00,
    category: 'Stationery',
    image: 'https://picsum.photos/400/500?random=6',
    isFeatured: true,
    colors: ['#F9A8D4', '#93C5FD', '#C4B5FD'],
    rating: 4.6
  },
  {
    id: 'st-3',
    name: 'Weekly Desk Planner',
    description: 'Undated weekly planner pad to keep your tasks organized.',
    price: 1500.00,
    category: 'Stationery',
    image: 'https://picsum.photos/400/500?random=7',
    isFeatured: false,
    rating: 4.3
  },

  // Ornaments
  {
    id: 'or-1',
    name: 'Gold Plated Layered Necklace',
    description: 'Delicate double-layered necklace with a celestial pendant.',
    price: 3800.00,
    originalPrice: 5000.00,
    category: 'Ornaments',
    image: 'https://picsum.photos/400/500?random=8',
    isFeatured: true,
    rating: 4.9,
    reviews: [
      { id: 'r3', userName: 'Emily T.', rating: 5, comment: 'Stunning piece! I wear it every day.', date: '2024-02-28' }
    ]
  },
  {
    id: 'or-2',
    name: 'Pearl Drop Earrings',
    description: 'Classic freshwater pearl earrings with sterling silver hooks.',
    price: 2800.00,
    category: 'Ornaments',
    image: 'https://picsum.photos/400/500?random=9',
    isFeatured: false,
    rating: 4.8
  },
  {
    id: 'or-3',
    name: 'Rose Quartz Bracelet',
    description: 'Beaded bracelet made with genuine rose quartz stones.',
    price: 2000.00,
    category: 'Ornaments',
    image: 'https://picsum.photos/400/500?random=10',
    isFeatured: false,
    rating: 4.5
  },

  // Makeup
  {
    id: 'mk-1',
    name: 'Matte Liquid Lipstick',
    description: 'Long-lasting matte lipstick in a deep berry shade.',
    price: 1600.00,
    category: 'Makeup',
    image: 'https://picsum.photos/400/500?random=11',
    isFeatured: false,
    colors: ['#9F1239', '#BE123C', '#E11D48'],
    rating: 4.4
  },
  {
    id: 'mk-2',
    name: 'Highlighter Palette',
    description: 'Triple-shade palette for a radiant, natural glow.',
    price: 3400.00,
    originalPrice: 4200.00,
    category: 'Makeup',
    image: 'https://picsum.photos/400/500?random=12',
    isFeatured: true,
    rating: 4.8
  },
  {
    id: 'mk-3',
    name: 'Vegan Makeup Brush Set',
    description: '7-piece professional brush set with bamboo handles.',
    price: 4200.00,
    category: 'Makeup',
    image: 'https://picsum.photos/400/500?random=13',
    isFeatured: false,
    rating: 4.9
  },
  {
    id: 'po-1',
    name: 'Exclusive Pre-order: Artisan Lamp',
    description: 'Handcrafted artisan lamp, available for pre-order only.',
    price: 6500.00,
    category: 'Home Decor',
    image: 'https://picsum.photos/400/500?random=14',
    isFeatured: true,
    isPreOrder: true,
    rating: 5.0
  },
  {
    id: 'po-2',
    name: 'Limited Edition Notebook Set',
    description: 'A set of 5 premium leather-bound notebooks. Pre-order exclusive.',
    price: 3500.00,
    category: 'Stationery',
    image: 'https://picsum.photos/400/500?random=15',
    isFeatured: false,
    isPreOrder: true,
    rating: 4.9
  },
  {
    id: 'co-1',
    name: 'Custom Art Canvas - Abstract',
    description: 'Personalized abstract art canvas. Contact us to specify your color palette and dimensions.',
    price: 8500.00,
    category: 'Home Decor',
    image: 'https://picsum.photos/400/500?random=16',
    isFeatured: false,
    isCustomOrder: true,
    rating: 5.0
  },
  {
    id: 'co-2',
    name: 'Custom Engraved Nameplate',
    description: 'Brass nameplate with custom engraving for your home entrance.',
    price: 3200.00,
    category: 'Home Decor',
    image: 'https://picsum.photos/400/500?random=17',
    isFeatured: false,
    isCustomOrder: true,
    rating: 4.8
  }
];
