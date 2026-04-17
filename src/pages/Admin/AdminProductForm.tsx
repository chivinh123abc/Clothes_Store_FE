import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, X, Package, Type, FileText, Layers } from 'lucide-react'
import productApi from '~/apis/productApi'
import type { Category } from '~/apis/productApi'
import { motion } from 'framer-motion'

const AdminProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    product_name: '',
    category_id: 0,
    product_slug: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, productRes] = await Promise.all([
          productApi.getCategories(),
          isEdit ? productApi.getById(Number(id)) : Promise.resolve(null)
        ])

        setCategories(catsRes.data)

        if (productRes) {
          setFormData({
            product_name: productRes.data.product_name,
            category_id: productRes.data.category_id || 0,
            product_slug: productRes.data.product_slug
          })
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch data', error)
        alert('Failed to load data')
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
          <h3 className="font-oswald font-black italic text-2xl uppercase tracking-tight">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h3>
          <p className="text-gray-500 text-xs mt-1 font-oswald uppercase tracking-widest">
            Complete the information below to {isEdit ? 'update' : 'create'} a product
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
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
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id} className="bg-[#0a0a0a]">
                    {cat.category_name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-4 text-gray-500 focus:border-t1-red focus:outline-none transition-all duration-300"
            />
          </div>

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
