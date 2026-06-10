import { useState, useEffect, useMemo, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useCart } from '~/contexts/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '~/contexts/LanguageContext'
import { formatPrice } from '~/utils/format'
import productApi from '~/apis/productApi'

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeCartItem, incrementQuantity, decrementQuantity, updateCartItemSize } = useCart()
  const { t, language } = useLanguage()
  const navigate = useNavigate()

  const [allProducts, setAllProducts] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (open) {
      productApi.getAll().then(res => {
        setAllProducts(res.data || res)
      }).catch(err => {
        console.error("Failed to load products in cart drawer", err)
      })
    }
  }, [open])

  const isCartItemOutOfStock = useCallback((item: any) => {
    if (allProducts.length === 0) return false
    const prod = allProducts.find(p => p.product_id === item.id)
    if (!prod) return false
    const variant = prod.items?.find((v: any) => v.size?.toUpperCase() === item.size?.toUpperCase())
    if (!variant) return true
    return variant.stock_quantity === 0
  }, [allProducts])

  const handleUpdateSize = useCallback((productId: number, oldSize: string, newSize: string) => {
    const prod = allProducts.find(p => p.product_id === productId)
    if (!prod) return
    const variant = prod.items?.find((v: any) => v.size?.toUpperCase() === newSize.toUpperCase())
    if (!variant) return

    const price = Number(variant.sale_price !== undefined && variant.sale_price !== null ? variant.sale_price : variant.product_item_price)
    const originalPrice = variant.sale_price ? Number(variant.product_item_price) : null

    updateCartItemSize(productId, oldSize, newSize, price, originalPrice, variant.stock_quantity)
  }, [allProducts, updateCartItemSize])

  useEffect(() => {
    if (items.length > 0 && allProducts.length > 0) {
      setSelectedItems(prev => {
        const next = { ...prev }
        let changed = false
        items.forEach(item => {
          const key = `${item.id}-${item.size}`
          if (next[key] === undefined) {
            const outOfStock = isCartItemOutOfStock(item)
            next[key] = !outOfStock
            changed = true
          }
        })
        return changed ? next : prev
      })
    }
  }, [items, allProducts, isCartItemOutOfStock])

  const selectedCartItems = useMemo(() => {
    return items.filter(item => {
      const key = `${item.id}-${item.size}`
      const isSelected = selectedItems[key] ?? false
      const outOfStock = isCartItemOutOfStock(item)
      return isSelected && !outOfStock
    })
  }, [items, selectedItems, isCartItemOutOfStock])

  const selectedTotalPrice = useMemo(() => {
    return selectedCartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
  }, [selectedCartItems])

  const selectedTotalItems = useMemo(() => {
    return selectedCartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
  }, [selectedCartItems])

  const totalItemsCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay / Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/60 backdrop-blur-md z-[990] cursor-pointer'
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: 'easeOut' }}
            className='fixed top-0 right-0 h-full w-[450px] max-w-[85vw] bg-[#111111] text-t1-text z-[999] shadow-2xl flex flex-col border-l border-t1-gray/50'
          >
            {/* Header */}
            <div className='flex items-center justify-between px-6 py-5 border-b border-t1-gray/40 bg-black/40'>
              <h2 className='text-2xl font-oswald font-black italic tracking-[0.2em] uppercase text-white flex items-center'>
                {t('cart.title')} <span className="text-xs font-inter font-normal not-italic tracking-normal text-t1-red ml-3 bg-t1-red/10 px-2 py-0.5 rounded-full border border-t1-red/20">{totalItemsCount} {t('cart.items')}</span>
              </h2>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-t1-red hover:rotate-90 transition-all duration-300 focus:outline-none'
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>

            {/* Content */}
            <div className='flex-1 flex flex-col overflow-hidden'>
              {items.length === 0 ? (
                <div className='flex-1 flex items-center justify-center flex-col gap-6 p-8'>
                  <div className='w-24 h-24 rounded-full bg-t1-gray/10 flex items-center justify-center border border-t1-gray/20'>
                    <span className="text-4xl grayscale opacity-30">🛍️</span>
                  </div>
                  <p className='text-sm text-gray-500 font-inter font-light tracking-wide'>{t('cart.empty')}</p>
                  <button
                    className='py-3 px-8 bg-transparent text-t1-red uppercase text-xs font-oswald font-bold tracking-[0.2em] hover:bg-t1-red hover:text-white border-2 border-t1-red transition-all duration-300'
                    onClick={onClose}
                  >
                    {t('cart.continueShopping')}
                  </button>
                </div>
              ) : (
                <div className='flex-1 overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-t1-gray/50 hover:[&::-webkit-scrollbar-thumb]:bg-t1-red'>
                  <div className='flex flex-col gap-6'>
                    {items.map((item) => {
                      const outOfStock = isCartItemOutOfStock(item)
                      const itemKey = `${item.id}-${item.size}`
                      const isChecked = selectedItems[itemKey] ?? false
                      const prod = allProducts.find(p => p.product_id === item.id)
                      const variant = prod?.items?.find((v: any) => v.size?.toUpperCase() === item.size?.toUpperCase())
                      const stockQuantity = variant ? variant.stock_quantity : 0

                      return (
                        <div
                          key={itemKey}
                          className={`flex items-center gap-3 border-b border-t1-gray/20 pb-6 group transition-all duration-300 ${
                            outOfStock
                              ? 'opacity-40'
                              : isChecked
                                ? 'bg-[#141414]/30'
                                : 'hover:bg-white/[0.01]'
                          }`}
                        >
                          {/* Checkbox */}
                          <div className="flex items-center justify-center shrink-0">
                            <input
                              type="checkbox"
                              checked={!outOfStock && isChecked}
                              disabled={outOfStock}
                              onChange={(e) => {
                                setSelectedItems(prev => ({
                                  ...prev,
                                  [itemKey]: e.target.checked
                                }))
                              }}
                              className={`w-4 h-4 rounded border bg-transparent checked:bg-t1-red checked:border-t1-red focus:ring-0 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${
                                outOfStock ? 'border-gray-800' : 'border-white/20'
                              }`}
                            />
                          </div>

                          {/* Image */}
                          <Link
                            to={`/product/${item.id}`}
                            onClick={onClose}
                            className="w-20 h-28 bg-[#222222] shrink-0 border border-t1-gray/20 group-hover:border-t1-red/50 transition-colors overflow-hidden relative"
                          >
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className='w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500'
                              />
                            )}
                            {outOfStock && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="bg-red-600 text-[8px] font-oswald font-bold px-1.5 py-0.5 tracking-wider text-white uppercase italic text-center">
                                  {language === 'vi' ? 'HẾT HÀNG' : 'SOLD OUT'}
                                </span>
                              </div>
                            )}
                          </Link>

                          {/* Info */}
                          <div className='flex-1 flex flex-col pt-1 min-w-0'>
                            <div className='flex justify-between items-start gap-2'>
                              <Link
                                to={`/product/${item.id}`}
                                onClick={onClose}
                                className='font-oswald font-bold text-sm tracking-wide text-white uppercase hover:text-t1-red transition-colors truncate pr-1'
                              >
                                {item.name}
                              </Link>
                              <button
                                onClick={() => removeCartItem(item.id, item.size)}
                                className='text-gray-600 hover:text-t1-red transition-colors flex-shrink-0 mt-0.5'
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className='flex items-center gap-2 mt-1 mb-2 flex-wrap'>
                              <div className='flex items-center gap-2'>
                                <p className='font-incosolata font-bold text-t1-red text-xs'>{formatPrice(item.price, language)}</p>
                                {item.originalPrice && item.originalPrice > item.price && (
                                  <span className="text-[10px] text-gray-500 line-through font-light">
                                    {formatPrice(item.originalPrice, language)}
                                  </span>
                                )}
                              </div>
                              {(() => {
                                const prod = allProducts.find(p => p.product_id === item.id)
                                const availableVariants = prod?.items?.filter((v: any) => v.stock_quantity > 0) || []
                                
                                return availableVariants.length > 0 ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] text-gray-500 uppercase tracking-widest">{t('cart.size') || 'SIZE'}:</span>
                                    <select
                                      value={item.size}
                                      onChange={(e) => handleUpdateSize(item.id, item.size, e.target.value)}
                                      disabled={outOfStock}
                                      className="bg-transparent text-white border border-white/10 px-1.5 py-0.2 text-[10px] font-oswald font-bold outline-none cursor-pointer hover:border-t1-red focus:border-t1-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {!availableVariants.some((v: any) => v.size?.toUpperCase() === item.size?.toUpperCase()) && (
                                        <option value={item.size} className="bg-[#111] text-gray-500">
                                          {item.size}
                                        </option>
                                      )}
                                      {availableVariants.map((v: any) => (
                                        <option key={v.size} value={v.size} className="bg-[#111] text-white">
                                          {v.size}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                ) : (
                                  <span className="text-[9px] bg-t1-gray/20 text-gray-400 px-1.5 py-0.5 font-oswald font-bold tracking-widest border border-t1-gray/10 uppercase">
                                    {t('cart.size')}: {item.size}
                                  </span>
                                )
                              })()}
                              {outOfStock && (
                                <span className="text-[8px] font-bold text-red-500 tracking-wider uppercase border border-red-500/20 bg-red-500/10 px-1 py-0.2">
                                  {language === 'vi' ? 'Hết hàng' : 'Sold Out'}
                                </span>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className='mt-auto flex items-center justify-between gap-2'>
                              <div className='flex items-center gap-2 bg-t1-dark border border-t1-gray/30 w-fit px-1.5 py-0.5'>
                                <button
                                  onClick={() => !outOfStock && decrementQuantity(item.id, item.size)}
                                  disabled={outOfStock}
                                  className='text-gray-400 hover:text-white p-0.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
                                >
                                  <Minus size={10} strokeWidth={3} />
                                </button>
                                <span className={`font-inter text-xs font-medium w-4 text-center ${outOfStock ? 'text-gray-600' : 'text-white'}`}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => !outOfStock && item.quantity < stockQuantity && incrementQuantity(item.id, item.size)}
                                  disabled={outOfStock || item.quantity >= stockQuantity}
                                  className='text-gray-400 hover:text-white p-0.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
                                >
                                  <Plus size={10} strokeWidth={3} />
                                </button>
                              </div>

                              <div className="flex flex-col items-end">
                                <span className='font-oswald text-[10px] tracking-wider text-gray-500'>
                                  {t('cart.total')}:{' '}
                                  <span className={`font-oswald font-bold ${outOfStock ? 'text-gray-600 line-through' : 'text-t1-text'}`}>
                                    {formatPrice(item.price * item.quantity, language)}
                                  </span>
                                </span>
                                {item.originalPrice && item.originalPrice > item.price && !outOfStock && (
                                  <span className="text-[9px] text-gray-500 line-through font-light">
                                    {formatPrice(item.originalPrice * item.quantity, language)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Action Area */}
              {items.length > 0 && (
                <div className='p-6 border-t border-t1-gray/40 bg-[#0a0a0a] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-10'>
                  <div className='flex justify-between items-end mb-4'>
                    <span className='text-xs font-inter font-bold text-gray-400 uppercase tracking-widest'>
                      {t('cart.subtotal')} ({selectedTotalItems} {language === 'vi' ? 'được chọn' : 'selected'})
                    </span>
                    <span className='text-3xl font-oswald font-black text-t1-red italic tracking-wide'>{formatPrice(selectedTotalPrice, language)}</span>
                  </div>
                  <p className='text-xs text-gray-500 font-inter mb-6 italic border-b border-t1-gray/20 pb-4'>{t('cart.shippingAtCheckout')}</p>
                  <button
                    disabled={selectedCartItems.length === 0}
                    className='w-full py-4 bg-t1-red text-white uppercase text-sm font-oswald font-bold tracking-[0.2em] shadow-[0_0_15px_rgba(226,1,45,0.3)] hover:shadow-[0_0_25px_rgba(226,1,45,0.7)] hover:bg-[#ff0033] disabled:bg-t1-gray/40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 focus:outline-none'
                    onClick={() => {
                      onClose()
                      navigate('/checkout', { state: { selectedItems: selectedCartItems } })
                    }}
                  >
                    {t('cart.checkout')} ({selectedCartItems.length})
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default CartDrawer
