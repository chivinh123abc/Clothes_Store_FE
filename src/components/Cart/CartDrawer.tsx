import { AnimatePresence, motion } from 'framer-motion'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useCart } from '~/contexts/CartContext'
import { Link } from 'react-router-dom'
import { useLanguage } from '~/contexts/LanguageContext'

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalItems, totalPrice, removeCartItem, incrementQuantity, decrementQuantity } = useCart()
  const { t } = useLanguage()

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
                {t('cart.title')} <span className="text-xs font-inter font-normal not-italic tracking-normal text-t1-red ml-3 bg-t1-red/10 px-2 py-0.5 rounded-full border border-t1-red/20">{totalItems} {t('cart.items')}</span>
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
                    {items.map((item) => (
                      <div key={item.id} className='flex gap-4 border-b border-t1-gray/20 pb-6 group'>
                        <Link to={`/product/${item.id}`} onClick={onClose} className="w-24 h-32 bg-[#222222] shrink-0 border border-t1-gray/20 group-hover:border-t1-red/50 transition-colors overflow-hidden">
                          <img src={item.imageUrl} alt={item.name} className='w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500' />
                        </Link>
                        <div className='flex-1 flex flex-col pt-1'>
                          <div className='flex justify-between items-start'>
                            <Link to={`/product/${item.id}`} onClick={onClose} className='font-oswald font-bold text-base tracking-wide text-white uppercase hover:text-t1-red transition-colors line-clamp-2 pr-2'>
                              {item.name}
                            </Link>
                            <button onClick={() => removeCartItem(item.id, item.size)} className='text-gray-600 hover:text-t1-red transition-colors flex-shrink-0 mt-1'>
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className='flex items-center gap-3 mt-1 mb-2'>
                            <p className='font-incosolata font-bold text-t1-red text-sm'>${item.price.toFixed(2)}</p>
                            <span className="text-[10px] bg-t1-gray/20 text-gray-400 px-2 py-0.5 font-oswald font-bold tracking-widest border border-t1-gray/10 uppercase">{t('cart.size')}: {item.size}</span>
                          </div>

                          {/* Quantity Controls */}
                          <div className='mt-auto flex items-center justify-between'>
                            <div className='flex items-center gap-3 bg-t1-dark border border-t1-gray/30 w-fit px-2 py-1'>
                              <button onClick={() => decrementQuantity(item.id, item.size)} className='text-gray-400 hover:text-white p-1 transition-colors'>
                                <Minus size={12} strokeWidth={3} />
                              </button>
                              <span className='font-inter text-xs text-white font-medium w-4 text-center'>{item.quantity}</span>
                              <button onClick={() => incrementQuantity(item.id, item.size)} className='text-gray-400 hover:text-white p-1 transition-colors'>
                                <Plus size={12} strokeWidth={3} />
                              </button>
                            </div>
                            <span className='font-oswald text-xs tracking-wider text-gray-500'>{t('cart.total')}: <span className="text-t1-text">${(item.price * item.quantity).toFixed(2)}</span></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Area */}
              {items.length > 0 && (
                <div className='p-6 border-t border-t1-gray/40 bg-[#0a0a0a] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-10'>
                  <div className='flex justify-between items-end mb-4'>
                    <span className='text-xs font-inter font-bold text-gray-400 uppercase tracking-widest'>{t('cart.subtotal')}</span>
                    <span className='text-3xl font-oswald font-black text-t1-red italic tracking-wide'>${totalPrice.toFixed(2)}</span>
                  </div>
                  <p className='text-xs text-gray-500 font-inter mb-6 italic border-b border-t1-gray/20 pb-4'>{t('cart.shippingAtCheckout')}</p>
                  <button
                    className='w-full py-4 bg-t1-red text-white uppercase text-sm font-oswald font-bold tracking-[0.2em] shadow-[0_0_15px_rgba(226,1,45,0.3)] hover:shadow-[0_0_25px_rgba(226,1,45,0.7)] hover:bg-[#ff0033] transition-all duration-300 focus:outline-none'
                    onClick={() => {
                      // Proceed to checkout logic
                    }}
                  >
                    {t('cart.checkout')}
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
