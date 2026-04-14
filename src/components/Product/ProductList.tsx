/* eslint-disable indent */
import { useMemo, useState } from 'react'
import { ProductCard } from '~/components/Product/ProductCard'
import { motion, AnimatePresence } from 'framer-motion'
import BGImage from '~/assets/Background/T1 Poster.jpg'
import { combinedProducts } from '~/data/products'
import { FilterSidebar } from './FilterSidebar'
import { ShopSearch } from './ShopSearch'
import { Filter, SlidersHorizontal, Trash2, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

type FilterType = 'all' | 'best' | 'new' | 'sale' | 'collection'

type ProductListProps = {
  filter?: FilterType
}

export function ProductList({ filter = 'all' }: ProductListProps) {
  const [sortBy, setSortBy] = useState('newest')
  const [visibleCount, setVisibleCount] = useState(12)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const location = useLocation()

  const NEW_PRODUCT_DAYS = 7

  const maxPrice = useMemo(() => {
    return Math.ceil(Math.max(...combinedProducts.map((p) => p.salePrice ?? p.price)))
  }, [])

  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice])

  const isNewProduct = (createdAt: string) => {
    const createdDate = new Date(createdAt)
    const now = new Date()
    const diffTime = now.getTime() - createdDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    return diffDays <= NEW_PRODUCT_DAYS
  }

  const getFilteredProducts = () => {
    let products = [...combinedProducts]

    // Base filter (All, New, Best, etc.)
    switch (filter) {
      case 'new':
        products = products.filter((p) => isNewProduct(p.createdAt))
        break
      case 'best':
        products = products.filter((p) => p.bestseller)
        break
      case 'collection':
        products = products.filter((p) => p.category === 'collection')
        break
      case 'sale':
        products = products.filter((p) => p.salePrice != null)
        break
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      )
    }

    // URL Route based filtering mapping
    const path = location.pathname.toLowerCase()

    if (path.includes('/sale')) {
      products = products.filter((p) => p.salePrice != null)
    } else if (path.includes('/team-kit')) {
      products = products.filter((p) => p.category === 'tshirt' || p.category === 'jacket')
    } else if (path.includes('/collection')) {
      // Deep collection paths
      if (path.includes('/essential')) {
        if (path.includes('/gift-and-accessory')) {
          products = products.filter((p) => p.category === 'accessories' || p.category === 'hat')
        } else if (path.includes('/apparel')) {
          products = products.filter((p) => ['tshirt', 'hoodie', 'jacket', 'pants'].includes(p.category))
        } else {
          // just essential
          products = products.filter((p) => p.id.includes('1') || p.id.includes('2') || p.category === 'hoodie')
        }
      } else if (path.includes('/league-of-legends')) {
        if (path.includes('/gift-and-accessory')) {
          products = products.filter((p) => p.category === 'accessories' && p.name.toLowerCase().includes('t1'))
        } else if (path.includes('/apparel')) {
          products = products.filter((p) => p.category === 'tshirt' || p.category === 'jacket')
        } else {
          // general LoL
          products = products.filter((p) => p.name.toLowerCase().includes('faker') || p.name.toLowerCase().includes('oner') || p.id.includes('3') || p.id.includes('4'))
        }
      } else if (path.includes('/valorant')) {
        if (path.includes('/gift-and-accessory')) {
          products = products.filter((p) => p.category === 'hat' || p.name.toLowerCase().includes('mouse'))
        } else if (path.includes('/apparel')) {
          products = products.filter((p) => p.category === 'pants' || p.category === 'shirt')
        } else {
          // general valorant
          products = products.filter((p) => p.id.includes('5') || p.id.includes('6') || p.id.includes('7') || p.category === 'pants')
        }
      } else {
        // general collection
        products = products.filter((p) => p.category === 'collection' || p.category === 'sweater')
      }
    } else if (path.includes('/collaboration')) {
      // Deep collaboration paths
      if (path.includes('/disney')) {
        products = products.filter((p) => p.id.includes('7') || p.name.toLowerCase().includes('white') || p.category === 'hoodie')
      } else if (path.includes('/rinstore-x-goalstudio')) {
        products = products.filter((p) => p.id.includes('8') || p.category === 'shoes' || p.category === 'pants')
      } else if (path.includes('/rinstore-x-secretlab')) {
        products = products.filter((p) => p.name.toLowerCase().includes('keyboard') || p.name.toLowerCase().includes('mouse') || p.id.includes('9'))
      } else if (path.includes('/rinstore-x-razer')) {
        products = products.filter((p) => p.name.toLowerCase().includes('mouse') || p.category === 'accessories')
      } else {
        products = products.filter((p) => p.category === 'accessories' || p.category === 'shoes' || p.category === 'hat')
      }
    }

    // Price Range
    products = products.filter((p) => {
      const currentPrice = p.salePrice ?? p.price
      return currentPrice >= priceRange[0] && currentPrice <= priceRange[1]
    })

    return products
  }

  const getPageInfo = () => {
    const path = location.pathname.toLowerCase()

    if (path.includes('/new')) {
      return {
        title: 'New Arrivals',
        description: 'Discover our latest drops and newest additions to the collection',
        bannerImage: 'https://images.unsplash.com/photo-1635650805015-2fa50682873a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: 'Fresh styles just landed'
      }
    }
    if (path.includes('/best') || filter === 'best') {
      return {
        title: 'Best Sellers',
        description: 'Our most loved pieces that customers can\'t get enough of',
        bannerImage: BGImage,
        highlight: 'Top rated by our community'
      }
    }
    if (path.includes('/sale')) {
      return {
        title: 'Sale',
        description: 'Limited time offers - Save up to 50% on selected items',
        bannerImage: 'https://images.unsplash.com/photo-1770362804478-86f1ccc60e7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: '🔥 Hot Deals - Limited Stock'
      }
    }
    if (path.includes('/team-kit')) {
      return {
        title: 'Team Kit',
        description: 'Official gear worn by our champions.',
        bannerImage: 'https://images.unsplash.com/photo-1542291026-7eec264c274f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: 'Play like a Pro'
      }
    }

    // Collection sub-categories
    if (path.includes('/essential')) {
      return {
        title: `Essential ${path.includes('/apparel') ? 'Apparel' : path.includes('/gift-and-accessory') ? 'Accessories' : 'Collection'}`,
        description: 'Core T1 basic wear for your daily rotation.',
        bannerImage: 'https://images.unsplash.com/photo-1556821840-ecc63f93428c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: 'Daily Wear'
      }
    }
    if (path.includes('/league-of-legends')) {
      return {
        title: `League of Legends ${path.includes('/apparel') ? 'Apparel' : path.includes('/gift-and-accessory') ? 'Accessories' : ''}`,
        description: 'Official Riot Games Collaboration featuring unique designs.',
        bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: 'Summoners Rift'
      }
    }
    if (path.includes('/valorant')) {
      return {
        title: `Valorant ${path.includes('/apparel') ? 'Apparel' : path.includes('/gift-and-accessory') ? 'Accessories' : ''}`,
        description: 'Tactical Shooter Gear for the Radiant ready.',
        bannerImage: 'https://images.unsplash.com/photo-1620803135739-12292f704ec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: 'Defy the Limits'
      }
    }
    if (path.includes('/collection')) {
      return {
        title: 'Premium Collection',
        description: 'Curated selection of our finest premium pieces',
        bannerImage: 'https://images.unsplash.com/photo-1769981271695-bb3d766ee419?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: 'Exclusive & Limited Edition'
      }
    }

    // Collaboration sub-categories
    if (path.includes('/disney')) {
      return {
        title: 'Disney x T1',
        description: 'Magical Collection featuring your favorite childhood icons.',
        bannerImage: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: 'Magic Meets Esports'
      }
    }
    if (path.includes('/rinstore-x-goalstudio')) {
      return {
        title: 'Rinstore x Goalstudio',
        description: 'A blend of football culture and athletic esports wear.',
        bannerImage: 'https://images.unsplash.com/photo-1545696563-ab8f3f886f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: 'Live The Goal'
      }
    }
    if (path.includes('/rinstore-x-secretlab')) {
      return {
        title: 'Rinstore x Secretlab',
        description: 'The ultimate seating and lifestyle experience for gamers.',
        bannerImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: 'Premium Seating'
      }
    }
    if (path.includes('/rinstore-x-razer')) {
      return {
        title: 'Rinstore x Razer',
        description: 'Unfair advantage peripherals engineered strictly for winning.',
        bannerImage: 'https://images.unsplash.com/photo-1616421275384-a4871cf65b3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: 'For Gamers. By Gamers.'
      }
    }
    if (path.includes('/collaboration')) {
      return {
        title: 'Collaborations',
        description: 'Exclusive partnerships and special edition drops',
        bannerImage: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: 'Limited Drops'
      }
    }

    // Default
    return {
      title: 'Shop All',
      description: 'Browse our complete catalog of performance-engineered gear and streetwear essentials',
      bannerImage: 'https://images.unsplash.com/photo-1647221598398-944733671239?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      highlight: 'Explore the full T1 collection'
    }
  }

  const pageInfo = getPageInfo()

  const allFiltered = useMemo(() => {
    return getFilteredProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchQuery, location.pathname, priceRange])

  const sortedProducts = useMemo(() => {
    const sorted = [...allFiltered]
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
  }, [allFiltered, sortBy])

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

  const activeFiltersCount = (searchQuery ? 1 : 0) + (priceRange[1] < maxPrice ? 1 : 0)

  const clearAllFilters = () => {
    setSearchQuery('')
    setPriceRange([0, maxPrice])
  }

  return (
    <div className='min-h-screen bg-t1-dark text-t1-text font-inter'>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='relative h-[400px] md:h-[650px] overflow-hidden border-b border-t1-gray/30'
        >
          <div
            className='absolute inset-0 bg-cover bg-center transition-transform duration-1000'
            style={{ backgroundImage: `url('${pageInfo.bannerImage}')` }}
          >
            <div className='absolute inset-0 bg-gradient-to-t from-t1-dark via-t1-dark/40 to-transparent' />
          </div>

          <div className='relative flex h-full max-w-7xl mx-auto flex-col justify-end px-4 pb-16 md:px-10 lg:px-16'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className='max-w-3xl'
            >
              <div className='flex items-center gap-3 mb-6 font-oswald text-[10px] tracking-[0.3em] uppercase text-gray-500'>
                <Link to='/' className='hover:text-t1-red transition-colors'>Home</Link>
                <span>/</span>
                <Link to='/shop' className={`hover:text-t1-red transition-colors ${filter === 'all' ? 'text-t1-red font-bold' : ''}`}>Shop</Link>
                {filter !== 'all' && (
                  <>
                    <span>/</span>
                    <span className='text-t1-red font-bold'>{pageInfo.title}</span>
                  </>
                )}
              </div>

              <div className='inline-block mb-6'>
                <span className='font-oswald text-t1-red font-bold tracking-[0.3em] uppercase text-sm mb-4 block'>
                  {pageInfo.highlight}
                </span>
                <h1 className='text-6xl md:text-9xl font-oswald font-black text-white italic uppercase tracking-tighter leading-none mb-6'>
                  {pageInfo.title.split(' ')[0]} <span className='text-outline-white opacity-20'>{pageInfo.title.split(' ')[1]}</span>
                </h1>
                <div className='h-[4px] w-24 bg-t1-red shadow-[0_0_15px_rgba(226,1,45,0.6)]' />
              </div>

              <p className='text-lg md:text-xl text-gray-400 font-light max-w-xl leading-relaxed italic'>
                {pageInfo.description}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className='max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-12'>

        {/* SHOP TOOLS */}
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 bg-t1-gray/30 p-6 border border-white/5'>
          <ShopSearch value={searchQuery} onChange={setSearchQuery} />

          <div className='flex items-center gap-4 md:gap-8'>
            <div className='flex items-center gap-4 bg-t1-dark/50 px-4 py-2 border border-white/5'>
              <span className='font-oswald text-xs tracking-widest text-gray-500 uppercase'>Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className='bg-t1-dark text-xs font-oswald font-bold tracking-widest text-white focus:outline-none cursor-pointer uppercase'
              >
                <option value='best'>Best Sellers</option>
                <option value='newest'>Newest</option>
                <option value='price-low'>Price: Low to High</option>
                <option value='price-high'>Price: High to Low</option>
                <option value='name-az'>Name: A-Z</option>
              </select>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className='lg:hidden flex items-center gap-2 bg-t1-red px-6 py-2 font-oswald text-xs font-bold tracking-widest uppercase text-white hover:bg-red-700 transition-colors'
            >
              <Filter className='w-4 h-4' />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>
        </div>

        {/* ACTIVE FILTERS CHIPS */}
        <AnimatePresence>
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='flex flex-wrap items-center gap-3 mb-12'
            >
              <span className='text-xs font-oswald font-bold text-gray-500 uppercase tracking-widest mr-2'>Active:</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className='group flex items-center gap-2 bg-white/5 hover:bg-t1-red border border-white/10 hover:border-t1-red px-4 py-1.5 transition-all'
                >
                  <span className='text-[10px] uppercase font-bold text-gray-400 group-hover:text-white'>Search: {searchQuery}</span>
                  <X className='w-3 h-3 text-gray-600 group-hover:text-white' />
                </button>
              )}
              {priceRange[1] < maxPrice && (
                <button
                  onClick={() => setPriceRange([0, maxPrice])}
                  className='group flex items-center gap-2 bg-white/5 hover:bg-t1-red border border-white/10 hover:border-t1-red px-4 py-1.5 transition-all'
                >
                  <span className='text-[10px] uppercase font-bold text-gray-400 group-hover:text-white'>Under ${priceRange[1]}</span>
                  <X className='w-3 h-3 text-gray-600 group-hover:text-white' />
                </button>
              )}
              <button
                onClick={clearAllFilters}
                className='flex items-center gap-2 text-[10px] font-bold text-t1-red hover:text-white uppercase tracking-widest ml-4 transition-colors'
              >
                <Trash2 className='w-3 h-3' />
                Clear All
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='flex gap-12'>
          {/* SIDEBAR */}
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            maxPrice={maxPrice}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          />

          <div className='flex-1'>
            {sortedProducts.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12'>
                <AnimatePresence mode='popLayout'>
                  {visibleProducts.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard
                        {...product}
                        badge={getProductBadge(product)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-3xl'
              >
                <div className='h-20 w-20 bg-t1-gray flex items-center justify-center rounded-full mb-6'>
                  <SlidersHorizontal className='w-10 h-10 text-gray-500' />
                </div>
                <h3 className='font-oswald text-2xl font-bold uppercase italic text-white mb-2'>No match found</h3>
                <p className='text-gray-500 font-inter mb-10'>Try adjusting your filters or search keywords.</p>
                <button
                  onClick={clearAllFilters}
                  className='bg-white text-black font-oswald font-bold text-xs tracking-widest px-10 py-4 uppercase border-2 border-white hover:bg-transparent hover:text-white transition-all'
                >
                  Reset all filters
                </button>
              </motion.div>
            )}

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
    </div>
  )
}

