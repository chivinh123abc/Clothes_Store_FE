import { useEffect, useState, useMemo, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Edit2,
  Trash2,
  Plus,
  ExternalLink,
  Search,
  ShoppingBag,
  Filter,
  X
} from 'lucide-react'
import productApi from '~/apis/productApi'
import type { Product } from '~/types/product'
import categoryApi from '~/apis/categoriesApi'
import collectionApi from '~/apis/collectionApi'
import type { Category } from '~/apis/categoriesApi'
import type { Collection } from '~/types/collection'
import { useToast } from '~/contexts/ToastContext'
import ConfirmModal from '~/components/ui/ConfirmModal'
import { useLanguage } from '~/contexts/LanguageContext'
import { formatPrice } from '~/utils/format'

const AdminProductList = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const { showToast } = useToast()

  const categoryFilterId = searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : null
  const collectionFilterId = searchParams.get('collection_id') ? parseInt(searchParams.get('collection_id')!) : null
  const statusFilter = searchParams.get('status') || null
  const { language } = useLanguage()

  // Helper to format price range with active language
  const getPriceDisplay = (product: Product) => {
    if (!product.items || product.items.length === 0) return 'N/A'
    const prices = product.items.map(item => item.product_item_price)
    const salePrices = product.items.map(item => item.sale_price || item.product_item_price)
    
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const minSalePrice = Math.min(...salePrices)
    const maxSalePrice = Math.max(...salePrices)

    const hasSale = product.items.some(item => item.sale_price !== null && item.sale_price !== undefined)

    if (hasSale) {
      return (
        <div className="flex flex-col">
          <span className="font-oswald font-black text-t1-red italic text-sm">
            {minSalePrice === maxSalePrice 
              ? formatPrice(minSalePrice, language) 
              : `${formatPrice(minSalePrice, language)} - ${formatPrice(maxSalePrice, language)}`}
          </span>
          <span className="text-[10px] text-gray-500 line-through">
            {minPrice === maxPrice 
              ? formatPrice(minPrice, language) 
              : `${formatPrice(minPrice, language)} - ${formatPrice(maxPrice, language)}`}
          </span>
        </div>
      )
    }

    return (
      <span className="font-oswald text-gray-300 text-sm">
        {minPrice === maxPrice 
          ? formatPrice(minPrice, language) 
          : `${formatPrice(minPrice, language)} - ${formatPrice(maxPrice, language)}`}
      </span>
    )
  }

  // Helper to render Stock & Status badges
  const getStockStatus = (product: Product) => {
    if (!product.items || product.items.length === 0) {
      return (
        <span className="text-[10px] font-oswald font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
          No Variants
        </span>
      )
    }

    const totalStock = product.items.reduce((sum, item) => sum + (item.stock_quantity || 0), 0)

    if (totalStock === 0) {
      return (
        <div className="flex flex-col gap-1 items-start">
          <span className="text-[10px] font-oswald font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20">
            Out Of Stock
          </span>
          <span className="text-[10px] text-gray-500 font-oswald uppercase tracking-widest">Qty: 0</span>
        </div>
      )
    }

    if (totalStock <= 10) {
      return (
        <div className="flex flex-col gap-1 items-start">
          <span className="text-[10px] font-oswald font-bold uppercase tracking-widest text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded border border-yellow-500/20">
            Low Stock
          </span>
          <span className="text-[10px] text-gray-400 font-oswald uppercase tracking-widest">Qty: {totalStock}</span>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-1 items-start">
        <span className="text-[10px] font-oswald font-bold uppercase tracking-widest text-green-500 bg-green-500/10 px-2.5 py-1 rounded border border-green-500/20">
          In Stock
        </span>
        <span className="text-[10px] text-gray-400 font-oswald uppercase tracking-widest">Qty: {totalStock}</span>
      </div>
    )
  }

  // Helper to render discount badge
  const getDiscountBadge = (product: Product) => {
    if (!product.items || product.items.length === 0) return null
    
    const discounts = product.items
      .map(item => item.discount_percent)
      .filter((pct): pct is number => pct !== null && pct !== undefined && pct > 0)
    
    if (discounts.length > 0) {
      const maxDiscount = Math.max(...discounts)
      return (
        <span className="text-[10px] font-oswald font-bold uppercase tracking-widest text-t1-red bg-t1-red/10 px-2.5 py-1 rounded-lg border border-t1-red/20 animate-pulse">
          Sale -{maxDiscount}%
        </span>
      )
    }

    return (
      <span className="text-[10px] font-oswald font-bold uppercase tracking-widest text-gray-600 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
        No Sale
      </span>
    )
  }

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [prodRes, catRes, colRes] = await Promise.all([
        productApi.getAll(),
        categoryApi.getCategories(),
        collectionApi.getAll()
      ])
      setProducts(prodRes.data)
      setCategories(catRes.data)
      setCollections(colRes.data)
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch admin data', error)
      const errorMsg = error.response?.data?.message || error.message
      showToast(`Failed to load products/filters: ${errorMsg}`, 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDelete = async () => {
    if (!productToDelete) return
    try {
      await productApi.delete(productToDelete)
      showToast('Product deleted successfully', 'success')
      fetchData()
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete product', error)
      showToast('Failed to delete product', 'error')
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const hasMatchingSku = p.items?.some(item => item.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesSearch = p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.product_slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hasMatchingSku || false)

      const matchesCategory = categoryFilterId ? p.category_id === categoryFilterId : true
      const matchesCollection = collectionFilterId ? p.collections?.some(c => c.collection_id === collectionFilterId) : true

      const totalStock = p.items?.reduce((sum, item) => sum + (item.stock_quantity || 0), 0) || 0
      const hasDiscount = p.items?.some(item => item.discount_percent !== null && item.discount_percent !== undefined) || false

      let matchesStatus = true
      if (statusFilter === 'in_stock') {
        matchesStatus = totalStock > 10
      } else if (statusFilter === 'low_stock') {
        matchesStatus = totalStock > 0 && totalStock <= 10
      } else if (statusFilter === 'out_of_stock') {
        matchesStatus = totalStock === 0
      } else if (statusFilter === 'on_sale') {
        matchesStatus = hasDiscount
      }

      return matchesSearch && matchesCategory && matchesCollection && matchesStatus
    })
  }, [products, searchTerm, categoryFilterId, collectionFilterId, statusFilter])

  const setFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchParams({})
    setSearchTerm('')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-t1-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ConfirmModal
        isOpen={productToDelete !== null}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone and will remove the product from all collections."
        confirmText="Delete Product"
        onConfirm={handleDelete}
        onClose={() => setProductToDelete(null)}
        type="danger"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-t1-red focus:outline-none transition-colors"
            />
          </div>

          {/* Filters Tray */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-gray-500">
              <Filter size={14} />
            </div>

            {/* Category Dropdown */}
            <select
              value={categoryFilterId || ''}
              onChange={(e) => setFilter('category_id', e.target.value)}
              className="bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-xs font-oswald uppercase tracking-widest focus:border-t1-red focus:outline-none transition-colors min-w-[140px]"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>
                  {(cat.category_name || 'Unknown').toUpperCase()}
                </option>
              ))}
            </select>

            {/* Collection Dropdown */}
            <select
              value={collectionFilterId || ''}
              onChange={(e) => setFilter('collection_id', e.target.value)}
              className="bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-xs font-oswald uppercase tracking-widest focus:border-t1-red focus:outline-none transition-colors min-w-[140px]"
            >
              <option value="">All Collections</option>
              {collections.map(col => (
                <option key={col.collection_id} value={col.collection_id}>
                  {(col.collection_name || 'Unknown').toUpperCase()}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={statusFilter || ''}
              onChange={(e) => setFilter('status', e.target.value)}
              className="bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-xs font-oswald uppercase tracking-widest focus:border-t1-red focus:outline-none transition-colors min-w-[140px]"
            >
              <option value="">All Statuses</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="on_sale">On Sale</option>
            </select>

            {/* Reset */}
            {(categoryFilterId || collectionFilterId || statusFilter || searchTerm) && (
              <button
                onClick={clearFilters}
                className="p-3 text-gray-500 hover:text-t1-red transition-colors"
                title="Clear all filters"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <Link
          to="/admin/products/add"
          className="flex items-center justify-center gap-2 bg-t1-red hover:bg-red-700 text-white px-6 py-3 rounded-xl font-oswald font-bold uppercase tracking-widest text-xs transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500">Product</th>
                <th className="px-6 py-4 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500">Category</th>
                <th className="px-6 py-4 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500">Pricing</th>
                <th className="px-6 py-4 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500">Stock & Status</th>
                <th className="px-6 py-4 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500">Discount</th>
                <th className="px-6 py-4 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500">Created At</th>
                <th className="px-6 py-4 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <tr key={product.product_id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center font-bold text-gray-400 overflow-hidden border border-white/5">
                        {product.items?.[0]?.product_item_image ? (
                          <img
                            src={product.items[0].product_item_image}
                            alt={product.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          product.product_name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm group-hover:text-t1-red transition-colors">{product.product_name}</p>
                        <p className="text-[10px] text-gray-500 font-oswald uppercase tracking-widest">{product.product_slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400 font-oswald uppercase tracking-widest">
                      {product.category_name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getPriceDisplay(product)}
                  </td>
                  <td className="px-6 py-4">
                    {getStockStatus(product)}
                  </td>
                  <td className="px-6 py-4">
                    {getDiscountBadge(product)}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(product.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/product/${product.product_id}`}
                        target="_blank"
                        className="p-2 text-gray-500 hover:text-white transition-colors"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <Link
                        to={`/admin/products/edit/${product.product_id}`}
                        className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => setProductToDelete(product.product_id)}
                        className="p-2 text-gray-500 hover:text-t1-red transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <ShoppingBag size={48} className="mx-auto text-gray-800 mb-4" />
            <p className="font-oswald font-bold text-gray-600 uppercase tracking-widest">No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProductList
