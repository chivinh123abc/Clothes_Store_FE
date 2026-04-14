import type { Product } from '../types/product'
import t1Jersey from '../assets/mock-images/t1_jersey.png'
import t1Jacket from '../assets/mock-images/t1_jacket.png'

export const generateMockProducts = (count: number): Product[] => {
  const categories = ['tshirt', 'hoodie', 'jacket', 'pants', 'accessories', 'hat', 'shoes', 'shirt', 'sweater', 'collection']
  const names = ['Faker', 'Zeus', 'Oner', 'Gumayusi', 'Keria', 'T1', 'LCK Official', 'Champion', 'Elite']

  // Category-specific images for better realism - expanded with proven working URLs
  const imagePool: Record<string, string[]> = {
    tshirt: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1080'
    ],
    shirt: [
      'https://images.unsplash.com/photo-1618677603544-51162346e165?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1594932224010-75b2a77d703e?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1563632907724-aa6056c7038e?auto=format&fit=crop&q=80&w=1080'
    ],
    hoodie: [
      'https://images.unsplash.com/photo-1556821840-ecc63f93428c?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1578762560072-46ef14a5a7f9?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1644483878398-b57d19f84ff8?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1564557284724-517861961937?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1512353087810-25dfcd100962?auto=format&fit=crop&q=80&w=1080'
    ],
    jacket: [
      'https://images.unsplash.com/photo-1591047139829-d91aec369a70?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1544022613-e87f17a784de?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1727524366429-27de8607d5f6?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1520975916090-3105956dac55?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1080'
    ],
    pants: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1666792494266-16d83aaf1105?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1604176354204-926873ff3da9?auto=format&fit=crop&q=80&w=1080'
    ],
    accessories: [
      'https://images.unsplash.com/photo-1509391366360-fe5ab4011e63?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1527814050087-3793815479fa?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1614850715649-165383506306?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1616421275384-a4871cf65b3f?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1605100804763-247f52bcfedc?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1080'
    ],
    hat: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1534215754734-18e547076132?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=1080'
    ],
    shoes: [
      'https://images.unsplash.com/photo-1565299999261-28ba859019bb?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1542291026-7eec264c274f?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1512374382149-4332cfa990ef?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=1080'
    ],
    sweater: [
      'https://images.unsplash.com/photo-1578762560072-46ef14a5a7f9?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1722926628555-252c1c0258bf?auto=format&fit=crop&q=80&w=1080'
    ],
    collection: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-170918655041-5de83c95ccf9?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1080'
    ]
  }
  const items: Product[] = []
  const sizeOptions = ['S', 'M', 'L', 'XL']
  const colorOptions = ['Black', 'White', 'Gray', 'Red', 'Beige']

  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length]
    const pool = imagePool[category] || imagePool['tshirt']

    items.push({
      id: `gen-${i}`,
      name: `${names[i % names.length]} Signature ${category.charAt(0).toUpperCase() + category.slice(1)} Vol.${i + 1}`,
      price: Math.floor(Math.random() * 150) + 20 + 0.99,
      image: pool[i % pool.length],
      category: category,
      bestseller: Math.random() > 0.85,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      soldOut: Math.random() > 0.9,
      description: 'Premium quality merchandise designed for elite performance. Featuring breathable fabrics and the iconic T1 logo, this piece is built for comfort and style, whether you are on stage or on the streets.',
      sizes: sizeOptions.slice(0, Math.floor(Math.random() * 4) + 1),
      colors: colorOptions.slice(0, Math.floor(Math.random() * 3) + 1)
    })
  }
  return items
}

export const generatedMocks = generateMockProducts(80)

