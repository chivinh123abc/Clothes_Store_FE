/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ArrowLeft, Layers, Save, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import categoryApi from '~/apis/categoriesApi'
import type { Category } from '~/apis/categoriesApi'

const AdminCategoryList = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getCategories()
      setCategories(res.data)
    } catch (error) {
      console.log('Errorrrrrr', error)
      // Failed to fetch categories
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentCategory?.category_name) return

    setSaving(true)
    try {
      if (currentCategory.category_id) {
        await categoryApi.update(currentCategory.category_id, currentCategory)
      } else {
        await categoryApi.create(currentCategory)
      }
      setShowModal(false)
      fetchCategories()
    } catch (error) {
      console.error('Failed to save category', error)
      alert('Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category? This might affect products linked to it.')) return
    try {
      await categoryApi.delete(id)
      fetchCategories()
    } catch (error) {
      console.error('Failed to delete category', error)
      alert('Failed to delete category. It might be in use.')
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-oswald text-[10px] uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>
        <button
          onClick={() => {
            setCurrentCategory({ category_name: '' })
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-white text-black hover:bg-t1-red hover:text-white px-4 py-2 rounded-lg font-oswald font-black uppercase tracking-widest text-[10px] transition-all duration-300"
        >
          <Plus size={14} />
          Add Category
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
          <h3 className="font-oswald font-black italic text-2xl uppercase tracking-tight">Product Categories</h3>
          <p className="text-gray-500 text-xs mt-1 font-oswald uppercase tracking-widest">Organize your products into types</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.3em] text-gray-500 font-oswald">
                <th className="px-8 py-6 font-bold">Category Name</th>
                <th className="px-8 py-6 font-bold">Slug</th>
                <th className="px-8 py-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((cat, i) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={cat.category_id}
                  className="group hover:bg-white/[0.01] transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Layers size={14} className="text-blue-500" />
                      </div>
                      <span className="font-bold text-sm uppercase tracking-tight">{cat.category_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs text-gray-500">
                    {cat.category_slug}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setCurrentCategory(cat)
                          setShowModal(true)
                        }}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.category_id)}
                        className="p-2 text-gray-500 hover:text-t1-red hover:bg-t1-red/10 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div>
                  <h4 className="font-oswald font-black italic text-xl uppercase tracking-tight">
                    {currentCategory?.category_id ? 'Edit Category' : 'Add Category'}
                  </h4>
                  <p className="text-gray-500 text-[10px] mt-1 font-oswald uppercase tracking-widest">Fill in the details below</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-4">
                  <label className="block font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">Category Name</label>
                  <input
                    type="text"
                    autoFocus
                    required
                    value={currentCategory?.category_name}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, category_name: e.target.value })}
                    placeholder="e.g. Hoodie"
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-4 focus:border-t1-red focus:outline-none transition-all"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-white text-black hover:bg-t1-red hover:text-white px-6 py-4 rounded-xl font-oswald font-black uppercase tracking-widest text-xs transition-all duration-300 disabled:opacity-50"
                  >
                    <Save size={14} />
                    {saving ? 'Saving...' : 'Save Category'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-4 bg-white/5 text-gray-500 hover:text-white rounded-xl font-oswald font-bold uppercase tracking-widest text-xs transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminCategoryList
