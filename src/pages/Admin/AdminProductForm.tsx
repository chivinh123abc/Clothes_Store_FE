/* eslint-disable indent */
import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, X, Type, FileText, Layers, Grid, Plus, Trash2 } from 'lucide-react'
import productApi from '~/apis/productApi'
import categoryApi from '~/apis/categoriesApi'
import type { Category } from '~/apis/categoriesApi'
import collectionApi from '~/apis/collectionApi'
import type { Collection } from '~/types/collection'
import discountApi from '~/apis/discountApi'
import type { Discount } from '~/apis/discountApi'
import axiosClient from '~/apis/axiosClient'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '~/contexts/ToastContext'

const AdminProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const { showToast } = useToast()

  const [categories, setCategories] = useState<Category[]>([])
  const [allCollections, setAllCollections] = useState<Collection[]>([])
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'variants'>('info')

  const [formData, setFormData] = useState({
    product_name: '',
    category_id: 0,
    product_description: '',
    is_bestseller: false,
    collection_ids: [] as number[],
    items: [] as any[] // For variants
  })

  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingIndex(index)
    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string

          // Generate a unique, readable public_id based on name and variant size
          const size = formData.items[index]?.size || 'M'
          const cleanName = (formData.product_name || 'PROD').trim().toUpperCase().replace(/[^A-Z0-9\s]/g, '')
          const words = cleanName.split(/\s+/).filter(Boolean)
          let prefix = ''
          if (words.length >= 2) {
            prefix = words.map((w) => w.slice(0, 2)).join('-')
          } else if (words.length === 1) {
            prefix = words[0].slice(0, 6)
          } else {
            prefix = 'PROD'
          }
          const cleanSize = size.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
          const publicId = `${prefix}-${cleanSize}`.toLowerCase()

          const response = await axiosClient.post<{ secure_url: string }>('/admin/upload', {
            file: base64Data,
            public_id: publicId
          })

          const newItems = [...formData.items]
          newItems[index] = { ...newItems[index], product_item_image: response.data.secure_url }
          setFormData({ ...formData, items: newItems })
          showToast('Image uploaded securely to backend', 'success')
        } catch (err: any) {
          // eslint-disable-next-line no-console
          console.error('Secure backend upload failed', err)
          showToast('Failed to upload image', 'error')
        } finally {
          setUploadingIndex(null)
        }
      }
      reader.onerror = () => {
        showToast('Failed to read file', 'error')
        setUploadingIndex(null)
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Image upload initialization failed', err)
      showToast('Failed to upload image', 'error')
      setUploadingIndex(null)
    }
  }

  const handleCopyImageToAll = (imageUrl: string) => {
    const newItems = formData.items.map((item) => ({
      ...item,
      product_item_image: imageUrl
    }))
    setFormData({ ...formData, items: newItems })
    showToast('Image applied to all variants', 'success')
  }

  const handleCopyPriceToAll = (price: number) => {
    const newItems = formData.items.map((item) => ({
      ...item,
      product_item_price: price
    }))
    setFormData({ ...formData, items: newItems })
    showToast('Price applied to all variants', 'success')
  }

  const handleCopyDiscountToAll = (discountId: number | null) => {
    const newItems = formData.items.map((item) => ({
      ...item,
      discount_id: discountId
    }))
    setFormData({ ...formData, items: newItems })
    showToast('Discount applied to all variants', 'success')
  }

  const fetchData = useCallback(async () => {
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
          product_description: product.product_description || '',
          is_bestseller: !!product.is_bestseller,
          collection_ids: product.collections?.map((c: any) => c.collection_id) || [],
          items: product.items || []
        })
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch data', error)
      showToast('Failed to load form data', 'error')
    } finally {
      setLoading(false)
    }
  }, [id, isEdit, showToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.product_name || !formData.category_id) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    if (formData.items.length === 0) {
      showToast('Please add at least one variant', 'error')
      setActiveTab('variants')
      return
    }

    // Validate: if a variant has an interacted size field, it must not be empty string
    const invalidSize = formData.items.some((item) => item.size !== undefined && item.size !== null && item.size === '')
    if (invalidSize) {
      showToast('Please select a size for all variants, or leave it as no size', 'error')
      setActiveTab('variants')
      return
    }

    // Validate: no duplicate sizes within the same product
    const sizesWithValue = formData.items.map((item) => item.size).filter((s) => s && s !== '')
    const uniqueSizes = new Set(sizesWithValue)
    if (uniqueSizes.size !== sizesWithValue.length) {
      showToast('Each size must be unique within the same product', 'error')
      setActiveTab('variants')
      return
    }

    setSaving(true)
    try {
      // Auto-generate SKU only for NEW variants (no product_item_id yet)
      // Existing variants already have a stable SKU in the DB — do NOT regenerate
      const itemsWithSkus = formData.items.map((item) => {
        if (item.product_item_id && item.sku) {
          // Existing variant — preserve its current SKU
          return item
        }

        // New variant — generate a unique SKU
        const cleanName = formData.product_name
          .trim()
          .toUpperCase()
          .replace(/[^A-Z0-9\s]/g, '')

        const words = cleanName.split(/\s+/).filter(Boolean)
        let prefix = ''
        if (words.length >= 2) {
          prefix = words.map((w) => w.slice(0, 2)).join('-')
        } else if (words.length === 1) {
          prefix = words[0].slice(0, 6)
        } else {
          prefix = 'PROD'
        }

        const cleanSize = (item.size || 'M').trim().toUpperCase()
        // Add a 4-char random suffix to guarantee global uniqueness
        const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
        const sku = `${prefix}-${cleanSize}-${randomSuffix}`
        return { ...item, sku }
      })

      const payload = { ...formData, items: itemsWithSkus }

      if (isEdit) {
        await productApi.update(Number(id), payload)
        showToast('Product updated successfully', 'success')
      } else {
        await productApi.create(payload)
        showToast('Product created successfully', 'success')
      }
      navigate('/admin/products')
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to save product', error)
      const errorMsg = error.response?.data?.message || error.message
      showToast(`Failed to save product: ${errorMsg}`, 'error')
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

  const parentCols = allCollections.filter(c => c.parent_collection_id === null)

  const selectedL1 = allCollections.find(
    c => c.parent_collection_id === null && formData.collection_ids.includes(c.collection_id)
  )

  const selectedL2 = selectedL1
    ? allCollections.find(
      c => c.parent_collection_id === selectedL1.collection_id && formData.collection_ids.includes(c.collection_id)
    )
    : undefined

  const selectedL3 = selectedL2
    ? allCollections.find(
      c => c.parent_collection_id === selectedL2.collection_id && formData.collection_ids.includes(c.collection_id)
    )
    : undefined

  const handleL1Change = (l1Id: number | null) => {
    if (!l1Id) {
      setFormData({ ...formData, collection_ids: [] })
      return
    }
    setFormData({ ...formData, collection_ids: [l1Id] })
  }

  const handleL2Change = (l2Id: number | null) => {
    if (!selectedL1) return
    if (!l2Id) {
      setFormData({ ...formData, collection_ids: [selectedL1.collection_id] })
      return
    }
    setFormData({ ...formData, collection_ids: [selectedL1.collection_id, l2Id] })
  }

  const handleL3Change = (l3Id: number | null) => {
    if (!selectedL1 || !selectedL2) return
    if (!l3Id) {
      setFormData({ ...formData, collection_ids: [selectedL1.collection_id, selectedL2.collection_id] })
      return
    }
    setFormData({ ...formData, collection_ids: [selectedL1.collection_id, selectedL2.collection_id, l3Id] })
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

                {/* Status Flags */}
                <div className="flex flex-wrap gap-10">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${formData.is_bestseller ? 'bg-t1-red border-t1-red' : 'border-white/10 group-hover:border-white/30'}`}>
                      {formData.is_bestseller && <Save size={14} className="text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.is_bestseller}
                      onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                    />
                    <span className="font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors">Mark as Best Seller</span>
                  </label>
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
                <div className="space-y-6">
                  <label className="flex items-center gap-2 font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">
                    <Grid size={12} className="text-t1-red" />
                    Product Collection Path
                  </label>

                  <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-6">
                    {/* Level 1: Main Collection Selection */}
                    <div className="space-y-3">
                      <span className="font-oswald text-[9px] uppercase tracking-widest text-gray-500 block">
                        Step 1: Select Main Collection (Level 1)
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {parentCols.map((c) => {
                          const isSelected = selectedL1?.collection_id === c.collection_id
                          return (
                            <label
                              key={c.collection_id}
                              className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${isSelected
                                  ? 'bg-t1-red/10 border-t1-red/50 text-white'
                                  : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/20'
                                }`}
                            >
                              <input
                                type="checkbox"
                                className="rounded border-white/10 bg-white/5 text-t1-red focus:ring-t1-red focus:ring-offset-0 w-4 h-4 cursor-pointer"
                                checked={isSelected}
                                onChange={() => handleL1Change(c.collection_id)}
                              />
                              <div className="flex flex-col">
                                <span className={`font-oswald text-xs uppercase tracking-wider leading-none ${isSelected ? 'text-white font-bold' : ''}`}>
                                  {c.collection_name}
                                </span>
                                <span className="text-[7px] font-oswald uppercase tracking-wider text-gray-500 mt-1">Level 1 (Main)</span>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    {/* Level 2: Sub-Collection Selection */}
                    {selectedL1 && (
                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <span className="font-oswald text-[9px] uppercase tracking-widest text-gray-500 block">
                          Step 2: Select Sub-Collection (Level 2)
                        </span>
                        {allCollections.filter(c => c.parent_collection_id === selectedL1.collection_id).length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {allCollections
                              .filter(c => c.parent_collection_id === selectedL1.collection_id)
                              .map((c) => {
                                const isSelected = selectedL2?.collection_id === c.collection_id
                                return (
                                  <label
                                    key={c.collection_id}
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${isSelected
                                        ? 'bg-t1-red/10 border-t1-red/50 text-white'
                                        : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/20'
                                      }`}
                                  >
                                    <input
                                      type="checkbox"
                                      className="rounded border-white/10 bg-white/5 text-t1-red focus:ring-t1-red focus:ring-offset-0 w-4 h-4 cursor-pointer"
                                      checked={isSelected}
                                      onChange={() => handleL2Change(c.collection_id)}
                                    />
                                    <div className="flex flex-col">
                                      <span className={`font-oswald text-xs uppercase tracking-wider leading-none ${isSelected ? 'text-white font-bold' : ''}`}>
                                        {c.collection_name}
                                      </span>
                                      <span className="text-[7px] font-oswald uppercase tracking-wider text-gray-500 mt-1">Level 2 (Sub)</span>
                                    </div>
                                  </label>
                                )
                              })}
                          </div>
                        ) : (
                          <span className="text-[10px] font-oswald uppercase tracking-widest text-gray-600 italic">
                            No Sub-Collections under {selectedL1.collection_name}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Level 3: Sub-Sub-Collection Selection */}
                    {selectedL2 && allCollections.filter(c => c.parent_collection_id === selectedL2.collection_id).length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <span className="font-oswald text-[9px] uppercase tracking-widest text-gray-500 block">
                          Step 3: Select Sub-Sub-Collection (Level 3)
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {allCollections
                            .filter(c => c.parent_collection_id === selectedL2.collection_id)
                            .map((c) => {
                              const isSelected = selectedL3?.collection_id === c.collection_id
                              return (
                                <label
                                  key={c.collection_id}
                                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${isSelected
                                      ? 'bg-t1-red/10 border-t1-red/50 text-white'
                                      : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/20'
                                    }`}
                                >
                                  <input
                                    type="checkbox"
                                    className="rounded border-white/10 bg-white/5 text-t1-red focus:ring-t1-red focus:ring-offset-0 w-4 h-4 cursor-pointer"
                                    checked={isSelected}
                                    onChange={() => handleL3Change(c.collection_id)}
                                  />
                                  <div className="flex flex-col">
                                    <span className={`font-oswald text-xs uppercase tracking-wider leading-none ${isSelected ? 'text-white font-bold' : ''}`}>
                                      {c.collection_name}
                                    </span>
                                    <span className="text-[7px] font-oswald uppercase tracking-wider text-gray-500 mt-1">Level 3 (Sub-Sub)</span>
                                  </div>
                                </label>
                              )
                            })}
                        </div>
                      </div>
                    )}
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
                      className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-6 gap-6 items-center"
                    >
                      {/* 1. Image Preview & Cloudinary Upload */}
                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <div className="flex justify-between items-center w-full">
                          <label className="font-oswald text-[9px] uppercase tracking-widest text-gray-600 block">Image</label>
                          {item.product_item_image && (
                            <button
                              type="button"
                              onClick={() => handleCopyImageToAll(item.product_item_image)}
                              className="font-oswald text-[8px] uppercase tracking-widest text-t1-red hover:text-white transition-colors duration-200"
                              title="Apply this image to all variants"
                            >
                              Copy
                            </button>
                          )}
                        </div>
                        <div className="relative group w-14 h-14 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-t1-red/50 cursor-pointer">
                          {item.product_item_image ? (
                            <>
                              <img src={item.product_item_image} alt="SKU Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                                <Plus size={14} className="text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-500 hover:text-white">
                              {uploadingIndex === index ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-t1-red border-t-transparent" />
                              ) : (
                                <Plus size={16} />
                              )}
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingIndex !== null}
                            onChange={(e) => handleImageUpload(e, index)}
                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* 2. Size Dropdown */}
                      <div className="space-y-2">
                        <label className="font-oswald text-[9px] uppercase tracking-widest text-gray-600">Size</label>
                        <select
                          value={item.size || ''}
                          onChange={(e) => {
                            const newItems = [...formData.items]
                            newItems[index] = { ...item, size: e.target.value }
                            setFormData({ ...formData, items: newItems })
                          }}
                          className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 focus:border-t1-red focus:outline-none appearance-none font-oswald text-xs text-white"
                        >
                          <option value="" className="bg-[#0b0c10] text-gray-400">No Size</option>
                          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                            const usedByOther = formData.items.some((other, otherIdx) => otherIdx !== index && other.size === sz)
                            return (
                              <option
                                key={sz}
                                value={sz}
                                disabled={usedByOther}
                                className="bg-[#0b0c10]"
                              >
                                {sz}{usedByOther ? ' (used)' : ''}
                              </option>
                            )
                          })}
                        </select>
                      </div>

                      {/* 3. Price */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center w-full">
                          <label className="font-oswald text-[9px] uppercase tracking-widest text-gray-600 block">Price ($)</label>
                          {formData.items.length > 1 && item.product_item_price !== undefined && item.product_item_price > 0 && (
                            <button
                              type="button"
                              onClick={() => handleCopyPriceToAll(item.product_item_price)}
                              className="font-oswald text-[8px] uppercase tracking-widest text-t1-red hover:text-white transition-colors duration-200"
                              title="Apply this price to all variants"
                            >
                              Copy
                            </button>
                          )}
                        </div>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={item.product_item_price}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value)
                            const newItems = [...formData.items]
                            newItems[index] = { ...item, product_item_price: isNaN(val) || val < 0 ? 0 : val }
                            setFormData({ ...formData, items: newItems })
                          }}
                          className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 focus:border-t1-red focus:outline-none font-oswald text-xs text-white"
                        />
                      </div>

                      {/* 4. Stock */}
                      <div className="space-y-2">
                        <label className="font-oswald text-[9px] uppercase tracking-widest text-gray-600">Stock</label>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={item.stock_quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value)
                            const newItems = [...formData.items]
                            newItems[index] = { ...item, stock_quantity: isNaN(val) || val < 0 ? 0 : val }
                            setFormData({ ...formData, items: newItems })
                          }}
                          className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 focus:border-t1-red focus:outline-none font-oswald text-xs text-white"
                        />
                      </div>

                      {/* 5. Discount */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center w-full">
                          <label className="font-oswald text-[9px] uppercase tracking-widest text-gray-600 block">Discount</label>
                          {formData.items.length > 1 && item.discount_id !== undefined && (
                            <button
                              type="button"
                              onClick={() => handleCopyDiscountToAll(item.discount_id)}
                              className="font-oswald text-[8px] uppercase tracking-widest text-t1-red hover:text-white transition-colors duration-200"
                              title="Apply this discount to all variants"
                            >
                              Copy
                            </button>
                          )}
                        </div>
                        <select
                          value={item.discount_id || ''}
                          onChange={(e) => {
                            const newItems = [...formData.items]
                            newItems[index] = { ...item, discount_id: e.target.value ? parseInt(e.target.value) : null }
                            setFormData({ ...formData, items: newItems })
                          }}
                          className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 focus:border-t1-red focus:outline-none appearance-none font-oswald text-xs text-white"
                        >
                          <option value="" className="bg-[#0b0c10]">None</option>
                          {discounts.map(d => (
                            <option key={d.discount_id} value={d.discount_id} className="bg-[#0b0c10]">{d.name} ({d.discount_percent}%)</option>
                          ))}
                        </select>
                      </div>

                      {/* 6. Delete Action */}
                      <div className="flex justify-end items-center self-end">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              items: formData.items.filter((_, i) => i !== index)
                            })
                          }}
                          className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-gray-500 hover:text-t1-red hover:bg-t1-red/10 transition-all duration-300 flex items-center justify-center cursor-pointer"
                          title="Delete variant"
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
