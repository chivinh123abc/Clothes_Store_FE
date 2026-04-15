/* eslint-disable indent */
import { useMemo, useState } from 'react'
import { ProductCard } from '~/components/Product/ProductCard'
import { motion, AnimatePresence } from 'framer-motion'
import BGImage from '~/assets/Background/T1 Poster.jpg'
import { combinedProducts } from '~/data/products'
import { ShopSearch } from './ShopSearch'
import { ChevronDown, ChevronRight, SlidersHorizontal, Trash2, X } from 'lucide-react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useLanguage } from '~/contexts/LanguageContext'

type FilterType = 'all' | 'best' | 'new' | 'sale' | 'collection' | 'legacy'

type ProductListProps = {
  filter?: FilterType
}

const CATEGORY_FILTERS = [
  { label: 'T-SHIRT', value: 'tshirt' },
  { label: 'SHIRT', value: 'shirt' },
  { label: 'HOODIE', value: 'hoodie' },
  { label: 'SWEATER', value: 'sweater' },
  { label: 'JACKET', value: 'jacket' },
  { label: 'PANTS', value: 'pants' },
  { label: 'SHOES', value: 'shoes' },
  { label: 'HAT', value: 'hat' },
  { label: 'ACCESSORIES', value: 'accessories' },
  { label: 'COLLECTION', value: 'collection' }
]

const LEGACY_TABS = [
  { id: 'worlds-2025', label: 'T1 2025 WORLDS COLLECTION' },
  { id: 'worlds-2024', label: 'T1 2024 WORLDS COLLECTION' },
  { id: 'worlds-2023', label: 'T1 2023 WORLDS COLLECTION' },
  { id: 'apparel', label: 'APPAREL' },
  { id: 'gifts', label: 'GIFTS & ACCESSORIES' }
]

// Full hierarchical shop navigation
type NavItem = { label: string; path: string; children?: NavItem[] }
const SHOP_NAV: NavItem[] = [
  { label: 'ALL', path: '/shop' },
  { label: 'TEAM KIT', path: '/shop/team-kit' },
  {
    label: 'COLLECTION', path: '/shop/collection',
    children: [
      {
        label: 'ESSENTIAL', path: '/shop/collection/essential',
        children: [
          { label: 'GIFT & ACCESSORY', path: '/shop/collection/essential/gift-and-accessory' },
          { label: 'APPAREL', path: '/shop/collection/essential/apparel' }
        ]
      },
      {
        label: 'LEAGUE OF LEGENDS', path: '/shop/collection/league-of-legends',
        children: [
          { label: 'GIFT & ACCESSORY', path: '/shop/collection/league-of-legends/gift-and-accessory' },
          { label: 'APPAREL', path: '/shop/collection/league-of-legends/apparel' }
        ]
      },
      {
        label: 'VALORANT', path: '/shop/collection/valorant',
        children: [
          { label: 'GIFT & ACCESSORY', path: '/shop/collection/valorant/gift-and-accessory' },
          { label: 'APPAREL', path: '/shop/collection/valorant/apparel' }
        ]
      }
    ]
  },
  {
    label: 'COLLABORATION', path: '/shop/collaboration',
    children: [
      { label: 'DISNEY', path: '/shop/collaboration/disney' },
      { label: 'RINSTORE X GOALSTUDIO', path: '/shop/collaboration/rinstore-x-goalstudio' },
      { label: 'RINSTORE X SECRETLAB', path: '/shop/collaboration/rinstore-x-secretlab' },
      { label: 'RINSTORE X RAZER', path: '/shop/collaboration/rinstore-x-razer' }
    ]
  },
  { label: 'SALE', path: '/shop/sale' }
]

// ── Shop nav tree component for the inline filter panel ──
// Top-level items are horizontal chips; clicking a parent expands children vertically below.

