import { AnimatePresence, motion } from 'framer-motion'
import { X, Heart, Trash2, ShoppingCart } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useFavorites } from '~/contexts/FavoritesContext'
import { useCart } from '~/contexts/CartContext'
import { Link } from 'react-router-dom'

interface FavoritesDrawerProps {
  open: boolean
  onClose: () => void
}

function FavoritesDrawer({ open, onClose }: FavoritesDrawerProps) {
  const { favorites, toggleFavorite, clearFavorites, totalFavorites } = useFavorites()
  const { addCartItem } = useCart()

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/60 backdrop-blur-md z-[990] cursor-pointer'
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: 'easeOut' }}
            className='fixed top-0 right-0 h-full w-[450px] max-w-[85vw] bg-[#111111] text-t1-text z-[999] shadow-2xl flex flex-col border-l border-t1-gray/50'
          >
            {/* Header */}
            <div className='flex items-center justify-between px-6 py-5 border-b border-t1-gray/40 bg-black/40'>
              <h2 className='text-2xl font-oswald font-black italic tracking-[0.2em] uppercase text-white flex items-center gap-3'>
                <Heart size={20} className='text-t1-red fill-t1-red' />
                FAVORITES
                <span className='text-xs font-inter font-normal not-italic tracking-normal text-t1-red ml-1 bg-t1-red/10 px-2 py-0.5 rounded-full border border-t1-red/20'>
                  {totalFavorites} ITEMS
                </span>
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
              {favorites.length === 0 ? (
                <div className='flex-1 flex items-center justify-center flex-col gap-6 p-8'>
                  <div className='w-24 h-24 rounded-full bg-t1-gray/10 flex items-center justify-center border border-t1-gray/20'>
                    <Heart size={36} className='text-gray-600' />
                  </div>
                  <p className='text-sm text-gray-500 font-inter font-light tracking-wide'>Your wishlist is empty.</p>
                  <button
                    className='py-3 px-8 bg-transparent text-t1-red uppercase text-xs font-oswald font-bold tracking-[0.2em] hover:bg-t1-red hover:text-white border-2 border-t1-red transition-all duration-300'
                    onClick={onClose}
                  >
                    EXPLORE PRODUCTS
                  </button>
                </div>
              ) : (
                <div className='flex-1 overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-t1-gray/50 hover:[&::-webkit-scrollbar-thumb]:bg-t1-red'>
                  <div className='flex flex-col gap-6'>
                    {favorites.map((item) => {
                      const image = item.items?.[0]?.product_item_image ?? null
                      const price = item.items?.[0]?.product_item_price ?? 0
                      const salePrice = item.items?.[0]?.sale_price ?? undefined

                      return (
                        <motion.div
                          key={item.product_id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className='flex gap-4 border-b border-t1-gray/20 pb-6 group'
                        >
                          <Link
                            to={`/product/${item.product_id}`}
                            onClick={onClose}
                            className='w-24 h-32 bg-[#222222] shrink-0 border border-t1-gray/20 group-hover:border-t1-red/50 transition-colors overflow-hidden'
                          >
                            {image && (
                              <img
                                src={image}
                                alt={item.product_name}
                                className='w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500'
                              />
                            )}
                          </Link>

                          <div className='flex-1 flex flex-col pt-1'>
                            <div className='flex justify-between items-start'>
                              <Link
                                to={`/product/${item.product_id}`}
                                onClick={onClose}
                                className='font-oswald font-bold text-base tracking-wide text-white uppercase hover:text-t1-red transition-colors line-clamp-2 pr-2'
                              >
                                {item.product_name}
                              </Link>
                              <button
                                onClick={() => toggleFavorite(item)}
                                className='text-t1-red hover:text-gray-400 transition-colors flex-shrink-0 mt-1'
                                title='Remove from favorites'
                              >
                                <Heart size={16} className='fill-current' />
                              </button>
                            </div>

                            <p className='font-oswald font-bold text-t1-red text-sm mt-1 mb-3'>
                              ${(salePrice ?? price).toFixed(2)}
                              {salePrice && (
                                <span className='text-gray-600 line-through text-xs ml-2 font-normal'>
                                  ${price.toFixed(2)}
                                </span>
                              )}
                            </p>

                            {/* Add to Cart */}
                            {!item.soldOut && (
                              <button
                                onClick={() => {
                                  addCartItem({
                                    id: item.product_id,
                                    name: item.product_name,
                                    price: salePrice ?? price,
                                    imageUrl: image,
                                    size: 'M'
                                  })
                                }}
                                className='mt-auto flex items-center gap-2 text-[10px] font-oswald font-bold tracking-widest uppercase text-gray-400 hover:text-white border border-white/10 hover:border-t1-red hover:bg-t1-red/10 px-3 py-2 transition-all w-fit'
                              >
                                <ShoppingCart size={12} />
                                ADD TO CART
                              </button>
                            )}
                            {item.soldOut && (
                              <span className='mt-auto text-[10px] font-oswald font-bold tracking-widest uppercase text-gray-600 border border-white/5 px-3 py-2 w-fit'>
                                SOLD OUT
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Footer */}
              {favorites.length > 0 && (
                <div className='p-6 border-t border-t1-gray/40 bg-[#0a0a0a] z-10'>
                  <div className='flex justify-between items-center mb-4'>
                    <span className='text-xs font-inter text-gray-500 uppercase tracking-widest'>
                      {totalFavorites} saved item{totalFavorites !== 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={clearFavorites}
                      className='flex items-center gap-2 text-[10px] font-oswald font-bold tracking-widest uppercase text-gray-600 hover:text-t1-red transition-colors'
                    >
                      <Trash2 size={12} />
                      CLEAR ALL
                    </button>
                  </div>
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

export default FavoritesDrawer
