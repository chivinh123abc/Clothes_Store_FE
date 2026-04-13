/* eslint-disable indent */
import { useMemo, useState } from 'react'
import { ProductCard } from '~/components/Product/ProductCard'
import { motion } from 'motion/react'
import BGImage from '~/assets/Background/T1 Poster.jpg'

export type Product = {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  bestseller: boolean;
  createdAt: string;
  soldOut: boolean;
}

const generateMockProducts = (count: number): Product[] => {
  const categories = ['tshirt', 'hoodie', 'jacket', 'pants', 'accessories', 'hat', 'shoes']
  const names = ['Faker', 'Zeus', 'Oner', 'Gumayusi', 'Keria', 'T1', 'World Champion', 'Esports', 'Pro']
  const mockImages = [
    'https://images.unsplash.com/photo-1556821840-ecc63f93428c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1527814050087-3793815479fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1605100804763-247f52bcfedc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1618677603544-51162346e165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  ]
  const items: Product[] = []
  for (let i = 0; i < count; i++) {
    items.push({
      id: `gen-${i}`,
      name: `${names[i % names.length]} Signature ${categories[i % categories.length].charAt(0).toUpperCase() + categories[i % categories.length].slice(1)} Vol.${i}`,
      price: Math.floor(Math.random() * 150) + 20 + 0.99,
      image: mockImages[i % mockImages.length],
      category: categories[i % categories.length],
      bestseller: Math.random() > 0.7,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString(),
      soldOut: Math.random() > 0.8
    })
  }
  return items
}

const generatedMocks = generateMockProducts(80)

type FilterType = 'all' | 'best' | 'new' | 'sale' | 'collection'

type ProductListProps = {
  filter?: FilterType
}

const allProducts: Product[] = [
    {
      id: '1',
      name: 'Essential Black Hoodie',
      price: 89.99,
      image:
        'https://images.unsplash.com/photo-1644483878398-b57d19f84ff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'hoodie',
      bestseller: false,
      createdAt: '2026-04-12',
      soldOut: false
    },
    {
      id: '2',
      name: 'Oversized White Shirt',
      price: 69.99,
      image:
        'https://images.unsplash.com/photo-1618677603544-51162346e165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'shirt',
      bestseller: true,
      createdAt: '2026-04-10',
      soldOut: true
    },
    {
      id: '3',
      name: 'Beige Cargo Pants',
      price: 99.99,
      salePrice: 79.99,
      image:
        'https://images.unsplash.com/photo-1666792494266-16d83aaf1105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'pants',
      bestseller: false,
      createdAt: '2026-04-08',
      soldOut: false
    },
    {
      id: '4',
      name: 'Premium Leather Jacket',
      price: 299.99,
      image:
        'https://images.unsplash.com/photo-1727524366429-27de8607d5f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'collection',
      bestseller: true,
      createdAt: '2026-03-01',
      soldOut: true
    },
    {
      id: '5',
      name: 'Minimal Gray Sweater',
      price: 79.99,
      image:
        'https://images.unsplash.com/photo-1722926628555-252c1c0258bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'sweater',
      bestseller: true,
      createdAt: '2026-02-18',
      soldOut: false
    },
    {
      id: '6',
      name: 'Classic Denim Jacket',
      price: 129.99,
      salePrice: 99.99,
      image:
        'https://images.unsplash.com/photo-1588011025378-15f4778d2558?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'jacket',
      bestseller: false,
      createdAt: '2026-02-25',
      soldOut: false
    },
    {
      id: '7',
      name: 'White Minimal Sneakers',
      price: 119.99,
      image:
        'https://images.unsplash.com/photo-1565299999261-28ba859019bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'shoes',
      bestseller: true,
      createdAt: '2026-04-11',
      soldOut: true
    },
    {
      id: '8',
      name: 'Streetwear Collection Set',
      price: 189.99,
      image:
        'https://images.unsplash.com/photo-1770918655041-5de83c95ccf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'collection',
      bestseller: false,
      createdAt: '2026-02-12',
      soldOut: false
    },
    {
      id: '9',
      name: 'Urban Black Tee',
      price: 49.99,
      image:
        'https://images.unsplash.com/photo-1644483878398-b57d19f84ff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'tshirt',
      bestseller: true,
      createdAt: '2026-02-08',
      soldOut: false
    },
    {
      id: '10',
      name: 'Premium White Polo',
      price: 89.99,
      image:
        'https://images.unsplash.com/photo-1618677603544-51162346e165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'collection',
      bestseller: true,
      createdAt: '2026-01-28',
      soldOut: true
    },
    {
      id: '11',
      name: 'Designer Black Jacket',
      price: 349.99,
      salePrice: 249.99,
      image:
        'https://images.unsplash.com/photo-1727524366429-27de8607d5f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'jacket',
      bestseller: false,
      createdAt: '2026-02-14',
      soldOut: false
    },
    {
      id: '12',
      name: 'Luxury Gray Cardigan',
      price: 149.99,
      image:
        'https://images.unsplash.com/photo-1722926628555-252c1c0258bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'collection',
      bestseller: false,
      createdAt: '2026-01-20',
      soldOut: true
    },
    {
      id: 'n1',
      name: 'Faker Unkillable Demon King Jacket',
      price: 150.00,
      image: 'https://images.unsplash.com/photo-1556821840-ecc63f93428c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'jacket',
      bestseller: true,
      createdAt: '2026-04-13',
      soldOut: false
    },
    {
      id: 'n2',
      name: 'T1 Logo Essential Socks',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'accessories',
      bestseller: false,
      createdAt: '2026-04-12',
      soldOut: false
    },
    {
      id: 'n3',
      name: 'Oner Jungle Diff Graphic Tee',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'tshirt',
      bestseller: true,
      createdAt: '2026-04-10',
      soldOut: false
    },
    {
      id: 'n4',
      name: 'Gumayusi "Penta" Gym Bag',
      price: 55.00,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'accessories',
      bestseller: false,
      createdAt: '2026-04-09',
      soldOut: false
    },
    {
      id: 'n5',
      name: 'Keria Lux Mastercap',
      price: 35.00,
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'hat',
      bestseller: true,
      createdAt: '2026-04-13',
      soldOut: false
    },
    {
      id: 'n6',
      name: 'T1 Spring Split 2024 Scarf',
      price: 40.00,
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'accessories',
      bestseller: false,
      createdAt: '2026-04-12',
      soldOut: false
    },
    {
      id: 'n7',
      name: 'Zeus Jayce Hammer Keychain',
      price: 15.00,
      image: 'https://images.unsplash.com/photo-1621245053597-9003503cb377?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'accessories',
      bestseller: true,
      createdAt: '2026-04-11',
      soldOut: true
    },
    {
      id: 'n8',
      name: 'T1 Red Performance Longsleeve',
      price: 60.00,
      image: 'https://images.unsplash.com/photo-1618677603544-51162346e165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'shirt',
      bestseller: false,
      createdAt: '2026-04-10',
      soldOut: false
    },
    {
      id: 'n9',
      name: 'World Champions Mouse Bungee',
      price: 35.50,
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'accessories',
      bestseller: false,
      createdAt: '2026-04-09',
      soldOut: false
    },
    {
      id: 'n10',
      name: 'T1 x Nike Air Max (Custom Edition)',
      price: 320.00,
      image: 'https://images.unsplash.com/photo-1565299999261-28ba859019bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'shoes',
      bestseller: true,
      createdAt: '2026-04-13',
      soldOut: false
    },
    {
      id: 'm1',
      name: 'T1 Official Worlds 2023 Jacket',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1556821840-ecc63f93428c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'jacket',
      bestseller: true,
      createdAt: '2026-03-15',
      soldOut: false
    },
    {
      id: 'm2',
      name: 'Faker "What was that" Mousepad',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'accessories',
      bestseller: true,
      createdAt: '2026-04-12',
      soldOut: false
    },
    {
      id: 'm3',
      name: 'Premium Gaming Keyboard T1 Edition',
      price: 199.99,
      salePrice: 179.99,
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'accessories',
      bestseller: false,
      createdAt: '2026-02-12',
      soldOut: false
    },
    {
      id: 'm4',
      name: 'Oner Signature Baseball Cap',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'hat',
      bestseller: false,
      createdAt: '2026-04-01',
      soldOut: false
    },
    {
      id: 'm5',
      name: 'Gumayusi "Adc God" White Tee',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'tshirt',
      bestseller: true,
      createdAt: '2026-04-10',
      soldOut: false
    },
    {
      id: 'm6',
      name: 'T1 Logo Embroidered Beanie',
      price: 25.00,
      image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'hat',
      bestseller: false,
      createdAt: '2026-01-05',
      soldOut: true
    },
    {
      id: 'm7',
      name: 'Zeus Unkillable Demon Top Hoodie',
      price: 89.99,
      salePrice: 69.99,
      image: 'https://images.unsplash.com/photo-1556821840-ecc63f93428c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'hoodie',
      bestseller: true,
      createdAt: '2026-04-05',
      soldOut: false
    },
    {
      id: 'm8',
      name: 'Keria Support Diff Sweatpants',
      price: 65.50,
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'pants',
      bestseller: false,
      createdAt: '2026-03-22',
      soldOut: false
    },
    {
      id: 'm9',
      name: 'T1 Official Team Jersey 2024',
      price: 110.00,
      image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'tshirt',
      bestseller: true,
      createdAt: '2026-04-12',
      soldOut: false
    },
    {
      id: 'm10',
      name: 'T1 Champion Golden Ring Replica',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1605100804763-247f52bcfedc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'accessories',
      bestseller: false,
      createdAt: '2026-02-28',
      soldOut: false
    }
  ]

  const combinedProducts = [...allProducts, ...generatedMocks]

export function ProductList({ filter = 'all' }: ProductListProps) {
  const [sortBy, setSortBy] = useState('newest')
  const [visibleCount, setVisibleCount] = useState(12)
  const NEW_PRODUCT_DAYS = 7

  const isNewProduct = (createdAt: string) => {
    const createdDate = new Date(createdAt)
    const now = new Date()
    const diffTime = now.getTime() - createdDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    return diffDays <= NEW_PRODUCT_DAYS
  }

  const getFilteredProducts = () => {
    switch (filter) {
      case 'new':
        return combinedProducts.filter((p) => isNewProduct(p.createdAt))
      case 'best':
        return combinedProducts.filter((p) => p.bestseller)
      case 'collection':
        return combinedProducts.filter((p) => p.category === 'collection')
      case 'sale':
        return combinedProducts.filter((p) => p.salePrice != null)
      default:
        return combinedProducts
    }
  }
  const getPageInfo = () => {
    switch (filter) {
      case 'new':
        return {
          title: 'New Arrivals',
          description:
            'Discover our latest drops and newest additions to the collection',
          bannerImage:
            'https://images.unsplash.com/photo-1635650805015-2fa50682873a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          highlight: 'Fresh styles just landed'
        }
      case 'best':
        return {
          title: 'Best Sellers',
          description:
            'Our most loved pieces that customers can\'t get enough of',
          bannerImage: BGImage,
          highlight: 'Top rated by our community'
        }
      case 'collection':
        return {
          title: 'Premium Collection',
          description: 'Curated selection of our finest premium pieces',
          bannerImage:
            'https://images.unsplash.com/photo-1769981271695-bb3d766ee419?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          highlight: 'Exclusive & Limited Edition'
        }
      case 'sale':
        return {
          title: 'Sale',
          description: 'Limited time offers - Save up to 50% on selected items',
          bannerImage:
            'https://images.unsplash.com/photo-1770362804478-86f1ccc60e7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          highlight: '🔥 Hot Deals - Limited Stock'
        }
      default:
        return {
          title: 'Shop All Products',
          description:
            'Browse our complete collection of streetwear essentials',
          bannerImage: '',
          highlight: ''
        }
    }
  }

  const pageInfo = getPageInfo()

  const sortedProducts = useMemo(() => {
    const filtered = getFilteredProducts()

    const sorted = [...filtered]
    switch (sortBy) {
      case 'price-low':
        sorted.sort(
          (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
        )
        break
      case 'price-high':
        sorted.sort(
          (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
        )
        break
      case 'name-az':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-za':
        sorted.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'best':
        sorted.sort((a, b) => Number(b.bestseller) - Number(a.bestseller))
        break
      case 'newest':
      default:
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
    }

    return sorted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sortBy])

  const visibleProducts = useMemo(() => {
    return sortedProducts.slice(0, visibleCount)
  }, [sortedProducts, visibleCount])

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setVisibleCount(12)
  }

  const getProductBadge = (product: {
    salePrice?: number;
    createdAt: string;
  }) => {
    if (product.salePrice) return 'SALE'
    if (isNewProduct(product.createdAt)) return 'NEW'
    return undefined
  }

  return (
    <div className='min-h-screen bg-t1-dark text-t1-text font-inter'>
      {filter !== 'all' && (
        <div className='relative h-[600px] overflow-hidden border-b border-t1-gray/30'>
          <div
            className='absolute inset-0 bg-cover bg-center transition-transform duration-1000'
            style={{ backgroundImage: `url('${pageInfo.bannerImage}')` }}
          >
            <div className='absolute inset-0 bg-gradient-to-t from-t1-dark via-t1-dark/60 to-transparent' />
          </div>

          <div className='relative flex h-full max-w-7xl mx-auto flex-col justify-end px-4 pb-20 md:px-10 lg:px-16'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className='max-w-3xl'
            >
              <div className='inline-block mb-6'>
                <span className='font-oswald text-t1-red font-bold tracking-[0.3em] uppercase text-sm mb-4 block'>
                  {pageInfo.highlight}
                </span>
                <h1 className='text-6xl md:text-8xl font-oswald font-black text-white italic uppercase tracking-tighter leading-none mb-6'>
                  {pageInfo.title}
                </h1>
                <div className='h-[4px] w-24 bg-t1-red shadow-[0_0_15px_rgba(226,1,45,0.6)]' />
              </div>

              <p className='text-lg md:text-xl text-gray-400 font-light max-w-xl leading-relaxed italic'>
                {pageInfo.description}
              </p>
            </motion.div>
          </div>
        </div>
      )}

      <div className='max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-12'>
        {filter === 'all' && (
          <div className='mb-12'>
            <h1 className='font-oswald text-5xl font-black text-white uppercase italic mb-4'>{pageInfo.title}</h1>
            <p className='text-gray-400 italic text-lg'>{pageInfo.description}</p>
          </div>
        )}

        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-t1-gray/20 pb-8'>
          <div className='flex items-baseline gap-2'>
            <p className='font-oswald text-2xl font-bold text-t1-red'>{sortedProducts.length}</p>
            <p className='text-sm text-gray-500 uppercase tracking-widest font-medium'>Items discovered</p>
          </div>

          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-4'>
              <span className='font-oswald text-xs tracking-widest text-gray-500 uppercase'>Sort by</span>
              <div className='relative group'>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className='appearance-none bg-t1-gray border border-t1-gray px-6 py-2 pr-10 text-xs font-oswald font-bold tracking-widest text-white focus:outline-none focus:border-t1-red transition-all cursor-pointer uppercase'
                >
                  <option value='best'>Best Sellers</option>
                  <option value='newest'>Newest</option>
                  <option value='price-low'>Price: Low to High</option>
                  <option value='price-high'>Price: High to Low</option>
                  <option value='name-az'>Name: A-Z</option>
                  <option value='name-za'>Name: Z-A</option>
                </select>
                <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-t1-red text-[10px]'>▼</div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex-1'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12'>
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                badge={getProductBadge(product)}
              />
            ))}
          </div>

          {visibleCount < sortedProducts.length && (
            <div className='mt-20 flex justify-center'>
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className='px-12 py-4 border-2 border-t1-red text-t1-red font-oswald font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-t1-red hover:text-white shadow-[0_0_15px_rgba(226,1,45,0.2)] hover:shadow-[0_0_25px_rgba(226,1,45,0.6)]'
              >
                SEE MORE +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