function ShopNavLevel({ items, currentPath, level = 0 }: { items: NavItem[]; currentPath: string; level?: number }) {
  // Auto-expand the active parent on this level
  const initialExpanded = items.find(
    item => item.children?.length && item.path !== '/shop' && currentPath.startsWith(item.path)
  )?.path ?? null

  const [expandedPath, setExpandedPath] = useState<string | null>(initialExpanded)
  const { t } = useLanguage()

  const expendedItem = items.find(i => i.path === expandedPath)

  // Map path-based labels to keys
  const getLabelKey = (label: string) => {
    const map: Record<string, string> = {
      'ALL': t('nav.all'),
      'TEAM KIT': t('nav.teamKit'),
      'COLLECTION': t('nav.collection'),
      'ESSENTIAL': t('shop.essential'),
      'LEAGUE OF LEGENDS': 'League of Legends',
      'VALORANT': 'Valorant',
      'GIFT & ACCESSORY': t('categories.gifts'),
      'APPAREL': t('categories.apparel'),
      'COLLABORATION': t('shop.collaboration'),
      'DISNEY': 'Disney',
      'RINSTORE X GOALSTUDIO': 'Rinstore x Goalstudio',
      'RINSTORE X SECRETLAB': 'Rinstore x Secretlab',
      'RINSTORE X RAZER': 'Rinstore x Razer',
      'SALE': t('shop.sale')
    }
    return map[label] || label
  }

  return (
    <div>
      {/* Horizontal chips row */}
      <div className='flex flex-row flex-wrap gap-2'>
        {items.map(item => {
          const isExact = currentPath === item.path
          const isActive = isExact || (item.path !== '/shop' && currentPath.startsWith(item.path))
          const isExpanded = expandedPath === item.path
          const hasChildren = !!(item.children?.length)

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (hasChildren) setExpandedPath(isExpanded ? null : item.path)
              }}
              className={`flex items-center justify-center font-oswald font-bold tracking-[0.15em] uppercase border transition-all duration-200
                ${level === 0 ? 'text-[11px] px-5 py-2 min-w-[120px]' : 'text-[10px] px-4 py-1.5 min-w-[100px]'}
                ${isExact
                  ? 'bg-t1-red border-t1-red text-white'
                  : isActive || isExpanded
                    ? 'border-white/30 text-white'
                    : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                }
              `}
            >
              {getLabelKey(item.label)}
            </Link>
          )
        })}
      </div>

      {/* Children expand vertically below */}
      <AnimatePresence>
        {expendedItem?.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='overflow-hidden'
          >
            <div className='mt-3 pl-3 border-l-2 border-white/10'>
              <ShopNavLevel items={expendedItem.children} currentPath={currentPath} level={level + 1} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ShopNavTree({ items, currentPath }: { items: NavItem[]; currentPath: string }) {
  return <ShopNavLevel items={items} currentPath={currentPath} />
}

// ── Legacy nav tree (same UI as ShopNavLevel, but uses ?sub= query param) ──
function LegacyNavTree({ activeTab }: { activeTab: string | null }) {
  const { t } = useLanguage()
  const currentSub = activeTab
  return (
    <div className='flex flex-row flex-wrap gap-2'>
      <Link
        to='/legacy'
        className={`flex items-center justify-center font-oswald font-bold text-[11px] px-5 py-2 min-w-[100px] tracking-[0.15em] uppercase border transition-all duration-200 ${!currentSub
          ? 'bg-t1-red border-t1-red text-white'
          : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
          }`}
      >
        {t('nav.all')}
      </Link>
      {LEGACY_TABS.map((tab) => {
        const isActive = currentSub === tab.id
        const localizedLabel = tab.id === 'apparel' ? t('categories.apparel') : tab.id === 'gifts' ? t('categories.gifts') : tab.label

        return (
          <Link
            key={tab.id}
            to={`/legacy?sub=${tab.id}`}
            className={`flex items-center justify-center font-oswald font-bold text-[11px] px-5 py-2 min-w-[100px] tracking-[0.15em] uppercase border transition-all duration-200 ${isActive
              ? 'bg-t1-red border-t1-red text-white'
              : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
              }`}
          >
            {localizedLabel}
          </Link>
        )
      })}
    </div>
  )
}

export function ProductList({ filter = 'all' }: ProductListProps) {
  const { t } = useLanguage()
  const [sortBy, setSortBy] = useState('newest')
  const [visibleCount, setVisibleCount] = useState(12)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [categoryFilters, setCategoryFilters] = useState<string[]>([])
  const [searchParams] = useSearchParams()
  // For legacy: legacyTab is read directly from URL, no local state needed
  const legacyTab = filter === 'legacy' ? searchParams.get('sub') : null
  const location = useLocation()
  const navigate = useNavigate()

  // Determine if we are in a 'local category filter' mode (new/best pages)
  const isCategoryMode = filter === 'new' || filter === 'best' || filter === 'legacy'

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
      case 'legacy':
        // Apply legacy tab filter
        if (legacyTab) {
          switch (legacyTab) {
            case 'worlds-2025':
            case 'worlds-2024':
            case 'worlds-2023':
              products = products.filter((p) => ['collection', 'hoodie', 'jacket'].includes(p.category))
              break
            case 'apparel':
              products = products.filter((p) => ['tshirt', 'shirt', 'hoodie', 'sweater', 'jacket', 'pants'].includes(p.category))
              break
            case 'gifts':
              products = products.filter((p) => ['accessories', 'hat', 'shoes'].includes(p.category))
              break
          }
        }
        break
      case 'sale':
        products = products.filter((p) => p.salePrice != null)
        break
    }

    if (isCategoryMode && categoryFilters.length > 0) {
      products = products.filter((p) => categoryFilters.includes(p.category))
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      )
    }

    const path = location.pathname.toLowerCase()

    if (path.includes('/sale')) {
      products = products.filter((p) => p.salePrice != null)
    } else if (path.includes('/team-kit')) {
      products = products.filter((p) => p.category === 'tshirt' || p.category === 'jacket')
    } else if (path.includes('/collection')) {
      if (path.includes('/essential')) {
        if (path.includes('/gift-and-accessory')) {
          products = products.filter((p) => p.category === 'accessories' || p.category === 'hat')
        } else if (path.includes('/apparel')) {
          products = products.filter((p) => ['tshirt', 'hoodie', 'jacket', 'pants'].includes(p.category))
        } else {
          products = products.filter((p) => p.id.includes('1') || p.id.includes('2') || p.category === 'hoodie')
        }
      } else if (path.includes('/league-of-legends')) {
        if (path.includes('/gift-and-accessory')) {
          products = products.filter((p) => p.category === 'accessories' && p.name.toLowerCase().includes('t1'))
        } else if (path.includes('/apparel')) {
          products = products.filter((p) => p.category === 'tshirt' || p.category === 'jacket')
        } else {
          products = products.filter((p) => p.name.toLowerCase().includes('faker') || p.name.toLowerCase().includes('oner') || p.id.includes('3') || p.id.includes('4'))
        }
      } else if (path.includes('/valorant')) {
        if (path.includes('/gift-and-accessory')) {
          products = products.filter((p) => p.category === 'hat' || p.name.toLowerCase().includes('mouse'))
        } else if (path.includes('/apparel')) {
          products = products.filter((p) => p.category === 'pants' || p.category === 'shirt')
        } else {
          products = products.filter((p) => p.id.includes('5') || p.id.includes('6') || p.id.includes('7') || p.category === 'pants')
        }
      } else {
        products = products.filter((p) => p.category === 'collection' || p.category === 'sweater')
      }
    } else if (path.includes('/collaboration')) {
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
        title: t('shop.newArrivals'),
        subtitle: 'Clothes Store',
        bannerImage: 'https://images.unsplash.com/photo-1635650805015-2fa50682873a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: t('shop.freshStyles')
      }
    }
    if (path.includes('/best') || filter === 'best') {
      return {
        title: t('shop.bestSellers'),
        subtitle: 'Clothes Store',
        bannerImage: BGImage,
        highlight: t('shop.topRated')
      }
    }
    if (path.includes('/legacy') || filter === 'legacy') {
      return {
        title: t('shop.legacy'),
        subtitle: 'Clothes Archive',
        bannerImage: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: t('shop.champions')
      }
    }
    if (path.includes('/sale')) {
      return {
        title: t('shop.sale'),
        subtitle: 'Clothes Store',
        bannerImage: 'https://images.unsplash.com/photo-1770362804478-86f1ccc60e7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: t('shop.hotDeals')
      }
    }
    if (path.includes('/team-kit')) {
      return {
        title: t('shop.teamKit'),
        subtitle: 'Clothes Store',
        bannerImage: 'https://images.unsplash.com/photo-1542291026-7eec264c274f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: t('shop.playLikePro')
      }
    }
    if (path.includes('/essential')) {
      return {
        title: `${t('shop.essential')} ${path.includes('/apparel') ? t('categories.apparel') : path.includes('/gift-and-accessory') ? t('categories.gifts') : t('categories.collection')}`,
        subtitle: t('categories.collection'),
        bannerImage: 'https://images.unsplash.com/photo-1556821840-ecc63f93428c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: t('shop.dailyWear')
      }
    }
    if (path.includes('/league-of-legends')) {
      return {
        title: `League of Legends ${path.includes('/apparel') ? t('categories.apparel') : path.includes('/gift-and-accessory') ? t('categories.gifts') : ''}`,
        subtitle: t('categories.collection'),
        bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: t('shop.summonersRift')
      }
    }
    if (path.includes('/valorant')) {
      return {
        title: `Valorant ${path.includes('/apparel') ? t('categories.apparel') : path.includes('/gift-and-accessory') ? t('categories.gifts') : ''}`,
        subtitle: t('categories.collection'),
        bannerImage: 'https://images.unsplash.com/photo-1620803135739-12292f704ec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: t('shop.defyLimits')
      }
    }
    if (path.includes('/collection')) {
      return {
        title: t('shop.premiumCol'),
        subtitle: 'Clothes Store',
        bannerImage: 'https://images.unsplash.com/photo-1769981271695-bb3d766ee419?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: t('shop.exclusive')
      }
    }
    if (path.includes('/disney')) {
      return {
        title: 'Disney x T1',
        subtitle: t('shop.collaboration'),
        bannerImage: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: t('shop.magicMeets')
      }
    }
    if (path.includes('/rinstore-x-goalstudio')) {
      return {
        title: 'Rinstore x Goalstudio',
        subtitle: t('shop.collaboration'),
        bannerImage: 'https://images.unsplash.com/photo-1545696563-ab8f3f886f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: t('shop.liveTheGoal')
      }
    }
    if (path.includes('/rinstore-x-secretlab')) {
      return {
        title: 'Rinstore x Secretlab',
        subtitle: t('shop.collaboration'),
        bannerImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: t('shop.premiumSeating')
      }
    }
    if (path.includes('/rinstore-x-razer')) {
      return {
        title: 'Rinstore x Razer',
        subtitle: t('shop.collaboration'),
        bannerImage: 'https://images.unsplash.com/photo-1616421275384-a4871cf65b3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: t('shop.forGamers')
      }
    }
    if (path.includes('/collaboration')) {
      return {
        title: t('shop.collaboration'),
        subtitle: 'Clothes Store',
        bannerImage: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        highlight: t('shop.limitedDrops')
      }
    }

    return {
      title: 'Shop All',
      subtitle: 'Clothes Store',
      bannerImage: 'https://images.unsplash.com/photo-1647221598398-944733671239?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      highlight: 'Explore the full our collection'
    }
  }

  const pageInfo = getPageInfo()

  const allFiltered = useMemo(() => {
    return getFilteredProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchQuery, location.pathname, priceRange, categoryFilters, isCategoryMode, legacyTab])

  const sortedProducts = useMemo(() => {
    const sorted = [...allFiltered]
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
        break
      case 'price-high':
        sorted.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
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
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }
    return sorted
  }, [allFiltered, sortBy])

  const visibleProducts = useMemo(() => sortedProducts.slice(0, visibleCount), [sortedProducts, visibleCount])

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setVisibleCount(12)
  }

  const getProductBadge = (product: { salePrice?: number; createdAt: string }) => {
    if (product.salePrice) return 'SALE'
    if (isNewProduct(product.createdAt)) return 'NEW'
    return undefined
  }

  const activeFiltersCount = (searchQuery ? 1 : 0) + (priceRange[1] < maxPrice ? 1 : 0) + (isCategoryMode ? categoryFilters.length : 0) + (legacyTab ? 1 : 0)

  const clearAllFilters = () => {
    setSearchQuery('')
    setPriceRange([0, maxPrice])
    setCategoryFilters([])
    if (filter === 'legacy') navigate('/legacy')
  }

  const toggleCategory = (cat: string) => {
    setCategoryFilters(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
    setVisibleCount(12)
  }

  // ── BREADCRUMB (Tracing) ──
  const path = location.pathname.toLowerCase()
  const breadcrumbs: { label: string; href?: string }[] = [{ label: t('footer.home').toUpperCase(), href: '/' }]

  if (filter !== 'all') {
    // Current page (New, Best, Legacy, etc.)
    const pageHref = '/' + filter
    breadcrumbs.push({ label: pageInfo.title, href: (legacyTab || categoryFilters.length > 0) ? pageHref : undefined })

    // Add Legacy Tab to trace
    if (legacyTab) {
      const tabLabel = LEGACY_TABS.find(t => t.id === legacyTab)?.label || legacyTab
      breadcrumbs.push({ label: tabLabel })
    }

    // Add Category Filters to trace (if any)
    if (categoryFilters.length > 0) {
      const catLabels = CATEGORY_FILTERS
        .filter(cf => categoryFilters.includes(cf.value))
        .map(cf => cf.label)
        .join(', ')
      breadcrumbs.push({ label: catLabels })
    }
  } else {
    // Shop hierarchy
    const segments = path.replace('/shop', '').split('/').filter(Boolean)
    breadcrumbs.push({ label: t('nav.shop').toUpperCase(), href: segments.length > 0 ? '/shop' : undefined })

    segments.forEach((seg, i) => {
      const fullPath = '/shop/' + segments.slice(0, i + 1).join('/')
      breadcrumbs.push({
        label: seg.replace(/-/g, ' ').toUpperCase(),
        href: i < segments.length - 1 ? fullPath : undefined
      })
    })
  }

  // Also show search/price if present in the trace?
  // Let's keep it simple for now as requested: "truy dấu" usually means category/navigation path.

  const showBreadcrumb = true // Always show breadcrumb if we are in Shop/Legacy etc.

  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white font-inter'>

      {/* ── HERO BANNER ── */}
      <div className='relative w-full h-[50vh] md:h-[60vh] overflow-hidden bg-black'>
        <img
          src={pageInfo.bannerImage}
          alt={pageInfo.title}
          className='w-full h-full object-cover opacity-50'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent' />
        <div className='absolute inset-0 flex flex-col items-center justify-center text-center px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className='font-oswald text-t1-red font-bold tracking-[0.5em] text-xs uppercase mb-4'>
              {pageInfo.subtitle}
            </p>
            <h1 className='font-oswald font-black text-6xl md:text-8xl text-white uppercase tracking-tighter italic leading-none'>
              {pageInfo.title}
            </h1>
            <p className='font-inter text-gray-400 text-sm mt-4 tracking-widest uppercase'>
              {pageInfo.highlight}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── STICKY TOOLBAR ── */}
      <div className='bg-[#0d0d0d] border-b border-white/5 sticky top-[102px] z-40'>
        <div className='px-4 md:px-10 lg:px-20'>
          <div className='flex items-center justify-between gap-4 min-h-[52px]'>

            {/* Left: Sort */}
            <div className='flex items-center gap-2'>
              <span className='font-oswald text-[10px] tracking-[0.2em] uppercase text-gray-600 whitespace-nowrap'>{t('shop.filter')}</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className='bg-transparent text-[11px] font-oswald font-bold tracking-widest text-white focus:outline-none cursor-pointer uppercase border-0 py-4'
              >
                <option value='best' className='bg-[#0d0d0d]'>{t('sort.best')}</option>
                <option value='newest' className='bg-[#0d0d0d]'>{t('sort.newest')}</option>
                <option value='price-low' className='bg-[#0d0d0d]'>{t('sort.priceLow')}</option>
                <option value='price-high' className='bg-[#0d0d0d]'>{t('sort.priceHigh')}</option>
                <option value='name-az' className='bg-[#0d0d0d]'>{t('sort.nameAZ')}</option>
              </select>
            </div>

            {/* Right: Search + Filter */}
            <div className='flex items-center gap-1'>
              {/* Expanding search */}
              <div className='flex items-center'>
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: '200px', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className='overflow-hidden'
                    >
                      <ShopSearch value={searchQuery} onChange={setSearchQuery} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => { setIsSearchOpen(v => !v); if (isSearchOpen) setSearchQuery('') }}
                  className='px-4 py-4 font-oswald text-[11px] tracking-[0.2em] uppercase text-gray-500 hover:text-white transition-colors whitespace-nowrap'
                >
                  {isSearchOpen ? <X className='w-4 h-4' /> : t('shop.search')}
                </button>
              </div>

              {/* Filter toggle — opens INLINE panel, NOT a modal */}
              <button
                onClick={() => setIsFilterOpen(v => !v)}
                className={`flex items-center gap-2 px-4 py-4 font-oswald font-bold text-[11px] tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-200 border-b-2 ${isFilterOpen || activeFiltersCount > 0
                  ? 'text-t1-red border-t1-red'
                  : 'text-gray-500 border-transparent hover:text-white hover:border-white/20'
                  }`}
              >
                <span>{t('shop.filter')}</span>
                {activeFiltersCount > 0 && <span className='text-t1-red'>({activeFiltersCount})</span>}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ── INLINE FILTER PANEL (expands below toolbar) ── */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className='overflow-hidden border-t border-white/5'
            >
              <div className='px-4 md:px-10 lg:px-20 py-6 bg-[#0d0d0d]'>
                <div className='flex flex-col lg:flex-row gap-8'>

                  {/* Category section */}
                  <div className='flex-1'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='font-oswald text-[10px] tracking-[0.3em] text-gray-600 uppercase'>
                        {isCategoryMode ? t('shop.category') : t('shop.browse')}
                      </h3>
                      {isCategoryMode && categoryFilters.length > 0 && (
                        <button
                          onClick={() => { setCategoryFilters([]); setVisibleCount(12) }}
                          className='font-oswald text-[10px] tracking-widest uppercase text-t1-red hover:text-white transition-colors'
                        >
                          {t('shop.clearAll')}
                        </button>
                      )}
                    </div>

                    {filter === 'legacy' ? (
                      /* Legacy nav — same UI as Shop, URL-driven via ?sub= */
                      <LegacyNavTree activeTab={legacyTab} />
                    ) : isCategoryMode ? (
                      /* Category chips for best/new pages */
                      <div className='flex flex-wrap gap-2'>
                        {CATEGORY_FILTERS.map((cat) => {
                          const isActive = categoryFilters.includes(cat.value)
                          return (
                            <button
                              key={cat.value}
                              onClick={() => toggleCategory(cat.value)}
                              className={`flex items-center justify-center font-oswald font-bold text-[11px] px-5 py-2 min-w-[120px] tracking-[0.15em] uppercase border transition-all duration-200 ${isActive
                                ? 'bg-t1-red border-t1-red text-white'
                                : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                                }`}
                            >
                              {t(`categories.${cat.value}`)}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      /* Shop nav — full hierarchy, no auto-close */
                      <ShopNavTree items={SHOP_NAV} currentPath={path} />
                    )}
                  </div>

                  {/* Price range */}
                  <div className='lg:w-64'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='font-oswald text-[10px] tracking-[0.3em] text-gray-600 uppercase'>{t('shop.priceRange')}</h3>
                      <span className='font-oswald text-[10px] font-bold text-t1-red'>{t('shop.upTo')} ${priceRange[1]}</span>
                    </div>
                    <input
                      type='range'
                      min='0'
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className='w-full h-[2px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-t1-red'
                    />
                    <div className='flex justify-between mt-2'>
                      <span className='font-oswald text-[10px] text-gray-600'>$0</span>
                      <span className='font-oswald text-[10px] text-gray-600'>${maxPrice}</span>
                    </div>
                  </div>

                  {/* Reset */}
                  {activeFiltersCount > 0 && (
                    <div className='flex items-end lg:items-start'>
                      <button
                        onClick={clearAllFilters}
                        className='flex items-center gap-2 font-oswald font-bold text-[10px] tracking-widest uppercase text-gray-500 hover:text-t1-red transition-colors'
                      >
                        <Trash2 className='w-3 h-3' />
                        {t('shop.clearAll')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── BREADCRUMB ── */}
      <AnimatePresence>
        {showBreadcrumb && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className='overflow-hidden'
          >
            <div className='px-4 md:px-10 lg:px-20 py-3 bg-[#0a0a0a] border-b border-white/5'>
              <div className='flex items-center justify-between gap-4 flex-wrap'>
                {/* Trace path */}
                <div className='flex items-center gap-2 font-oswald font-bold text-[10px] tracking-[0.2em] uppercase flex-wrap'>
                  {breadcrumbs.map((crumb, i) => (
                    <span key={i} className='flex items-center gap-2'>
                      {i > 0 && <ChevronRight size={10} className='text-gray-600' />}
                      {crumb.href ? (
                        <Link to={crumb.href} className='text-gray-500 hover:text-white transition-colors'>
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className='text-t1-red'>{crumb.label}</span>
                      )}
                    </span>
                  ))}

                  {/* Append metadata filters like Search/Price if they aren't in breadcrumbs but active */}
                  {searchQuery && (
                    <span className='flex items-center gap-2 text-gray-600'>
                      <ChevronRight size={10} />
                      <span className='text-white/40 italic lowercase font-inter tracking-normal'>search: "{searchQuery}"</span>
                    </span>
                  )}
                </div>

                {/* Quick actions for filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className='flex items-center gap-1 text-[10px] font-oswald font-bold text-t1-red hover:text-white uppercase tracking-widest transition-colors'
                  >
                    <Trash2 className='w-3 h-3' />
                    {t('shop.clearAll')}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REMOVED ACTIVE FILTER CHIPS - Moved to Trace bar above */}

      {/* ── PRODUCT GRID ── */}
      <div className='px-4 md:px-10 lg:px-20 py-12'>
        <div className='flex items-center justify-between mb-8'>
          <p className='font-oswald text-gray-500 text-xs tracking-widest uppercase'>
            {sortedProducts.length} {t('shop.products')}
          </p>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className='font-oswald font-bold text-[10px] tracking-widest uppercase text-gray-600 hover:text-t1-red transition-colors'
            >
              Clear Filter ×
            </button>
          )}
        </div>

        <AnimatePresence mode='wait'>
          <motion.div
            key={`${filter}-${sortBy}-${location.pathname}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6'
          >
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                badge={getProductBadge(product)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {sortedProducts.length === 0 && (
          <div className='flex flex-col items-center justify-center py-32 text-center'>
            <SlidersHorizontal className='w-10 h-10 text-gray-700 mb-6' />
            <p className='font-oswald text-2xl text-gray-700 uppercase tracking-widest mb-4'>
              No Products Found
            </p>
            <button
              onClick={clearAllFilters}
              className='font-oswald font-bold text-xs tracking-widest uppercase text-t1-red hover:text-white transition-colors border border-t1-red/30 hover:border-t1-red px-6 py-3'
            >
              Reset Filters
            </button>
          </div>
        )}

        {visibleCount < sortedProducts.length && (
          <div className='mt-16 flex justify-center'>
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className='px-12 py-4 border border-white/10 text-gray-500 font-oswald font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:border-t1-red hover:text-t1-red'
            >
              SEE MORE +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
