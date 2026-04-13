/* eslint-disable indent */
import { useMemo, useState } from 'react'
import { ProductCard } from '~/components/Product/ProductCard'
import { motion } from 'motion/react'
import BGImage from '~/assets/Background/T1 Poster.jpg'

type FilterType = 'all' | 'best' | 'new' | 'sale' | 'collection';

type ProductListProps = {
  filter?: FilterType;
};
export function ProductList({ filter = 'all' }: ProductListProps) {
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const NEW_PRODUCT_DAYS = 7

  // type Product = {
  //   id: string;
  //   name: string;
  //   price: number;
  //   salePrice?: number;
  //   image: string;
  //   category: string;
  //   bestseller: boolean;
  //   createdAt: string;
  //   soldOut: boolean;
  // };

  const allProducts = [
    {
      id: '1',
      name: 'Essential Black Hoodie',
      price: 89.99,
      image:
        'https://images.unsplash.com/photo-1644483878398-b57d19f84ff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      category: 'hoodie',
      bestseller: false,
      createdAt: '2026-03-29',
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
      createdAt: '2026-03-27',
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
      createdAt: '2026-03-10',
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
      createdAt: '2026-03-30',
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
    }
  ]
  const getFilteredProducts = () => {
    switch (filter) {
      case 'new':
        return allProducts.filter((p) => isNewProduct(p.createdAt))
      case 'best':
        return allProducts.filter((p) => p.bestseller)
      case 'collection':
        return allProducts.filter((p) => p.category === 'collection')
      case 'sale':
        return allProducts.filter((p) => p.salePrice != null)
      default:
        return allProducts
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

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedProducts.slice(start, start + itemsPerPage)
  }, [sortedProducts, currentPage])

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const isNewProduct = (createdAt: string) => {
    const createdDate = new Date(createdAt)
    const now = new Date()
    const diffTime = now.getTime() - createdDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    return diffDays <= NEW_PRODUCT_DAYS
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
    <div className="min-h-screen bg-white">
      {filter !== 'all' && (
        <div className="relative h-[500px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${pageInfo.bannerImage}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/60" />
          </div>

          <div className="relative flex h-full max-w-[1440px] mx-auto flex-col justify-end px-4 pb-16 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="group inline-block">
                <h1 className="mb-4 text-5xl text-white transition-colors duration-300 group-hover:text-red-500">
                  {pageInfo.title}
                </h1>
                <div className="h-[2px] w-0 bg-red-500 transition-all duration-500 group-hover:w-full" />
              </div>

              <p className="text-xl text-gray-300 transition-colors duration-300 hover:text-red-400">
                {pageInfo.description}
              </p>

              <div className="mt-8 flex items-center gap-4">
                <span className="text-sm text-gray-400 transition-colors duration-300 hover:text-red-400">
                  {sortedProducts.length} Products Available
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
        {filter === 'all' && (
          <div className="mb-8">
            <h1 className="mb-2">{pageInfo.title}</h1>
            <p className="text-gray-600">{pageInfo.description}</p>
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-500">{sortedProducts.length} items found</p>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-gray-500">
              Page {currentPage} / {totalPages || 1}
            </p>

            <div className="flex items-center gap-2 relative z-10">
              <span className="text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="relative z-10 px-4 py-2 border border-gray-300 rounded bg-white"
              >
                <option value="best">Best Sellers</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                badge={getProductBadge(product)}
              />
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1
              const isActive = page === currentPage

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded border transition-colors ${isActive
                    ? 'bg-black text-white border-black'
                    : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              )
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
