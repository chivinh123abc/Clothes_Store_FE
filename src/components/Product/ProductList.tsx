import { useMemo, useState } from 'react'
import { ProductCard } from '~/components/Product/ProductCard'
import { motion } from 'motion/react'
import BGImage from '~/assets/Background/T1 Poster.jpg'
import { combinedProducts } from '~/data/products'

type FilterType = 'all' | 'best' | 'new' | 'sale' | 'collection'

type ProductListProps = {
  filter?: FilterType
}

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
