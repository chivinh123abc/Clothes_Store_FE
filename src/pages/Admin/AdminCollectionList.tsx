import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ArrowLeft, Grid, Save, X, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import collectionApi from '~/apis/collectionApi'
import type { Collection } from '~/types/collection'

const AdminCollectionList = () => {
  const navigate = useNavigate()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [currentCollection, setCurrentCollection] = useState<Partial<Collection> | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchCollections = async () => {
    try {
      const res = await collectionApi.getAll()
      setCollections(res.data)
    } catch (error) {
      console.error('Failed to fetch collections', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentCollection?.collection_name) return

    setSaving(true)
    try {
      if (currentCollection.collection_id) {
        await collectionApi.update(currentCollection.collection_id, currentCollection)
      } else {
        await collectionApi.create(currentCollection)
      }
      setShowModal(false)
      fetchCollections()
    } catch (error) {
      console.error('Failed to save collection', error)
      alert('Failed to save collection')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this collection? Dependencies might break.')) return
    try {
      await collectionApi.delete(id)
      fetchCollections()
    } catch (error) {
      console.error('Failed to delete collection', error)
      alert('Failed to delete collection. It might have sub-collections.')
    }
  }

  const getParentName = (parentId?: number) => {
    if (!parentId) return null
    return collections.find(c => c.collection_id === parentId)?.collection_name
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
            setCurrentCollection({ collection_name: '', parent_collection_id: undefined, description: '' })
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-white text-black hover:bg-t1-red hover:text-white px-4 py-2 rounded-lg font-oswald font-black uppercase tracking-widest text-[10px] transition-all duration-300"
        >
          <Plus size={14} />
          Add Collection
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
          <h3 className="font-oswald font-black italic text-2xl uppercase tracking-tight">Product Collections</h3>
          <p className="text-gray-500 text-xs mt-1 font-oswald uppercase tracking-widest">Manage your shop's hierarchical structure</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.3em] text-gray-500 font-oswald">
                <th className="px-8 py-6 font-bold">Collection</th>
                <th className="px-8 py-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {collections.map((col, i) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={col.collection_id}
                  className="group hover:bg-white/[0.01] transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Grid size={14} className="text-purple-500" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          {col.parent_collection_id && (
                            <span className="text-[10px] text-gray-600 uppercase tracking-widest font-oswald flex items-center gap-1">
                              {getParentName(col.parent_collection_id)} <ChevronRight size={10} />
                            </span>
                          )}
                          <span className="font-bold text-sm uppercase tracking-tight">{col.collection_name}</span>
                        </div>
                        <span className="text-[10px] text-gray-600 font-mono mt-0.5">{col.collection_slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setCurrentCollection(col)
                          setShowModal(true)
                        }}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(col.collection_id)}
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
                    {currentCollection?.collection_id ? 'Edit Collection' : 'Add Collection'}
                  </h4>
                  <p className="text-gray-500 text-[10px] mt-1 font-oswald uppercase tracking-widest">Configure hierarchy & details</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-4">
                  <label className="block font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">Collection Name</label>
                  <input
                    type="text"
                    required
                    value={currentCollection?.collection_name}
                    onChange={(e) => setCurrentCollection({ ...currentCollection, collection_name: e.target.value })}
                    placeholder="e.g. League of Legends"
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-4 focus:border-t1-red focus:outline-none transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">Parent Collection</label>
                  <select
                    value={currentCollection?.parent_collection_id || ''}
                    onChange={(e) => setCurrentCollection({ ...currentCollection, parent_collection_id: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-4 focus:border-t1-red focus:outline-none appearance-none text-white text-sm"
                  >
                    <option value="" className="bg-[#0a0a0a]">No Parent (Root Collection)</option>
                    {collections
                      .filter(c => c.collection_id !== currentCollection?.collection_id) // Prevent self-parenting
                      .map(c => (
                        <option key={c.collection_id} value={c.collection_id} className="bg-[#0a0a0a]">
                          {c.collection_name.toUpperCase()}
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-white text-black hover:bg-t1-red hover:text-white px-6 py-4 rounded-xl font-oswald font-black uppercase tracking-widest text-xs transition-all duration-300 disabled:opacity-50"
                  >
                    <Save size={14} />
                    {saving ? 'Saving...' : 'Save Collection'}
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

export default AdminCollectionList