export const allProducts: Product[] = [
  {
    id: '1',
    name: 'Essential Black Hoodie',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1080',
    category: 'hoodie',
    bestseller: false,
    createdAt: '2026-04-12',
    soldOut: false,
    description: 'A must-have for any wardrobe. This heavyweight cotton hoodie offers a relaxed fit and clean T1 branding on the chest.'
  },
  {
    id: '2',
    name: 'Oversized White Shirt',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1080',
    category: 'shirt',
    bestseller: true,
    createdAt: '2026-04-10',
    soldOut: true,
    description: 'Crisp, clean, and perfectly oversized. This white shirt is designed with a modern silhouette and premium poplin fabric.'
  },
  {
    id: '3',
    name: 'Beige Cargo Pants',
    price: 99.99,
    salePrice: 79.99,
    image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=1080',
    category: 'pants',
    bestseller: false,
    createdAt: '2026-04-08',
    soldOut: false,
    description: 'Functional meets fashion. Multiple pockets and a tapered fit make these cargo pants the ultimate streetwear essential.'
  },
  {
    id: '4',
    name: 'Premium Leather Jacket',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aec369a70?auto=format&fit=crop&q=80&w=1080',
    category: 'collection',
    bestseller: true,
    createdAt: '2026-03-01',
    soldOut: true,
    description: 'Forged from top-grain leather, this jacket features custom T1 embossed hardware and a quilted satin lining.'
  },
  {
    id: '5',
    name: 'Minimal Gray Sweater',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1578762560072-46ef14a5a7f9?auto=format&fit=crop&q=80&w=1080',
    category: 'sweater',
    bestseller: true,
    createdAt: '2026-02-18',
    soldOut: false,
    description: 'Subtle gray tones and a soft mohair blend. Ideal for layering during the colder seasons.'
  },
  {
    id: '6',
    name: 'Classic Denim Jacket',
    price: 129.99,
    salePrice: 99.99,
    image: 'https://images.unsplash.com/photo-1544022613-e87f17a784de?auto=format&fit=crop&q=80&w=1080',
    category: 'jacket',
    bestseller: false,
    createdAt: '2026-02-25',
    soldOut: false,
    description: 'A timeless classic. Distressed details and a regular fit, perfect for any casual outfit.'
  },
  {
    id: '7',
    name: 'White Minimal Sneakers',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c274f?auto=format&fit=crop&q=80&w=1080',
    category: 'shoes',
    bestseller: true,
    createdAt: '2026-04-11',
    soldOut: true,
    description: 'Ultra-clean white sneakers with a vulcanized rubber sole and comfortable cushioned insole.'
  },
  {
    id: '8',
    name: 'Streetwear Collection Set',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1080',
    category: 'collection',
    bestseller: false,
    createdAt: '2026-02-12',
    soldOut: false,
    description: 'The ultimate combo. A matching hoodie and joggers set that balances comfort with a high-fashion look.'
  },
  {
    id: '9',
    name: 'Urban Black Tee',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=1080',
    category: 'tshirt',
    bestseller: true,
    createdAt: '2026-02-08',
    soldOut: false,
    description: 'Your fundamental black tee, upgraded with a dense luxury cotton and a silver-threaded logo.'
  },
  {
    id: '10',
    name: 'Premium White Polo',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1080',
    category: 'collection',
    bestseller: true,
    createdAt: '2026-01-28',
    soldOut: true,
    description: 'Sophisticated yet sporty. This polo features a breathable mesh-knit and a customized T1 collar.'
  },
  {
    id: '11',
    name: 'Designer Black Jacket',
    price: 349.99,
    salePrice: 249.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1080',
    category: 'jacket',
    bestseller: false,
    createdAt: '2026-02-14',
    soldOut: false,
    description: 'A limited edition utility jacket with reflective strips and weather-resistant shell.'
  },
  {
    id: '12',
    name: 'Luxury Gray Cardigan',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1080',
    category: 'collection',
    bestseller: false,
    createdAt: '2026-01-20',
    soldOut: true,
    description: 'The epitome of cozy luxury. Hand-knit gray cardigan with oversized buttons and deep pockets.'
  },
  {
    id: 'n1',
    name: 'Faker Unkillable Demon King Jacket',
    price: 150.00,
    image: t1Jacket,
    category: 'jacket',
    bestseller: true,
    createdAt: '2026-04-13',
    soldOut: false,
    description: 'The official commemorative jacket for Lee "Faker" Sang-hyeok. Features embroidery inspired by his legendary plays.'
  },
  {
    id: 'n2',
    name: 'T1 Logo Essential Socks',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&q=80&w=1080',
    category: 'accessories',
    bestseller: false,
    createdAt: '2026-04-12',
    soldOut: false,
    description: 'Premium combed cotton socks with embroidered T1 logos. Cushioned for all-day gaming sessions.'
  },
  {
    id: 'n3',
    name: 'Oner Jungle Diff Graphic Tee',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1534033620894-3576629ec49b?auto=format&fit=crop&q=80&w=1080',
    category: 'tshirt',
    bestseller: true,
    createdAt: '2026-04-10',
    soldOut: false,
    description: 'Celebrate the jungle dominance. High-quality graphic print with Oner signature details.'
  },
  {
    id: 'n4',
    name: 'Gumayusi "Penta" Gym Bag',
    price: 55.00,
    image: 'https://images.unsplash.com/photo-1622560480644-d82199c8bc46?auto=format&fit=crop&q=80&w=1080',
    category: 'accessories',
    bestseller: false,
    createdAt: '2026-04-09',
    soldOut: false,
    description: 'Spacious and durable. Optimized for athletes with separate compartments for shoes and equipment.'
  },
  {
    id: 'n5',
    name: 'Keria Lux Mastercap',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1534215754734-18e547076132?auto=format&fit=crop&q=80&w=1080',
    category: 'hat',
    bestseller: true,
    createdAt: '2026-04-13',
    soldOut: false,
    description: 'Limited edition cap inspired by the master of support. Adjustable strap and premium needlework.'
  },
  {
    id: 'n6',
    name: 'T1 Spring Split 2024 Scarf',
    price: 40.00,
    image: 'https://images.unsplash.com/photo-1620803135739-12292f704ec3?auto=format&fit=crop&q=80&w=1080',
    category: 'accessories',
    bestseller: false,
    createdAt: '2026-04-12',
    soldOut: false,
    description: 'Keep warm throughout the Spring Split with this 100% acrylic knitted scarf in T1 colors.'
  },
  {
    id: 'n7',
    name: 'Zeus Jayce Hammer Keychain',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1614850715649-165383506306?auto=format&fit=crop&q=80&w=1080',
    category: 'accessories',
    bestseller: true,
    createdAt: '2026-04-11',
    soldOut: true,
    description: 'A miniature replica of the weapon wielded by the Unkillable Zeus. Solid zinc alloy construction.'
  },
  {
    id: 'n8',
    name: 'T1 Red Performance Longsleeve',
    price: 60.00,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1080',
    category: 'shirt',
    bestseller: false,
    createdAt: '2026-04-10',
    soldOut: false,
    description: 'Moisture-wicking material and a performance fit. The ideal base layer for competitive play.'
  },
  {
    id: 'n9',
    name: 'World Champions Mouse Bungee',
    price: 35.50,
    image: 'https://images.unsplash.com/photo-1616421275384-a4871cf65b3f?auto=format&fit=crop&q=80&w=1080',
    category: 'accessories',
    bestseller: false,
    createdAt: '2026-04-09',
    soldOut: false,
    description: 'Drag-free mouse movement. Weighted base with T1 engraving and flexible spring arm.'
  },
  {
    id: 'n10',
    name: 'T1 x Nike Air Max (Custom Edition)',
    price: 320.00,
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=1080',
    category: 'shoes',
    bestseller: true,
    createdAt: '2026-04-13',
    soldOut: false,
    description: 'Extremely limited edition custom Nike Air Max. Features unique colorways and player-specific details.'
  },
  {
    id: 'm1',
    name: 'T1 Official Worlds 2023 Jacket',
    price: 129.99,
    image: t1Jacket,
    category: 'jacket',
    bestseller: true,
    createdAt: '2026-03-15',
    soldOut: false,
    description: 'The jacket worn by the champions. Commemorating the spectacular run of T1 at the 2023 World Championship.'
  },
  {
    id: 'm2',
    name: 'Faker "What was that" Mousepad',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479fa?auto=format&fit=crop&q=80&w=1080',
    category: 'accessories',
    bestseller: true,
    createdAt: '2026-04-12',
    soldOut: false,
    description: 'Large surface area and precision cloth texture. Featuring the iconic "What was that" moment silhouette.'
  },
  {
    id: 'm3',
    name: 'Premium Gaming Keyboard T1 Edition',
    price: 199.99,
    salePrice: 179.99,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1080',
    category: 'accessories',
    bestseller: false,
    createdAt: '2026-02-12',
    soldOut: false,
    description: 'Mechanical keyboard with T1 red switches and custom T1 keycaps. Built for ultra-fast reaction times.'
  },
  {
    id: 'm4',
    name: 'Oner Signature Baseball Cap',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1534215754734-18e547076132?auto=format&fit=crop&q=80&w=1080',
    category: 'hat',
    bestseller: false,
    createdAt: '2026-04-01',
    soldOut: false,
    description: 'Athletic fit cap with Oner signature embroidery and breathable mesh side panels.'
  },
  {
    id: 'm5',
    name: 'Gumayusi "Adc God" White Tee',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1080',
    category: 'tshirt',
    bestseller: true,
    createdAt: '2026-04-10',
    soldOut: false,
    description: 'A heavyweight white tee that screams confidence. Featuring sleek minimal typography.'
  },
  {
    id: 'm6',
    name: 'T1 Logo Embroidered Beanie',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=1080',
    category: 'hat',
    bestseller: false,
    createdAt: '2026-01-05',
    soldOut: true,
    description: 'Soft-touch knitted beanie for those cold winter nights. High-density T1 logo embroidery.'
  },
  {
    id: 'm7',
    name: 'Zeus Unkillable Demon Top Hoodie',
    price: 89.99,
    salePrice: 69.99,
    image: 'https://images.unsplash.com/photo-1556821840-ecc63f93428c?auto=format&fit=crop&q=80&w=1080',
    category: 'hoodie',
    bestseller: true,
    createdAt: '2026-04-05',
    soldOut: false,
    description: 'Dominate the top lane in comfort. Features unique "Unkillable" branding along the sleeves.'
  },
  {
    id: 'm8',
    name: 'Keria Support Diff Sweatpants',
    price: 65.50,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1080',
    category: 'pants',
    bestseller: false,
    createdAt: '2026-03-22',
    soldOut: false,
    description: 'Comfy jersey-knit sweatpants with tapered cuffs and high-quality T1 screen print.'
  },
  {
    id: 'm9',
    name: 'T1 Official Team Jersey 2024',
    price: 110.00,
    image: t1Jersey,
    category: 'tshirt',
    bestseller: true,
    createdAt: '2026-04-12',
    soldOut: false,
    description: 'The exact jersey worn by Faker and the team during the 2024 Season. Lightweight and aerodynamic.'
  },
  {
    id: 'm10',
    name: 'T1 Champion Golden Ring Replica',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1605100804763-247f52bcfedc?auto=format&fit=crop&q=80&w=1080',
    category: 'accessories',
    bestseller: false,
    createdAt: '2026-02-28',
    soldOut: false,
    description: 'A 1:1 replica of the championship ring. Complete with a display case and certificate of authenticity.'
  }
]

export const combinedProducts = [...allProducts, ...generatedMocks]
