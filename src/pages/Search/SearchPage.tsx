import { useSearchParams, Link } from 'react-router-dom'
import { useMemo, useState, useEffect, type FormEvent, type MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown, History, TrendingUp } from 'lucide-react'
import Layout from '~/components/layout/Layout'
import Footer from '~/components/layout/Footer'
import { combinedProducts } from '~/data/products'
import type { Product } from '~/types/product'
import { useLanguage } from '~/contexts/LanguageContext'

const CATEGORIES = ['All', 'tshirt', 'hoodie', 'jacket', 'pants', 'sweater', 'shirt', 'shoes', 'hat', 'accessories', 'collection']
const SORT_KEY_MAP: Record<string, string> = {
  'relevant': 'sort.relevant',
  'price-asc': 'sort.priceLow',
  'price-desc': 'sort.priceHigh',
  'newest': 'sort.newest',
  'bestseller': 'sort.bestseller'
}

const POPULAR_SEARCHES = ['Premium', 'Winter Jacket', 'Champion Hoodie', 'Oversized', 'Cotton', 'Limited Edition']

function highlightMatch(text: string, query: string) {
  if (!query) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className='bg-t1-red/30 text-white rounded-sm px-0.5'>{part}</mark> : part
  )
}

function scoreProduct(product: Product, query: string): number {
  const q = query.toLowerCase()
  let score = 0
  if (product.name.toLowerCase().includes(q)) score += 10
  if (product.name.toLowerCase().startsWith(q)) score += 5
  if (product.category.toLowerCase().includes(q)) score += 4
  if (product.description?.toLowerCase().includes(q)) score += 2
  if (product.bestseller) score += 1
  return score
}

