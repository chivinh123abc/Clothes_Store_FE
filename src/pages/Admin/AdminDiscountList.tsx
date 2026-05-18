/* eslint-disable no-console */
import React, { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, ArrowLeft, Percent, Save, X, ToggleLeft, ToggleRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import discountApi from '~/apis/discountApi'
import type { Discount } from '~/apis/discountApi'
import { useToast } from '~/contexts/ToastContext'
import ConfirmModal from '~/components/ui/ConfirmModal'

const AdminDiscountList = () => {
  const navigate = useNavigate()
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [currentDiscount, setCurrentDiscount] = useState<Partial<Discount> & { description?: string, active?: boolean } | null>(null)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()
  const [discountToDelete, setDiscountToDelete] = useState<number | null>(null)

  const fetchDiscounts = useCallback(async () => {
    try {
      const res = await discountApi.getAll()
      setDiscounts(res.data)
    } catch (error) {
      console.error('Error fetching discounts', error)
      showToast('Failed to fetch discounts', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchDiscounts()
  }, [fetchDiscounts])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentDiscount?.name) {
      showToast('Please enter a discount name', 'error')
      return
    }

    const percent = Number(currentDiscount.discount_percent)
    if (isNaN(percent) || percent < 0 || percent > 100) {
      showToast('Discount percent must be between 0 and 100', 'error')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: currentDiscount.name,
        description: currentDiscount.description || '',
        discount_percent: percent,
        active: currentDiscount.active !== false
      }

      if (currentDiscount.discount_id) {
        await discountApi.update(currentDiscount.discount_id, payload)
        showToast('Discount updated successfully', 'success')
      } else {
        await discountApi.create(payload)
        showToast('Discount created successfully', 'success')
      }
      setShowModal(false)
      fetchDiscounts()
    } catch (error: any) {
      console.error('Failed to save discount', error)
      const errorMsg = error.response?.data?.message || error.message
      showToast(`Failed to save discount: ${errorMsg}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!discountToDelete) return
    try {
      await discountApi.delete(discountToDelete)
      showToast('Discount deleted successfully', 'success')
      setDiscountToDelete(null)
      fetchDiscounts()
    } catch (error: any) {
      console.error('Failed to delete discount', error)
      const errorMsg = error.response?.data?.message || error.message
      showToast(`Failed to delete discount: ${errorMsg}`, 'error')
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
      <ConfirmModal
        isOpen={discountToDelete !== null}
        title="Delete Discount"
        message="Are you sure you want to delete this discount? This will remove the discount rate from any products linked to it."
        confirmText="Delete Discount"
        onConfirm={handleDelete}
        onClose={() => setDiscountToDelete(null)}
        type="danger"
      />

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
            setCurrentDiscount({ name: '', description: '', discount_percent: 0, active: true })
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-white text-black hover:bg-t1-red hover:text-white px-4 py-2 rounded-lg font-oswald font-black uppercase tracking-widest text-[10px] transition-all duration-300"
        >
          <Plus size={14} />
          Add Discount
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
          <h3 className="font-oswald font-black italic text-2xl uppercase tracking-tight">Discounts & Promotions</h3>
          <p className="text-gray-500 text-xs mt-1 font-oswald uppercase tracking-widest">Manage store discount rates and campaigns</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.3em] text-gray-500 font-oswald">
                <th className="px-8 py-6 font-bold">Discount Name</th>
                <th className="px-8 py-6 font-bold">Rate</th>
                <th className="px-8 py-6 font-bold">Description</th>
                <th className="px-8 py-6 font-bold">Status</th>
                <th className="px-8 py-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {discounts.map((discount, i) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={discount.discount_id}
                  className="group hover:bg-white/[0.01] transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-t1-red/10 rounded-lg">
                        <Percent size={14} className="text-t1-red" />
                      </div>
                      <span className="font-bold text-sm uppercase tracking-tight">{discount.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-oswald font-black italic text-base text-t1-red bg-t1-red/10 px-3 py-1 rounded-lg border border-t1-red/20">
                      -{discount.discount_percent}%
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-400 max-w-[200px] truncate">
                    {/* Handle description if not present */}
                    {(discount as any).description || <span className="italic text-gray-600">No description</span>}
                  </td>
                  <td className="px-8 py-6">
                    {(discount as any).active !== false ? (
                      <span className="text-[10px] font-oswald font-bold uppercase tracking-widest text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-oswald font-bold uppercase tracking-widest text-gray-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setCurrentDiscount(discount)
                          setShowModal(true)
                        }}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDiscountToDelete(discount.discount_id)}
                        className="p-2 text-gray-500 hover:text-t1-red hover:bg-t1-red/10 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {discounts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-500 italic">
                    No discounts configured yet
                  </td>
                </tr>
              )}
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
                    {currentDiscount?.discount_id ? 'Edit Discount' : 'Add Discount'}
                  </h4>
                  <p className="text-gray-500 text-[10px] mt-1 font-oswald uppercase tracking-widest">Fill in the promotion details below</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-4">
                  <label className="block font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">Discount Name</label>
                  <input
                    type="text"
                    autoFocus
                    required
                    value={currentDiscount?.name || ''}
                    onChange={(e) => setCurrentDiscount({ ...currentDiscount!, name: e.target.value })}
                    placeholder="e.g. SUMMER20"
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-4 focus:border-t1-red focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">Discount Percent (%)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={currentDiscount?.discount_percent ?? ''}
                    onChange={(e) => setCurrentDiscount({ ...currentDiscount!, discount_percent: Number(e.target.value) })}
                    placeholder="e.g. 20"
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-4 focus:border-t1-red focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">Description</label>
                  <textarea
                    value={currentDiscount?.description || ''}
                    onChange={(e) => setCurrentDiscount({ ...currentDiscount!, description: e.target.value })}
                    placeholder="Describe this campaign..."
                    rows={3}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-4 focus:border-t1-red focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                  <div>
                    <label className="block font-oswald text-[10px] uppercase tracking-[0.2em] text-white">Active Status</label>
                    <p className="text-gray-500 text-[10px] font-light mt-0.5">Toggle whether this discount can be applied to products</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentDiscount({ ...currentDiscount!, active: currentDiscount?.active !== false ? false : true })}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {currentDiscount?.active !== false ? (
                      <ToggleRight size={44} className="text-green-500" />
                    ) : (
                      <ToggleLeft size={44} className="text-gray-600" />
                    )}
                  </button>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-white text-black hover:bg-t1-red hover:text-white px-6 py-4 rounded-xl font-oswald font-black uppercase tracking-widest text-xs transition-all duration-300 disabled:opacity-50"
                  >
                    <Save size={14} />
                    {saving ? 'Saving...' : 'Save Discount'}
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

export default AdminDiscountList
