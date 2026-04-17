import type { Product } from '../types/product'
import t1Jersey from '../assets/mock-images/t1_jersey.png'
import t1Jacket from '../assets/mock-images/t1_jacket.png'

export const generateMockProducts = (count: number): Product[] => {
  const categories = ['tshirt', 'hoodie', 'jacket', 'pants', 'accessories', 'hat', 'shoes', 'shirt', 'sweater', 'collection']
  const names = ['Faker', 'Zeus', 'Oner', 'Gumayusi', 'Keria', 'T1', 'LCK Official', 'Champion', 'Elite']
  const imagePool: Record<string, string[]> = {
    tshirt: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1576566588028-4147f342f27?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1080'],
    shirt: ['https://images.unsplash.com/photo-1618677603544-51162346e165?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1594932224010-75b2a77d703e?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1563632907724-aa6056c7038e?auto=format&fit=crop&q=80&w=1080'],
    hoodie: ['https://images.unsplash.com/photo-1556821840-ecc63f93428c?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1578762560072-46ef14a5a7f9?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1644483878398-b57d19f84ff8?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1564557284724-517861961937?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1512353087810-25dfcd100962?auto=format&fit=crop&q=80&w=1080'],
    jacket: ['https://images.unsplash.com/photo-1591047139829-d91aec369a70?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1544022613-e87f17a784de?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1727524366429-27de8607d5f6?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1520975916090-3105956dac55?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1080'],
    pants: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1666792494266-16d83aaf1105?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1604176354204-926873ff3da9?auto=format&fit=crop&q=80&w=1080'],
    accessories: ['https://images.unsplash.com/photo-1509391366360-fe5ab4011e63?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1527814050087-3793815479fa?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1614850715649-165383506306?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1616421275384-a4871cf65b3f?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1605100804763-247f52bcfedc?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1080'],
    hat: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1534215754734-18e547076132?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=1080'],
    shoes: ['https://images.unsplash.com/photo-1565299999261-28ba859019bb?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1542291026-7eec264c274f?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1512374382149-4332cfa990ef?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=1080'],
    sweater: ['https://images.unsplash.com/photo-1578762560072-46ef14a5a7f9?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1722926628555-252c1c0258bf?auto=format&fit=crop&q=80&w=1080'],
    collection: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-170918655041-5de83c95ccf9?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1080', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1080']
  }
  const results: Product[] = []
  const sizeOptions = ['S', 'M', 'L', 'XL']
  const colorOptions = ['Black', 'White', 'Gray', 'Red', 'Beige']

  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length]
    const pool = imagePool[category] || imagePool['tshirt']
    const pname = `${names[i % names.length]} Signature ${category.charAt(0).toUpperCase() + category.slice(1)} Vol.${i + 1}`
    const pprice = Math.floor(Math.random() * 150) + 20 + 0.99
    const stock = Math.random() > 0.1 ? Math.floor(Math.random() * 200) + 10 : 0
    const soldCount = Math.floor(Math.random() * 1000)

    const collections: string[] = []
    if (category === 'tshirt' || category === 'jacket') {
      if (Math.random() > 0.5) collections.push('team-kit')
    }
    if (category === 'collection' || category === 'hoodie' || category === 'jacket') {
      const worldYear = 2023 + (i % 3)
      collections.push(`worlds-${worldYear}`)
    }
    if (category === 'hoodie' || category === 'pants' || category === 'shirt') {
      collections.push('essential', 'essential-apparel')
    }

    results.push({
      product_id: i + 100,
      product_name: pname,
      product_slug: pname.toLowerCase().replace(/ /g, '-'),
      category_id: i % categories.length + 1,
      category_name: category,
      sold_count: soldCount,
      is_bestseller: false, // Calculated later
      created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      soldOut: stock === 0,
      product_description: 'Premium quality merchandise designed for elite performance. Featuring breathable fabrics and the iconic T1 logo, this piece is built for comfort and style.',
      sizes: sizeOptions.slice(0, Math.floor(Math.random() * 4) + 1),
      colors: colorOptions.slice(0, Math.floor(Math.random() * 3) + 1),
      collections,
      items: [
        {
          product_item_id: i * 10,
          sku: `${category.toUpperCase().substring(0, 2)}-${i}`,
          stock_quantity: stock,
          product_item_image: pool[i % pool.length],
          product_item_price: pprice
        }
      ]
    })

  }
  return results
}

const staticProducts: Product[] = [
  {
    product_id: 1,
    product_name: 'Essential Black Hoodie',
    product_slug: 'essential-black-hoodie',
    category_id: 2,
    category_name: 'hoodie',
    sold_count: 500,
    is_bestseller: false,
    created_at: '2026-04-12',
    soldOut: false,
    product_description: 'A must-have for any wardrobe. This heavyweight cotton hoodie offers a relaxed fit and clean T1 branding on the chest.',
    collections: ['essential', 'essential-apparel'],
    items: [{
      product_item_id: 101,
      sku: 'SKU-101',
      stock_quantity: 100,
      product_item_image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1080',
      product_item_price: 89.99
    }]

  },
  {
    product_id: 2,
    product_name: 'Oversized White Shirt',
    product_slug: 'oversized-white-shirt',
    category_id: 8,
    category_name: 'shirt',
    sold_count: 850,
    is_bestseller: false,
    created_at: '2026-04-10',
    soldOut: true,
    product_description: 'Crisp, clean, and perfectly oversized. This white shirt is designed with a modern silhouette and premium poplin fabric.',
    collections: ['essential', 'essential-apparel'],
    items: [{
      product_item_id: 102,
      sku: 'SKU-102',
      stock_quantity: 0,
      product_item_image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1080',
      product_item_price: 69.99
    }]

  },
  {
    product_id: 3,
    product_name: 'Beige Cargo Pants',
    product_slug: 'beige-cargo-pants',
    category_id: 4,
    category_name: 'pants',
    sold_count: 120,
    is_bestseller: false,
    created_at: '2026-04-08',
    soldOut: false,
    product_description: 'Functional meets fashion. Multiple pockets and a tapered fit make these cargo pants the ultimate streetwear essential.',
    collections: ['valorant', 'valorant-apparel'],
    items: [{
      product_item_id: 103,
      sku: 'SKU-103',
      stock_quantity: 50,
      product_item_image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=1080',
      product_item_price: 99.99,
      sale_price: 79.99
    }]

  },
  {
    product_id: 4,
    product_name: 'Premium Leather Jacket',
    product_slug: 'premium-leather-jacket',
    category_id: 10,
    category_name: 'collection',
    sold_count: 50,
    is_bestseller: false,
    created_at: '2026-03-01',
    soldOut: true,
    product_description: 'Forged from top-grain leather, this jacket features custom T1 embossed hardware and a quilted satin lining.',
    items: [{
      product_item_id: 104,
      sku: 'SKU-104',
      stock_quantity: 0,
      product_item_image: 'https://images.unsplash.com/photo-1591047139829-d91aec369a70?auto=format&fit=crop&q=80&w=1080',
      product_item_price: 299.99
    }]
  },
  {
    product_id: 5,
    product_name: 'Minimal Gray Sweater',
    product_slug: 'minimal-gray-sweater',
    category_id: 9,
    category_name: 'sweater',
    sold_count: 300,
    is_bestseller: false,
    created_at: '2026-02-18',
    soldOut: false,
    product_description: 'Subtle gray tones and a soft mohair blend. Ideal for layering during the colder seasons.',
    items: [{
      product_item_id: 105,
      sku: 'SKU-105',
      stock_quantity: 120,
      product_item_image: 'https://images.unsplash.com/photo-1578762560072-46ef14a5a7f9?auto=format&fit=crop&q=80&w=1080',
      product_item_price: 79.99
    }]
  },
  {
    product_id: 6,
    product_name: 'Classic Denim Jacket',
    product_slug: 'classic-denim-jacket',
    category_id: 3,
    category_name: 'jacket',
    sold_count: 80,
    is_bestseller: false,
    created_at: '2026-02-25',
    soldOut: false,
    product_description: 'A timeless classic. Distressed details and a regular fit, perfect for any casual outfit.',
    collections: ['worlds-2024'],
    items: [{
      product_item_id: 106,
      sku: 'SKU-106',
      stock_quantity: 40,
      product_item_image: 'https://images.unsplash.com/photo-1544022613-e87f17a784de?auto=format&fit=crop&q=80&w=1080',
      product_item_price: 129.99,
      sale_price: 99.99
    }]

  },
  {
    product_id: 7,
    product_name: 'White Minimal Sneakers',
    product_slug: 'white-minimal-sneakers',
    category_id: 7,
    category_name: 'shoes',
    sold_count: 600,
    is_bestseller: false,
    created_at: '2026-04-11',
    soldOut: true,
    product_description: 'Ultra-clean white sneakers with a vulcanized rubber sole and comfortable cushioned insole.',
    items: [{
      product_item_id: 107,
      sku: 'SKU-107',
      stock_quantity: 0,
      product_item_image: 'https://images.unsplash.com/photo-1542291026-7eec264c274f?auto=format&fit=crop&q=80&w=1080',
      product_item_price: 119.99
    }]
  },
  {
    product_id: 8,
    product_name: 'Streetwear Collection Set',
    product_slug: 'streetwear-collection-set',
    category_id: 10,
    category_name: 'collection',
    sold_count: 40,
    is_bestseller: false,
    created_at: '2026-02-12',
    soldOut: false,
    product_description: 'The ultimate combo. A matching hoodie and joggers set that balances comfort with a high-fashion look.',
    items: [{
      product_item_id: 108,
      sku: 'SKU-108',
      stock_quantity: 15,
      product_item_image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1080',
      product_item_price: 189.99
    }]
  },
  {
    product_id: 9,
    product_name: 'Urban Black Tee',
    product_slug: 'urban-black-tee',
    category_id: 1,
    category_name: 'tshirt',
    sold_count: 900,
    is_bestseller: false,
    created_at: '2026-02-08',
    soldOut: false,
    product_description: 'Your fundamental black tee, upgraded with a dense luxury cotton and a silver-threaded logo.',
    items: [{
      product_item_id: 109,
      sku: 'SKU-109',
      stock_quantity: 200,
      product_item_image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=1080',
      product_item_price: 49.99
    }]
  },
  {
    product_id: 10,
    product_name: 'Premium White Polo',
    product_slug: 'premium-white-polo',
    category_id: 10,
    category_name: 'collection',
    sold_count: 10,
    is_bestseller: false,
    created_at: '2026-01-28',
    soldOut: true,
    product_description: 'Sophisticated yet sporty. This polo features a breathable mesh-knit and a customized T1 collar.',
    items: [{
      product_item_id: 110,
      sku: 'SKU-110',
      stock_quantity: 0,
      product_item_image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1080',
      product_item_price: 89.99
    }]
  },
  {
    product_id: 11,
    product_name: 'Faker Unkillable Demon King Jacket',
    product_slug: 'faker-unkillable-demon-king-jacket',
    category_id: 3,
    category_name: 'jacket',
    sold_count: 1200,
    is_bestseller: false,
    created_at: '2026-04-13',
    soldOut: false,
    product_description: 'The official commemorative jacket for Lee "Faker" Sang-hyeok. Features embroidery inspired by his legendary plays.',
    items: [{
      product_item_id: 111,
      sku: 'SKU-111',
      stock_quantity: 300,
      product_item_image: t1Jacket,
      product_item_price: 150.00
    }]
  },
  {
    product_id: 12,
    product_name: 'T1 Logo Essential Socks',
    product_slug: 't1-logo-essential-socks',
    category_id: 5,
    category_name: 'accessories',
    sold_count: 450,
    is_bestseller: false,
    created_at: '2026-04-12',
    soldOut: false,
    product_description: 'Premium combed cotton socks with embroidered T1 logos. Cushioned for all-day gaming sessions.',
    items: [{
      product_item_id: 112,
      sku: 'SKU-112',
      stock_quantity: 500,
      product_item_image: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&q=80&w=1080',
      product_item_price: 24.99
    }]
  },
  {
    product_id: 13,
    product_name: 'T1 Official Team Jersey 2024',
    product_slug: 't1-official-team-jersey-2024',
    category_id: 1,
    category_name: 'tshirt',
    sold_count: 2000,
    is_bestseller: false,
    created_at: '2026-04-12',
    soldOut: false,
    product_description: 'The exact jersey worn by Faker and the team during the 2024 Season. Lightweight and aerodynamic.',
    collections: ['team-kit'],
    items: [{
      product_item_id: 113,
      sku: 'SKU-113',
      stock_quantity: 800,
      product_item_image: t1Jersey,
      product_item_price: 110.00
    }]

  }
]

const generatedMocks = generateMockProducts(100)

// Merge and process bestseller logic
const allUnprocessed = [...staticProducts, ...generatedMocks]

// Sort by sold_count to find top 10
const sortedBySales = [...allUnprocessed].sort((a, b) => b.sold_count - a.sold_count)
const top10Ids = new Set(sortedBySales.slice(0, 10).map(p => p.product_id))

export const combinedProducts: Product[] = allUnprocessed.map(p => ({
  ...p,
  is_bestseller: top10Ids.has(p.product_id)
}))
