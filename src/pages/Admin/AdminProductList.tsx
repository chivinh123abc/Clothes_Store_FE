import { useEffect, useState, useMemo } from 'react'
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

const AdminProductList = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryFilterId = searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : null
  const collectionFilterId = searchParams.get('collection_id') ? parseInt(searchParams.get('collection_id')!) : null

  const fetchData = async () => {
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
    } catch (error) {
      console.error('Failed to fetch admin data', error)
      alert('Failed to load products/filters')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.delete(id)
        alert('Product deleted successfully')
        fetchData()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to delete product', error)
        alert('Failed to delete product')
      }
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category_name?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilterId ? p.category_id === categoryFilterId : true
      const matchesCollection = collectionFilterId ? p.collections?.some(c => c.collection_id === collectionFilterId) : true

      return matchesSearch && matchesCategory && matchesCollection
    })
  }, [products, searchTerm, categoryFilterId, collectionFilterId])

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
          <div className="flex items-center gap-2">
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
                  {cat.category_name.toUpperCase()}
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
                  {col.collection_name.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Reset */}
            {(categoryFilterId || collectionFilterId || searchTerm) && (
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
                <th className="px-6 py-4 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500">Created At</th>
                <th className="px-6 py-4 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <tr key={product.product_id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center font-bold text-gray-700">
                        {product.product_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm group-hover:text-t1-red transition-colors">{product.product_name}</p>
                        <p className="text-[10px] text-gray-500 font-oswald uppercase tracking-widest">{product.product_slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400 font-oswald uppercase tracking-widest">
                      {product.category_name}
                    </span>
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
                        onClick={() => handleDelete(product.product_id)}
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
