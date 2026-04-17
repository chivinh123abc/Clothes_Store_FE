import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '~/contexts/CartContext'
import { useFavorites } from '~/contexts/FavoritesContext'
import { useAuth } from '~/hooks/useAuth'
import LoginModal from '~/components/Modals/LoginModal/LoginModal'
import { useLanguage } from '~/contexts/LanguageContext'

interface ProductCardProps {
  product_id: number;
  product_name: string;
  items?: {
    product_item_price: number;
    product_item_image: string;
    sale_price?: number | null;
  }[];
  badge?: 'NEW' | 'SALE';
  soldOut?: boolean;
}

export function ProductCard({
  product_id,
  product_name,
  items,
  badge,
  soldOut
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { addCartItem } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { user } = useAuth()
  const { t } = useLanguage()

  const price = items?.[0]?.product_item_price ?? 0
  const image = items?.[0]?.product_item_image ?? ''
  const salePrice = items?.[0]?.sale_price ?? undefined

  const favorited = isFavorite(product_id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      setIsLoginOpen(true)
      return
    }
    toggleFavorite({
      product_id,
      product_name,
      product_slug: product_name.toLowerCase().replace(/ /g, '-'),
      items: items as any,
      soldOut: soldOut ?? false,
      sold_count: 0,
      created_at: new Date().toISOString()
    })
  }

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (isAdded) {
      timeout = setTimeout(() => setIsAdded(false), 2000)
    }
    return () => clearTimeout(timeout)
  }, [isAdded])

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product_id}`} className='block'>
        <div className='relative aspect-[3/4] bg-[#222222] overflow-hidden mb-4 border border-t1-gray/50 group-hover:border-t1-red/50 transition-colors duration-300'>
          <img
            src={image}
            alt={product_name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
              soldOut ? ' opacity-40 ' : ''
            }`}
          />

          {/* Badge */}
          {!soldOut && badge && (
            <span
              className={`absolute top-0 left-0 z-20 px-4 py-1.5 text-[10px] font-oswald font-bold tracking-widest ${
                badge === 'NEW'
                  ? 'bg-t1-text text-t1-dark'
                  : 'bg-t1-red text-white'
              }`}
            >
              {badge === 'NEW' ? t('shop.newArrivals').split(' ')[0].toUpperCase() : t('shop.sale').toUpperCase()}
            </span>
          )}
          {soldOut && (
            <div className='absolute inset-0 z-20 flex items-center justify-center bg-black/60'>
              <span className='px-6 py-3 text-xl font-oswald font-bold tracking-[0.2em] uppercase text-white border-2 border-white/20 italic'>
                {t('productDetail.soldOut')}
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <motion.button
            onClick={handleFavoriteClick}
            whileTap={{ scale: 0.8 }}
            className={`absolute top-4 right-4 z-30 w-10 h-10 backdrop-blur-md border rounded-full flex items-center justify-center transition-all duration-300 ${favorited ? 'opacity-100 bg-t1-red border-t1-red shadow-[0_0_15px_rgba(226,1,45,0.5)]' : 'opacity-0 group-hover:opacity-100 bg-t1-dark/80 border-white/10 hover:bg-t1-red hover:border-t1-red hover:shadow-[0_0_15px_rgba(226,1,45,0.4)]'}`}
          >
            <Heart
              size={18}
              className={`transition-all duration-200 ${favorited ? 'fill-white text-white' : 'text-white'}`}
            />
          </motion.button>

          {/* Add to Cart Button - only show when not sold out */}
          {!soldOut && (
            <button
              className={`absolute bottom-4 right-4 z-30 w-11 h-11 backdrop-blur-md border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden ${
                isAdded
                  ? 'bg-green-500 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-110'
                  : 'bg-white/90 border-white text-t1-dark hover:bg-t1-red hover:border-t1-red hover:text-white hover:shadow-[0_0_15px_rgba(226,1,45,0.5)] hover:scale-110'
              }`}
              onClick={(e) => {
                e.preventDefault()
                setIsAdded(true)
                addCartItem({
                  id: product_id,
                  name: product_name,
                  price: salePrice ?? price,
                  imageUrl: image,
                  size: 'M'
                })
              }}
            >
              <AnimatePresence mode='wait'>
                {isAdded ? (
                  <motion.div
                    key="added"
                    initial={{ scale: 0.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check size={20} strokeWidth={3} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ShoppingCart size={18} strokeWidth={2.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>

        <div className='space-y-3 p-2 relative transition-all duration-300'>
          <h3 className='font-oswald font-bold text-lg uppercase tracking-wide group-hover:text-t1-red transition-colors duration-300 truncate'>
            {product_name}
          </h3>
          <div className='flex items-center gap-3'>
            {salePrice ? (
              <div className='flex items-baseline gap-2'>
                <span className='font-oswald font-bold text-xl text-t1-red'>
                  ${salePrice.toFixed(2)}
                </span>
                <span className='text-xs text-gray-500 line-through font-light'>
                  ${price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className='font-oswald font-bold text-xl text-t1-text tracking-wide'>${price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Login gate modal */}
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </motion.div>
  )
}