export default function SearchPage() {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [localQuery, setLocalQuery] = useState(query)
  const [prevQuery, setPrevQuery] = useState(query)
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('relevant')
  const [showFilters, setShowFilters] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recent_searches')
    return saved ? JSON.parse(saved) : []
  })

  // Derive state from props (URL query) to avoid cascading renders in useEffect
  if (query !== prevQuery) {
    setPrevQuery(query)
    setLocalQuery(query)
  }

  const saveRecentSearch = (q: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== q.toLowerCase())
      const updated = [q, ...filtered].slice(0, 5)
      localStorage.setItem('recent_searches', JSON.stringify(updated))
      return updated
    })
  }

  // Handle saving search term separately - using a timeout to avoid cascading render warning in ESLint
  useEffect(() => {
    if (query.trim()) {
      const timer = setTimeout(() => {
        saveRecentSearch(query.trim())
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [query])

  const removeRecentSearch = (q: string, e: MouseEvent) => {
    e.stopPropagation()
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== q)
      localStorage.setItem('recent_searches', JSON.stringify(updated))
      return updated
    })
  }

  const results = useMemo(() => {
    let list = combinedProducts

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory)
    }

    // Sort
    switch (sortBy) {
    case 'price-asc':
      return [...list].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
    case 'price-desc':
      return [...list].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
    case 'newest':
      return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'bestseller':
      return [...list].sort((a, b) => Number(b.bestseller) - Number(a.bestseller))
    default:
      return query.trim() ? [...list].sort((a, b) => scoreProduct(b, query) - scoreProduct(a, query)) : list
    }
  }, [query, activeCategory, sortBy])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (localQuery.trim()) setSearchParams({ q: localQuery.trim() })
  }

  return (
    <Layout footer={<Footer />}>
      <div className='min-h-screen bg-[#0a0a0a] text-white pt-4 pb-20'>

        {/* Search Hero */}
        <div className='bg-gradient-to-b from-[#111] to-[#0a0a0a] border-b border-white/5 py-10 px-4 md:px-10 lg:px-20'>
          <div className='max-w-3xl mx-auto'>
            <p className='text-gray-600 text-[11px] font-oswald tracking-[0.3em] uppercase mb-4'>{t('search.engine')}</p>
            <form onSubmit={handleSearch} className='flex gap-0 shadow-2xl'>
              <div className='flex-1 relative'>
                <Search size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-600' />
                <input
                  autoFocus
                  type='text'
                  value={localQuery}
                  onChange={e => setLocalQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className='w-full bg-[#111] border border-white/10 border-r-0 py-4 pl-11 pr-4 text-sm text-white font-inter outline-none focus:border-t1-red transition-all placeholder:text-gray-700'
                />
                {localQuery && (
                  <button type='button' onClick={() => { setLocalQuery(''); setSearchParams({}) }} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white'>
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                type='submit'
                className='bg-t1-red text-white font-oswald font-black text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-white hover:text-black transition-all duration-200 shrink-0'
              >
                {t('common.search')}
              </button>
            </form>

            {/* Recent & Popular */}
            {!query && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-8'
              >
                {recentSearches.length > 0 && (
                  <div>
                    <h4 className='font-oswald text-[10px] text-gray-600 tracking-[0.2em] uppercase mb-4 flex items-center gap-2'>
                      <History size={12} /> {t('common.recentSearches')}
                    </h4>
                    <div className='flex flex-col gap-2'>
                      {recentSearches.map(s => (
                        <div
                          key={s}
                          onClick={() => setSearchParams({ q: s })}
                          className='group flex items-center justify-between bg-white/5 border border-white/5 px-4 py-2 hover:border-t1-red/30 cursor-pointer transition-all'
                        >
                          <span className='text-xs text-gray-400 group-hover:text-white'>{s}</span>
                          <button onClick={(e) => removeRecentSearch(s, e)} className='text-gray-700 hover:text-t1-red'>
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h4 className='font-oswald text-[10px] text-gray-600 tracking-[0.2em] uppercase mb-4 flex items-center gap-2'>
                    <TrendingUp size={12} /> {t('common.popularSearches')}
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {POPULAR_SEARCHES.map(s => (
                      <button
                        key={s}
                        onClick={() => setSearchParams({ q: s })}
                        className='text-[10px] font-oswald font-bold tracking-widest uppercase px-3 py-1.5 bg-white/5 border border-white/5 text-gray-500 hover:border-t1-red hover:text-t1-red transition-all'
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className='px-4 md:px-10 lg:px-20 max-w-7xl mx-auto mt-8'>
          {query && (
            <>
              {/* Toolbar */}
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
                <div className='flex items-center gap-4'>
                  <p className='text-sm font-inter text-gray-400'>
                    <span className='text-white font-bold'>{results.length}</span> {t('common.itemsFound')}
                    <span className='hidden sm:inline'> {t('search.resultsFor')}</span>&nbsp;
                    <span className='text-t1-red font-bold italic'>"{query}"</span>
                  </p>
                </div>

                <div className='flex gap-3 items-center'>
                  <button
                    onClick={() => setShowFilters(v => !v)}
                    className={`flex items-center gap-2 text-[11px] font-oswald font-bold tracking-widest uppercase px-4 py-2 border transition-all duration-200 ${showFilters ? 'bg-t1-red border-t1-red text-white' : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'}`}
                  >
                    <SlidersHorizontal size={12} /> {t('search.filters')}
                  </button>

                  <div className='relative'>
                    <button
                      onClick={() => setSortOpen(v => !v)}
                      className='flex items-center gap-2 text-[11px] font-oswald font-bold tracking-widest uppercase px-4 py-2 border border-white/10 text-gray-500 hover:border-white/30 hover:text-white transition-all duration-200'
                    >
                      {t(SORT_KEY_MAP[sortBy])}
                      <ChevronDown size={12} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {sortOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className='absolute right-0 top-full mt-2 bg-[#111] border border-white/10 z-50 min-w-[180px] shadow-2xl'
                        >
                          {Object.entries(SORT_KEY_MAP).map(([val, key]) => (
                            <button
                              key={val}
                              onClick={() => { setSortBy(val); setSortOpen(false) }}
                              className={`w-full text-left px-4 py-3 text-[11px] font-oswald font-bold tracking-widest uppercase transition-colors ${sortBy === val ? 'text-t1-red bg-t1-red/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                              {t(key)}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className='overflow-hidden'
                  >
                    <div className='bg-[#111] border border-white/5 p-5 mb-6'>
                      <p className='text-[10px] font-oswald font-bold text-gray-600 tracking-[0.3em] uppercase mb-3'>Category</p>
                      <div className='flex flex-wrap gap-2'>
                        {CATEGORIES.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`text-[10px] font-oswald font-bold tracking-widest uppercase px-3 py-1.5 transition-all duration-200 ${activeCategory === cat ? 'bg-t1-red text-white shadow-[0_0_15px_rgba(226,1,45,0.3)]' : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'}`}
                          >
                            {cat === 'All' ? t('nav.all') : t(`nav.${cat.toLowerCase()}`)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Grid */}
              {results.length === 0 ? (
                <div className='py-32 text-center border border-white/5 bg-[#111]'>
                  <Search size={48} className='text-gray-700 mx-auto mb-5' />
                  <p className='font-oswald font-black text-2xl text-gray-600 uppercase tracking-widest mb-2'>{t('common.noResults')}</p>
                  <p className='text-gray-700 text-sm font-inter mb-6'>{t('common.noResults')} "{query}".</p>
                  <div className='flex flex-wrap gap-2 justify-center'>
                    <button onClick={() => { setLocalQuery(''); setSearchParams({}) }} className='text-[11px] border border-white/10 text-gray-500 hover:text-white hover:border-white/30 font-oswald uppercase tracking-widest px-4 py-2 transition-colors'>
                      {t('common.clear')}
                    </button>
                    <Link to='/shop' className='text-[11px] bg-t1-red text-white font-oswald font-bold uppercase tracking-widest px-6 py-2 hover:bg-white hover:text-black transition-all'>
                      {t('common.browseAll')}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                  {results.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.5) }}
                      className='group bg-[#111] border border-white/5 hover:border-t1-red/30 transition-all duration-300 overflow-hidden'
                    >
                      <Link to={`/product/${product.id}`} className='block relative overflow-hidden bg-[#0d0d0d] aspect-square'>
                        <img
                          src={product.image}
                          alt={product.name}
                          className='w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500'
                        />
                        {product.soldOut && (
                          <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
                            <span className='font-oswald font-black text-xs tracking-widest text-white/60 uppercase border border-white/20 px-3 py-1'>Sold Out</span>
                          </div>
                        )}
                        {product.salePrice && !product.soldOut && (
                          <div className='absolute top-2 left-2 bg-t1-red text-white text-[9px] font-oswald font-bold px-2 py-0.5 tracking-widest'>SALE</div>
                        )}
                        {product.bestseller && !product.soldOut && (
                          <div className='absolute top-2 right-2 bg-white/10 backdrop-blur-sm text-white text-[9px] font-oswald font-bold px-2 py-0.5 tracking-widest border border-white/10'>BEST</div>
                        )}
                      </Link>
                      <div className='p-3'>
                        <p className='font-inter text-xs text-white leading-snug mb-1 line-clamp-2 group-hover:text-gray-100'>
                          {query ? highlightMatch(product.name, query) : product.name}
                        </p>
                        <p className='text-[10px] text-gray-600 uppercase tracking-widest mb-2'>{product.category}</p>
                        <div className='flex items-center gap-2'>
                          {product.salePrice ? (
                            <>
                              <span className='font-oswald font-bold text-sm text-t1-red'>${product.salePrice.toFixed(2)}</span>
                              <span className='font-oswald text-xs text-gray-600 line-through'>${product.price.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className='font-oswald font-bold text-sm text-white'>${product.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
