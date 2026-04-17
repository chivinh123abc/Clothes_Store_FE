/* eslint-disable indent */
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, X, Package, Type, FileText, Layers, Grid, Plus, Trash2 } from 'lucide-react'
import productApi from '~/apis/productApi'
import categoryApi from '~/apis/categoriesApi'
import type { Category } from '~/apis/categoriesApi'
import collectionApi from '~/apis/collectionApi'
import type { Collection } from '~/types/collection'
import discountApi from '~/apis/discountApi'
import type { Discount } from '~/apis/discountApi'
import { motion, AnimatePresence } from 'framer-motion'

const AdminProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [categories, setCategories] = useState<Category[]>([])
  const [allCollections, setAllCollections] = useState<Collection[]>([])
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'variants'>('info')

  const [formData, setFormData] = useState({
    product_name: '',
    category_id: 0,
    product_slug: '',
    product_description: '',
    collection_ids: [] as number[],
    items: [] as any[] // For variants
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, colsRes, discRes, productRes] = await Promise.all([
          categoryApi.getCategories(),
          collectionApi.getAll(),
          discountApi.getAll(),
          isEdit ? productApi.getById(Number(id)) : Promise.resolve(null)
        ])

        setCategories(catsRes.data)
        setAllCollections(colsRes.data)
        setDiscounts(discRes.data)

        if (productRes) {
          const product = productRes.data
          setFormData({
            product_name: product.product_name,
            category_id: product.category_id || 0,
            product_slug: product.product_slug,
            product_description: product.product_description || '',
            collection_ids: product.collections?.map((c: any) => c.collection_id) || [],
            items: product.items || []
          })
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch data', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.product_name || !formData.category_id) {
      alert('Please fill in all required fields')
      return
    }

    if (formData.items.length === 0) {
      alert('Please add at least one variant')
      setActiveTab('variants')
      return
    }

    setSaving(true)
    try {
      if (isEdit) {
        await productApi.update(Number(id), formData)
        alert('Product updated successfully')
      } else {
        await productApi.create(formData)
        alert('Product created successfully')
      }
      navigate('/admin/products')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save product', error)
      alert('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-t1-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-oswald text-[10px] uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={14} />
          Back to List
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden"
      >
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-oswald font-black italic text-2xl uppercase tracking-tight">
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="text-gray-500 text-xs mt-1 font-oswald uppercase tracking-widest">
                {isEdit ? 'Update product details and variants' : 'Create a new product entity'}
              </p>
            </div>

            <div className="flex bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-2 rounded-lg font-oswald text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === 'info' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab('variants')}
                className={`px-6 py-2 rounded-lg font-oswald text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === 'variants' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
              >
                Variants ({formData.items.length})
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          <AnimatePresence mode="wait">
            {activeTab === 'info' ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Product Name */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">
                      <Type size={12} className="text-t1-red" />
                      Product Name <span className="text-t1-red">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.product_name}
                      onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                      placeholder="e.g. Essential Black Hoodie"
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-4 focus:border-t1-red focus:outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">
                      <Layers size={12} className="text-t1-red" />
                      Category <span className="text-t1-red">*</span>
                    </label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-4 focus:border-t1-red focus:outline-none transition-all duration-300 appearance-none text-white"
                    >
                      <option value={0} disabled className="bg-[#0a0a0a]">Select Category</option>
                      {categories.map((cat: any) => (
                        <option key={cat.category_id} value={cat.category_id} className="bg-[#0a0a0a]">
                          {cat.category_name.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Slug */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">
                    <Package size={12} className="text-t1-red" />
                    Slug (URL Identifier)
                  </label>
                  <input
                    type="text"
                    value={formData.product_slug}
                    onChange={(e) => setFormData({ ...formData, product_slug: e.target.value })}
                    placeholder="e.g. essential-black-hoodie (Auto-generated if left blank)"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-4 text-gray-400 focus:border-t1-red focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">
                    <FileText size={12} className="text-t1-red" />
                    Product Description
                  </label>
                  <textarea
                    value={formData.product_description}
                    onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                    placeholder="Detailed information about the product..."
                    rows={5}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-4 focus:border-t1-red focus:outline-none transition-all duration-300 resize-none"
                  />
                </div>

                {/* Collections */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">
                    <Grid size={12} className="text-t1-red" />
                    Collections
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {allCollections.map((col) => (
                      <label
                        key={col.collection_id}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${formData.collection_ids.includes(col.collection_id)
                          ? 'bg-t1-red/10 border-t1-red text-white'
                          : 'bg-white/[0.02] border-white/5 text-gray-500 hover:border-white/20'
                          }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={formData.collection_ids.includes(col.collection_id)}
                          onChange={() => {
                            const newIds = formData.collection_ids.includes(col.collection_id)
                              ? formData.collection_ids.filter(id => id !== col.collection_id)
                              : [...formData.collection_ids, col.collection_id]
                            setFormData({ ...formData, collection_ids: newIds })
                          }}
                        />
                        <span className="font-oswald text-[10px] uppercase tracking-widest">{col.collection_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="variants"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-oswald font-bold text-xs uppercase tracking-widest text-gray-400">Manage Sizes & Pricing</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        items: [...formData.items, { sku: '', product_item_price: 0, stock_quantity: 0, size: '' }]
                      })
                    }}
                    className="flex items-center gap-2 text-t1-red hover:text-white transition-colors font-oswald text-[10px] uppercase tracking-widest"
                  >
                    <Plus size={14} />
                    Add Variant
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={index}
                      className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
                    >
                      <div className="space-y-2">
                        <label className="font-oswald text-[9px] uppercase tracking-widest text-gray-600">Size</label>
                        <input
                          type="text"
                          value={item.size}
                          onChange={(e) => {
                            const newItems = [...formData.items]
                            newItems[index] = { ...item, size: e.target.value }
                            setFormData({ ...formData, items: newItems })
                          }}
                          placeholder="S, M, L..."
                          className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 focus:border-t1-red focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-oswald text-[9px] uppercase tracking-widest text-gray-600">Price ($)</label>
                        <input
                          type="number"
                          value={item.product_item_price}
                          onChange={(e) => {
                            const newItems = [...formData.items]
                            newItems[index] = { ...item, product_item_price: parseFloat(e.target.value) }
                            setFormData({ ...formData, items: newItems })
                          }}
                          className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 focus:border-t1-red focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-oswald text-[9px] uppercase tracking-widest text-gray-600">Stock</label>
                        <input
                          type="number"
                          value={item.stock_quantity}
                          onChange={(e) => {
                            const newItems = [...formData.items]
                            newItems[index] = { ...item, stock_quantity: parseInt(e.target.value) }
                            setFormData({ ...formData, items: newItems })
                          }}
                          className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 focus:border-t1-red focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-oswald text-[9px] uppercase tracking-widest text-gray-600">Discount</label>
                        <select
                          value={item.discount_id || ''}
                          onChange={(e) => {
                            const newItems = [...formData.items]
                            newItems[index] = { ...item, discount_id: e.target.value ? parseInt(e.target.value) : null }
                            setFormData({ ...formData, items: newItems })
                          }}
                          className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 focus:border-t1-red focus:outline-none appearance-none"
                        >
                          <option value="">None</option>
                          {discounts.map(d => (
                            <option key={d.discount_id} value={d.discount_id}>{d.name} ({d.discount_percent}%)</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 space-y-2">
                          <label className="font-oswald text-[9px] uppercase tracking-widest text-gray-600">SKU</label>
                          <input
                            type="text"
                            value={item.sku}
                            onChange={(e) => {
                              const newItems = [...formData.items]
                              newItems[index] = { ...item, sku: e.target.value.toUpperCase() }
                              setFormData({ ...formData, items: newItems })
                            }}
                            placeholder="T1-HOD-BLK-S"
                            className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 focus:border-t1-red focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              items: formData.items.filter((_, i) => i !== index)
                            })
                          }}
                          className="p-2 mb-0.5 text-gray-600 hover:text-t1-red transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {formData.items.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-3xl">
                      <p className="font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-600">No variants added yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-3 bg-white text-black hover:bg-t1-red hover:text-white px-8 py-5 rounded-xl font-oswald font-black uppercase tracking-widest text-sm transition-all duration-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : <><Save size={18} /> Save Product</>}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex items-center justify-center gap-3 bg-white/5 text-gray-500 hover:text-white px-8 py-5 rounded-xl font-oswald font-bold uppercase tracking-widest text-sm transition-all duration-300"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </form>
      </motion.div>

      {/* Info Card */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <FileText size={20} className="text-blue-500" />
        </div>
        <div>
          <h4 className="font-oswald font-bold text-xs uppercase tracking-widest text-blue-500 mb-1">Architecture Note</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            This form manages the root <strong>Product</strong> entity. To add specific sizes, prices, and stock, please use the <strong>Variants</strong> section after creating the product.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminProductForm
