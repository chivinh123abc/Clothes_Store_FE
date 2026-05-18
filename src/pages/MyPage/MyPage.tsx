import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Heart, ShoppingBag, Package, LogOut,
  ChevronRight, Trash2, Plus, Minus, X,
  MapPin, Mail, Phone, Edit3, Shield,
  Star, CheckCircle, Lock, Eye, EyeOff, Loader2, Check
} from 'lucide-react'
import Layout from '~/components/layout/Layout'
import Footer from '~/components/layout/Footer'
import AddressModal from '~/components/Modals/AddressModal/AddressModal'
import { useAuth } from '~/hooks/useAuth'
import { useCart } from '~/contexts/CartContext'
import { useFavorites } from '~/contexts/FavoritesContext'
import { mockOrders, STATUS_CONFIG } from '~/data/myPageData'
import { useLanguage } from '~/contexts/LanguageContext'
import { formatPrice } from '~/utils/format'
import { userApi } from '~/apis/userApi'
import { useToast } from '~/contexts/ToastContext'

type Tab = 'profile' | 'favorites' | 'cart' | 'orders'

export default function MyPage() {
  const { t, language } = useLanguage()
  const { user, logout, setUser } = useAuth()
  const { items, removeCartItem, incrementQuantity, decrementQuantity, totalPrice, totalItems } = useCart()
  const { favorites, toggleFavorite, totalFavorites } = useFavorites()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  // Security modals state
  const [changePwOpen, setChangePwOpen] = useState(false)
  const [twoFaEnabled, setTwoFaEnabled] = useState(false)
  const [connectedOpen, setConnectedOpen] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwShow, setPwShow] = useState({ current: false, next: false, confirm: false })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [editForm, setEditForm] = useState({
    username: '',
    phone_number: '',
    address: '',
    display_name: '',
    full_name: ''
  })
  const [saveLoading, setSaveLoading] = useState(false)
  const [isEditingHeroName, setIsEditingHeroName] = useState(false)
  const [heroNameDraft, setHeroNameDraft] = useState('')
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, field: string, value: string } | null>(null)

  // Sync editForm when user changes
  useEffect(() => {
    if (user) {
      setEditForm({
        username: user.username || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        display_name: user.display_name || '',
        full_name: user.full_name || ''
      })
    }
  }, [user])

  const handleRequestUpdate = (field: string, value: string) => {
    // Only request update if the value actually changed
    if ((user as any)?.[field] === value) {
      setEditingField(null)
      return
    }

    setConfirmModal({
      isOpen: true,
      field,
      value
    })
  }

  const handleConfirmUpdate = async () => {
    if (!confirmModal) return

    const { field, value } = confirmModal
    setSaveLoading(true)
    try {
      const updated = await userApi.updateProfile({ [field]: value })
      setUser(updated as any)
      setConfirmModal(null)
      setEditingField(null)
      showToast('Profile updated successfully', 'success')
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || t('errors.updateProfile') || 'Failed to update field'
      showToast(errorMsg, 'error')
      if (user) {
        setEditForm(prev => ({ ...prev, [field]: (user as any)[field] || '' }))
      }
    } finally {
      setSaveLoading(false)
    }
  }

  const handleSaveHeroName = async () => {
    if (!heroNameDraft.trim()) return
    setSaveLoading(true)
    try {
      const updated = await userApi.updateProfile({ display_name: heroNameDraft })
      setUser(updated as any)
      setIsEditingHeroName(false)
      showToast('Name updated successfully', 'success')
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || t('errors.updateProfile') || 'Failed to update name'
      showToast(errorMsg, 'error')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleChangePw = async () => {
    setPwError('')
    if (!pwForm.current) { setPwError(t('profile.currentPwRequired') || 'Please enter your current password.'); return }
    if (pwForm.next.length < 8) { setPwError(t('profile.newPwLength') || 'New password must be at least 8 characters.'); return }
    if (pwForm.next !== pwForm.confirm) { setPwError(t('profile.pwMismatch') || 'Passwords do not match.'); return }

    setSaveLoading(true)
    try {
      await userApi.changePassword(pwForm.next)
      setPwSuccess(true)
      showToast('Password changed successfully', 'success')
      setTimeout(() => {
        setChangePwOpen(false)
        setPwForm({ current: '', next: '', confirm: '' })
        setPwSuccess(false)
      }, 1500)
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || t('errors.changePassword') || 'Failed to change password'
      setPwError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabs: { id: Tab; label: string; icon: typeof User; count?: number }[] = [
    { id: 'profile', label: t('common.profile'), icon: User },
    { id: 'favorites', label: t('common.wishlist'), icon: Heart, count: totalFavorites },
    { id: 'cart', label: t('profile.cart'), icon: ShoppingBag, count: totalItems },
    { id: 'orders', label: t('common.order'), icon: Package, count: mockOrders.length }
  ]

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { month: 'long', year: 'numeric' })
    : language === 'vi' ? 'Tháng 4 2026' : 'April 2026'

  const totalSpent = mockOrders.reduce((s, o) => s + o.total, 0)

  return (
    <Layout footer={<Footer />} forceNavbarOpaque={true}>
      <div className='min-h-screen bg-[#0a0a0a] text-white font-inter'>

        {/* Hero */}
        <div className='relative bg-gradient-to-b from-[#111] to-[#0a0a0a] border-b border-white/5 pt-10 pb-0'>
          <div className='px-4 md:px-10 lg:px-20 max-w-7xl mx-auto'>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-6 pb-8'>
              {/* Avatar */}
              <div className='relative'>
                <div className='w-20 h-20 rounded-full bg-gradient-to-br from-t1-red to-[#ff4444] flex items-center justify-center text-3xl font-oswald font-black text-white shadow-[0_0_40px_rgba(226,1,45,0.4)]'>
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-[#111] flex items-center justify-center'>
                  <div className='w-2 h-2 rounded-full bg-white' />
                </div>
              </div>

              {/* User Info */}
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-1'>
                  {isEditingHeroName ? (
                    <div className='flex items-center gap-2 w-full max-w-md'>
                      <input
                        type='text'
                        value={heroNameDraft}
                        onChange={(e) => setHeroNameDraft(e.target.value)}
                        autoFocus
                        className='bg-black border-b-2 border-t1-red text-3xl md:text-4xl font-oswald font-black uppercase tracking-tight text-white outline-none w-full py-1'
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveHeroName()
                          if (e.key === 'Escape') setIsEditingHeroName(false)
                        }}
                      />
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={handleSaveHeroName}
                          disabled={saveLoading}
                          className='p-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all rounded'
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => setIsEditingHeroName(false)}
                          className='p-2 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all rounded'
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <h1
                      className='font-oswald font-black text-3xl md:text-4xl uppercase tracking-tight flex items-center gap-3 group cursor-pointer'
                      onClick={() => {
                        setHeroNameDraft(user?.display_name || user?.username || '')
                        setIsEditingHeroName(true)
                      }}
                    >
                      {user?.display_name || user?.username || 'T1 Member'}
                      <Edit3 size={16} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h1>
                  )}
                  {!isEditingHeroName && (
                    <span className='bg-t1-red/10 border border-t1-red/30 text-t1-red text-[10px] font-oswald font-bold tracking-widest px-3 py-0.5 uppercase'>
                      {t('profile.fan')}
                    </span>
                  )}
                </div>
                <p className='text-gray-500 text-sm flex items-center gap-2'>
                  <Mail size={12} />
                  {user?.email}
                </p>
                <p className='text-gray-600 text-[11px] mt-1 flex items-center gap-2'>
                  <Shield size={10} />
                  {t('profile.memberSince')} {memberSince}
                </p>
              </div>

              {/* Stats */}
              <div className='flex gap-6 md:gap-10'>
                {[
                  { label: t('common.order'), value: mockOrders.length },
                  { label: t('common.wishlist'), value: totalFavorites },
                  { label: t('common.spent'), value: formatPrice(totalSpent, language) }
                ].map(stat => (
                  <div key={stat.label} className='text-center'>
                    <p className='font-oswald font-black text-2xl text-white'>{stat.value}</p>
                    <p className='text-gray-600 text-[10px] tracking-widest uppercase font-oswald'>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab bar */}
            <div className='flex border-t border-white/5 -mx-4 md:-mx-10 lg:-mx-20 px-4 md:px-10 lg:px-20'>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={`relative flex items-center gap-2 py-4 pr-6 font-oswald font-bold text-[11px] tracking-widest uppercase transition-colors duration-200 ${
                    activeTab === tab.id ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className='bg-t1-red text-white text-[9px] font-inter font-bold w-4 h-4 rounded-full flex items-center justify-center'>
                      {tab.count > 9 ? '9+' : tab.count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId='my-page-tab-underline'
                      className='absolute bottom-0 left-0 right-6 h-[2px] bg-t1-red'
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='px-4 md:px-10 lg:px-20 max-w-7xl mx-auto py-10'>
          <AnimatePresence mode='wait'>

            {/* ── PROFILE TAB ── */}
            {activeTab === 'profile' && (
              <motion.div
                key='profile'
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                className='grid grid-cols-1 lg:grid-cols-3 gap-6'
              >
                {/* Account Info */}
                <div className='lg:col-span-2 space-y-4'>
                  <div className='bg-[#111] border border-white/5 p-6'>
                    <div className='flex items-center justify-between mb-6'>
                      <h2 className='font-oswald font-bold text-lg uppercase tracking-wider flex items-center gap-2'>
                        <User size={16} className='text-t1-red' />
                        {t('profile.info')}
                      </h2>
                      {saveLoading && (
                        <div className="flex items-center gap-2 text-[10px] font-oswald text-t1-red animate-pulse">
                          <Loader2 size={12} className="animate-spin" />
                          SAVING...
                        </div>
                      )}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {[
                        {
                          label: t('profile.fullName') || 'Full Name',
                          value: user?.full_name || '—',
                          icon: User,
                          editable: true,
                          field: 'full_name'
                        },
                        {
                          label: t('profile.username'),
                          value: user?.username || '—',
                          icon: Shield,
                          editable: true,
                          field: 'username'
                        },
                        {
                          label: t('profile.email'),
                          value: user?.email || '—',
                          icon: Mail,
                          editable: false
                        },
                        {
                          label: t('profile.phone'),
                          value: user?.phone_number || '—',
                          icon: Phone,
                          editable: true,
                          field: 'phone_number'
                        },
                        {
                          label: t('profile.location'),
                          value: user?.address || '—',
                          icon: MapPin,
                          editable: true,
                          field: 'address',
                          fullWidth: true
                        }
                      ].map(field => (
                        <div key={field.label} className={`bg-[#0d0d0d] border border-white/5 px-4 py-4 ${field.fullWidth ? 'md:col-span-2' : ''}`}>
                          <div className='flex items-center gap-2 mb-1'>
                            <field.icon size={12} className='text-gray-600' />
                            <span className='text-[10px] text-gray-600 font-oswald tracking-widest uppercase'>{field.label}</span>
                          </div>
                          {editingField === field.field ? (
                            field.field === 'address' ? (
                              <div className="flex items-center gap-2 w-full">
                                <button
                                  onClick={() => setIsAddressModalOpen(true)}
                                  className="flex-1 min-w-0 bg-black border border-t1-red/50 py-3 px-4 text-left text-sm text-white transition-all flex items-center justify-between group overflow-hidden"
                                >
                                  <span className="truncate flex-1">{(editForm as any).address || 'Chọn địa chỉ giao hàng...'}</span>
                                  <ChevronRight size={14} className="text-t1-red flex-shrink-0 ml-2" />
                                </button>
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() => handleRequestUpdate(field.field!, (editForm as any)[field.field!])}
                                    className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors"
                                    title="Confirm"
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingField(null)
                                      if (user) setEditForm(prev => ({ ...prev, [field.field!]: (user as any)[field.field!] || '' }))
                                    }}
                                    className="p-2 text-gray-500 hover:bg-white/5 rounded transition-colors"
                                    title="Cancel"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="relative group">
                                <input
                                  autoFocus
                                  type="text"
                                  value={(editForm as any)[field.field!]}
                                  onChange={(e) => setEditForm({ ...editForm, [field.field!]: e.target.value })}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleRequestUpdate(field.field!, (editForm as any)[field.field!])
                                    if (e.key === 'Escape') {
                                      setEditingField(null)
                                      if (user) setEditForm(prev => ({ ...prev, [field.field!]: (user as any)[field.field!] || '' }))
                                    }
                                  }}
                                  className="w-full bg-transparent border-b border-t1-red py-1 text-sm text-white outline-none transition-all pr-12"
                                />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                  <button
                                    onClick={() => handleRequestUpdate(field.field!, (editForm as any)[field.field!])}
                                    className="text-emerald-400 hover:text-emerald-300"
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingField(null)
                                      if (user) setEditForm(prev => ({ ...prev, [field.field!]: (user as any)[field.field!] || '' }))
                                    }}
                                    className="text-gray-500 hover:text-white"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="flex items-center justify-between group cursor-pointer" onClick={() => field.editable && setEditingField(field.field || null)}>
                              <p className='font-inter text-sm text-white'>{field.value}</p>
                              {field.editable && (
                                <Edit3 size={12} className="text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-t1-red transition-all" />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security */}
                  <div className='bg-[#111] border border-white/5 p-6'>
                    <h2 className='font-oswald font-bold text-lg uppercase tracking-wider flex items-center gap-2 mb-6'>
                      <Shield size={16} className='text-t1-red' />
                      {t('profile.security')}
                    </h2>
                    <div className='space-y-1'>

                      {/* Change Password */}
                      <div className='flex items-center justify-between py-4 border-b border-white/5'>
                        <div>
                          <p className='text-sm font-inter text-white'>{t('profile.changePassword')}</p>
                          <p className='text-[11px] text-gray-600'>{t('profile.lastChanged')} 30 days ago</p>
                        </div>
                        <button
                          onClick={() => setChangePwOpen(true)}
                          className='flex items-center gap-1 text-t1-red hover:text-white text-[11px] font-oswald tracking-widest uppercase transition-colors'
                        >
                          <Lock size={12} /> {t('profile.change')}
                        </button>
                      </div>

                      {/* 2FA */}
                      <div className='flex items-center justify-between py-4 border-b border-white/5'>
                        <div>
                          <p className='text-sm font-inter text-white'>{t('profile.twoFactor') || 'Two-Factor Authentication'}</p>
                          <p className='text-[11px] text-gray-600'>{twoFaEnabled ? t('profile.twoFactorDesc') : t('profile.twoFactorOff')}</p>
                        </div>
                        <button
                          onClick={() => setTwoFaEnabled(v => !v)}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${twoFaEnabled ? 'bg-t1-red' : 'bg-white/10'}`}
                        >
                          <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${twoFaEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {/* Connected Accounts */}
                      <div>
                        <div className='flex items-center justify-between py-4'>
                          <div>
                            <p className='text-sm font-inter text-white'>{t('profile.connectedAccounts')}</p>
                            <p className='text-[11px] text-gray-600'>Google · Discord</p>
                          </div>
                          <button
                            onClick={() => setConnectedOpen(v => !v)}
                            className='text-t1-red hover:text-white transition-colors'
                          >
                            <ChevronRight size={16} className={`transition-transform duration-200 ${connectedOpen ? 'rotate-90' : ''}`} />
                          </button>
                        </div>
                        <AnimatePresence>
                          {connectedOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className='overflow-hidden'
                            >
                              <div className='pb-4 space-y-2'>
                                {[
                                  { name: 'Google', color: 'text-blue-400', connected: true },
                                  { name: 'Discord', color: 'text-indigo-400', connected: true },
                                  { name: 'Twitter / X', color: 'text-gray-400', connected: false }
                                ].map(acc => (
                                  <div key={acc.name} className='flex items-center justify-between bg-[#0d0d0d] border border-white/5 px-4 py-3'>
                                    <span className={`font-oswald font-bold text-sm ${acc.color}`}>{acc.name}</span>
                                    <button
                                      className={`text-[10px] font-oswald font-bold tracking-widest uppercase px-3 py-1 border transition-colors duration-200 ${
                                        acc.connected
                                          ? 'border-white/10 text-gray-500 hover:border-red-500 hover:text-red-400'
                                          : 'border-t1-red/50 text-t1-red hover:bg-t1-red hover:text-white'
                                      }`}
                                    >
                                      {acc.connected ? t('profile.disconnect') : t('profile.connect')}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className='space-y-4'>
                  {/* Membership card */}
                  <div className='relative overflow-hidden bg-gradient-to-br from-t1-red via-[#c01025] to-[#800a18] p-6 border border-t1-red/20 shadow-[0_20px_60px_rgba(226,1,45,0.3)]'>
                    <div className='absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20' />
                    <div className='absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-16 -translate-x-16' />
                    <div className='relative'>
                      <p className='text-white/60 text-[10px] font-oswald font-bold tracking-[0.3em] uppercase mb-4'>{t('profile.cardTitle')}</p>
                      <p className='font-oswald font-black text-2xl text-white uppercase tracking-tight mb-6'>
                        {user?.username || 'T1 Fan'}
                      </p>
                      <div className='flex justify-between items-end'>
                        <div>
                          <p className='text-white/50 text-[9px] tracking-widest mb-1'>{t('profile.memberSince').toUpperCase()}</p>
                          <p className='text-white font-oswald font-bold text-sm'>{memberSince}</p>
                        </div>
                        <div className='font-oswald font-black text-4xl text-white/10 italic'>T1</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className='bg-[#111] border border-white/5 p-6 space-y-4'>
                    <h2 className='font-oswald font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-gray-400'>
                      <Star size={14} className='text-t1-red' />
                      {t('profile.summary')}
                    </h2>
                    {[
                      { label: t('profile.summaryTotalOrders'), value: mockOrders.length },
                      { label: t('profile.summaryTotalSpent'), value: formatPrice(totalSpent, language) },
                      { label: t('profile.summaryWishlist'), value: totalFavorites },
                      { label: t('profile.summaryCart'), value: totalItems }
                    ].map(stat => (
                      <div key={stat.label} className='flex items-center justify-between py-2 border-b border-white/5 last:border-0'>
                        <span className='text-gray-500 text-xs'>{stat.label}</span>
                        <span className='font-oswald font-bold text-white text-sm'>{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className='w-full flex items-center justify-center gap-2 py-4 bg-transparent border border-white/10 text-gray-500 hover:text-t1-red hover:border-t1-red font-oswald font-bold text-[11px] tracking-widest uppercase transition-all duration-200'
                  >
                    <LogOut size={14} />
                    {t('common.logout')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── WISHLIST TAB ── */}
            {activeTab === 'favorites' && (
              <motion.div
                key='favorites'
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                {favorites.length === 0 ? (
                  <div className='py-24 text-center border border-white/5 bg-[#111]'>
                    <Heart size={40} className='text-gray-700 mx-auto mb-4' />
                    <p className='font-oswald font-bold text-gray-600 tracking-[0.3em] uppercase mb-2'>{t('profile.emptyWishlist')}</p>
                    <p className='text-gray-700 text-sm mb-6'>{t('profile.emptyWishlistDesc')}</p>
                    <Link to='/shop' className='inline-block bg-t1-red text-white font-oswald font-bold text-xs tracking-widest uppercase px-8 py-3 hover:bg-white hover:text-black transition-all duration-200'>
                      {t('profile.browseShop')}
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className='flex items-center justify-between mb-6'>
                      <p className='font-oswald text-gray-500 text-sm tracking-widest uppercase'>
                        {totalFavorites} {totalFavorites === 1 ? 'Item' : 'Items'}
                      </p>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                      {favorites.map((product, i) => (
                        <motion.div
                          key={product.product_id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className='group bg-[#111] border border-white/5 hover:border-t1-red/30 transition-all duration-300 relative overflow-hidden'
                        >
                          <Link to={`/product/${product.product_id}`} className='block relative aspect-square overflow-hidden bg-[#0d0d0d]'>
                            <img
                              src={product.items?.[0]?.product_item_image || ''}
                              alt={product.product_name}
                              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100'
                            />
                          </Link>
                          <div className='p-3'>
                            <p className='font-inter text-xs text-white truncate mb-1'>{product.product_name}</p>
                            <div className='flex items-center justify-between'>
                              <span className='font-oswald font-bold text-sm text-t1-red'>
                                {formatPrice(((product.items?.[0]?.sale_price || product.items?.[0]?.product_item_price) || 0), language)}
                              </span>
                              <button
                                onClick={() => toggleFavorite(product)}
                                className='text-gray-600 hover:text-t1-red transition-colors'
                                title='Remove from wishlist'
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── CART TAB ── */}
            {activeTab === 'cart' && (
              <motion.div
                key='cart'
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                {items.length === 0 ? (
                  <div className='py-24 text-center border border-white/5 bg-[#111]'>
                    <ShoppingBag size={40} className='text-gray-700 mx-auto mb-4' />
                    <p className='font-oswald font-bold text-gray-600 tracking-[0.3em] uppercase mb-2'>{t('profile.emptyCart')}</p>
                    <p className='text-gray-700 text-sm mb-6'>{t('profile.emptyWishlistDesc')}</p>
                    <Link to='/shop' className='inline-block bg-t1-red text-white font-oswald font-bold text-xs tracking-widest uppercase px-8 py-3 hover:bg-white hover:text-black transition-all duration-200'>
                      {t('profile.browseShop')}
                    </Link>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Items */}
                    <div className='lg:col-span-2 space-y-3'>
                      {items.map((item, i) => (
                        <motion.div
                          key={`${item.id}-${item.size}`}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className='flex gap-4 bg-[#111] border border-white/5 p-4 hover:border-white/10 transition-colors'
                        >
                          <Link to={`/product/${item.id}`} className='shrink-0 w-20 h-20 bg-[#0d0d0d] overflow-hidden'>
                            <img src={item.imageUrl || ''} alt={item.name} className='w-full h-full object-cover' />
                          </Link>
                          <div className='flex-1 min-w-0'>
                            <p className='font-inter text-sm text-white truncate mb-1'>{item.name}</p>
                            <p className='text-[11px] text-gray-600 uppercase tracking-widest mb-3'>SIZE: {item.size}</p>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center border border-white/10'>
                                <button onClick={() => decrementQuantity(item.id, item.size)} className='px-3 py-1 text-gray-500 hover:text-white hover:bg-white/5 transition-colors'>
                                  <Minus size={12} />
                                </button>
                                <span className='px-3 py-1 text-sm font-oswald font-bold text-white border-x border-white/10 min-w-[36px] text-center'>{item.quantity}</span>
                                <button onClick={() => incrementQuantity(item.id, item.size)} className='px-3 py-1 text-gray-500 hover:text-white hover:bg-white/5 transition-colors'>
                                  <Plus size={12} />
                                </button>
                              </div>
                              <div className='flex items-center gap-3'>
                                <span className='font-oswald font-bold text-t1-red'>
                                  {formatPrice(item.price * item.quantity, language)}
                                </span>
                                <button onClick={() => removeCartItem(item.id, item.size)} className='text-gray-700 hover:text-t1-red transition-colors'>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className='space-y-4'>
                      <div className='bg-[#111] border border-white/5 p-6'>
                        <h3 className='font-oswald font-bold uppercase tracking-wider text-sm mb-4 text-gray-400'>{t('profile.summary')}</h3>
                        <div className='space-y-3 mb-4 pb-4 border-b border-white/5'>
                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>{t('common.subtotal')} ({totalItems} {t('common.item')})</span>
                            <span className='text-white font-oswald font-bold'>{formatPrice(totalPrice, language)}</span>
                          </div>
                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-500'>{t('common.shipping')}</span>
                            <span className='text-emerald-400 text-xs font-oswald'>{t('common.free')}</span>
                          </div>
                        </div>
                        <div className='flex justify-between mb-6'>
                          <span className='font-oswald font-bold uppercase tracking-wider'>{t('profile.summaryTotal')}</span>
                          <span className='font-oswald font-black text-xl text-t1-red'>{formatPrice(totalPrice, language)}</span>
                        </div>
                        <button className='w-full bg-t1-red text-white font-oswald font-black text-xs tracking-[0.2em] uppercase py-4 hover:bg-white hover:text-black transition-all duration-200 mb-2'>
                          {t('common.checkout')} →
                        </button>
                        <Link to='/shop' className='block text-center text-gray-600 hover:text-white text-[11px] font-oswald tracking-widest uppercase transition-colors py-2'>
                          {t('profile.seeMore')}
                        </Link>
                      </div>

                      <div className='bg-[#111] border border-white/5 p-4'>
                        <p className='text-[11px] text-gray-600 font-oswald tracking-widest uppercase mb-3 flex items-center gap-2'>
                          <Shield size={12} className='text-t1-red' /> {t('common.secureCheckout')}
                        </p>
                        <div className='flex gap-2 text-gray-700 text-[10px] font-inter leading-relaxed'>
                          <CheckCircle size={12} className='text-t1-red shrink-0 mt-0.5' />
                          <span>Free returns within 30 days. All payments secured with SSL encryption.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── ORDERS TAB ── */}
            {activeTab === 'orders' && (
              <motion.div
                key='orders'
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                className='space-y-4'
              >
                <p className='font-oswald text-gray-500 text-sm tracking-widest uppercase'>
                  {mockOrders.length} {t('common.order')}
                </p>
                {mockOrders.map((order, i) => {
                  const statusCfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
                  const isExpanded = expandedOrder === order.id
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`bg-[#111] border transition-colors duration-300 overflow-hidden ${isExpanded ? 'border-t1-red/30' : 'border-white/5'}`}
                    >
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className='w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 text-left'
                      >
                        <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                          <div>
                            <p className='font-oswald font-bold text-white tracking-wider text-sm'>#{order.id}</p>
                            <p className='text-[11px] text-gray-600 mt-0.5'>{order.date}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-oswald font-bold tracking-widest uppercase border px-3 py-1 ${statusCfg.color}`}>
                            <statusCfg.icon size={10} />
                            {t(`status.${order.status.toLowerCase()}`)}
                          </span>
                        </div>
                        <div className='flex items-center gap-4'>
                          <div className='text-right'>
                            <p className='font-oswald font-black text-t1-red'>{formatPrice(order.total, language)}</p>
                            <p className='text-[10px] text-gray-600'>{order.items.length} items</p>
                          </div>
                          <ChevronRight
                            size={16}
                            className={`text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                          />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className='overflow-hidden'
                          >
                            <div className='border-t border-white/5 p-5 space-y-3'>
                              {order.items.map((item, j) => (
                                <div key={j} className='flex items-center gap-4 py-2'>
                                  <div className='w-14 h-14 shrink-0 bg-[#0d0d0d] overflow-hidden'>
                                    <img src={item.image} alt={item.name} className='w-full h-full object-cover opacity-70' />
                                  </div>
                                  <div className='flex-1 min-w-0'>
                                    <p className='font-inter text-sm text-white truncate'>{item.name}</p>
                                    <p className='text-[11px] text-gray-600 uppercase'>Size: {item.size} · Qty: {item.qty}</p>
                                  </div>
                                  <p className='font-oswald font-bold text-sm text-t1-red shrink-0'>{formatPrice(item.price, language)}</p>
                                </div>
                              ))}
                              <div className='pt-3 border-t border-white/5 flex justify-between items-center'>
                                <span className='text-gray-600 text-xs'>{t('profile.summaryTotal')}</span>
                                <span className='font-oswald font-black text-white'>{formatPrice(order.total, language)}</span>
                              </div>
                              {order.status === 'DELIVERED' && (
                                <button className='w-full mt-2 border border-white/10 text-gray-500 hover:border-t1-red hover:text-t1-red font-oswald font-bold text-[10px] tracking-widest uppercase py-3 transition-all duration-200'>
                                  WRITE A REVIEW
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
        {/* ── CHANGE PASSWORD MODAL ── */}
        <AnimatePresence>
          {changePwOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4'
              onClick={() => setChangePwOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                onClick={e => e.stopPropagation()}
                className='bg-[#111] border border-white/10 w-full max-w-md relative'
              >
                {/* Top red accent */}
                <div className='absolute top-0 left-0 w-full h-[2px] bg-t1-red' />

                <div className='p-8'>
                  <div className='flex items-center justify-between mb-8'>
                    <h3 className='font-oswald font-black text-xl uppercase tracking-wider text-white flex items-center gap-2'>
                      <Lock size={18} className='text-t1-red' />
                      {t('profile.changePassword')}
                    </h3>
                    <button onClick={() => setChangePwOpen(false)} className='text-gray-600 hover:text-white transition-colors'>
                      <X size={18} />
                    </button>
                  </div>

                  <div className='space-y-5'>
                    {/* Current Password */}
                    {(['current', 'next', 'confirm'] as const).map(field => (
                      <div key={field} className='space-y-2'>
                        <label className='block text-[10px] font-oswald font-bold text-gray-500 tracking-widest uppercase'>
                          {field === 'current' ? 'Current Password' : field === 'next' ? 'New Password' : 'Confirm New Password'}
                        </label>
                        <div className='relative'>
                          <input
                            type={pwShow[field] ? 'text' : 'password'}
                            value={pwForm[field]}
                            onChange={e => setPwForm(f => ({ ...f, [field]: e.target.value }))}
                            className='w-full bg-black border border-white/10 py-3 pl-4 pr-10 text-sm text-white outline-none focus:border-t1-red transition-all placeholder:text-gray-700'
                            placeholder={field === 'current' ? 'Enter current password' : field === 'next' ? 'Min. 8 characters' : 'Repeat new password'}
                          />
                          <button
                            type='button'
                            onClick={() => setPwShow(s => ({ ...s, [field]: !s[field] }))}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors'
                          >
                            {pwShow[field] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Error */}
                    {pwError && (
                      <p className='text-t1-red text-xs font-inter'>{pwError}</p>
                    )}

                    {/* Success */}
                    {pwSuccess && (
                      <p className='text-emerald-400 text-xs font-inter flex items-center gap-1'>
                        <CheckCircle size={12} /> Password changed successfully!
                      </p>
                    )}

                    <div className='flex gap-3 pt-2'>
                      <button
                        onClick={() => setChangePwOpen(false)}
                        className='flex-1 py-3 border border-white/10 text-gray-500 hover:text-white hover:border-white/30 font-oswald font-bold text-xs tracking-widest uppercase transition-all'
                      >
                        {t('common.clear')}
                      </button>
                      <button
                        onClick={handleChangePw}
                        disabled={pwSuccess}
                        className='flex-1 py-3 bg-t1-red text-white font-oswald font-black text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all disabled:opacity-60 disabled:cursor-not-allowed'
                      >
                        {pwSuccess ? 'Saved!' : t('profile.change')}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onSave={(newAddress) => {
            setEditForm({ ...editForm, address: newAddress })
            handleRequestUpdate('address', newAddress)
          }}
        />

        {/* Confirmation Modal */}
        <AnimatePresence>
          {confirmModal?.isOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmModal(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm bg-[#111] border border-white/10 p-8 shadow-2xl text-center"
              >
                <div className="w-16 h-16 bg-t1-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="text-t1-red" size={32} />
                </div>
                <h3 className="font-oswald font-black text-2xl uppercase tracking-tight mb-2">Xác nhận thay đổi?</h3>
                <p className="text-gray-400 text-sm font-inter mb-8">
                  Bạn có chắc chắn muốn thay đổi
                  <span className="text-white font-bold mx-1">
                    {t(`profile.${confirmModal.field}`) || confirmModal.field}
                  </span>
                  thành
                  <span className="text-t1-red font-bold mx-1">
                    {confirmModal.value}
                  </span>?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setConfirmModal(null)}
                    className="flex-1 py-4 border border-white/10 font-oswald font-bold text-xs tracking-widest uppercase hover:text-white hover:border-white transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmUpdate}
                    className="flex-1 py-4 bg-t1-red text-white font-oswald font-black text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                  >
                    {saveLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Xác nhận
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}
