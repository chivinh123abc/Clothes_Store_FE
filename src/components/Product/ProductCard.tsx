import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '~/contexts/CartContext'
import { useFavorites } from '~/contexts/FavoritesContext'
import { useAuth } from '~/hooks/useAuth'
import LoginModal from '~/components/Modals/LoginModal/LoginModal'
import { useLanguage } from '~/contexts/LanguageContext'
import { formatPrice } from '~/utils/format'

interface ProductCardProps {
  product_id: number;
  product_name: string;
  items?: {
    product_item_price: number;
    product_item_image: string | null;
    sale_price?: number | null;
    stock_quantity?: number;
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
  const { t, language } = useLanguage()

  const price = items?.[0]?.product_item_price ?? 0
  const image = items?.[0]?.product_item_image ?? ''
  const salePrice = items?.[0]?.sale_price ?? undefined

  const isSoldOut = soldOut ?? (
    items && items.length > 0
      ? items.every(item => item.stock_quantity === 0)
      : true
  )

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
      soldOut: isSoldOut,
      sold_count: 0,
      created_at: new Date().toISOString()
    })
  }

  useEffect(() => {
    if (isAdded) {
      const timer = setTimeout(() => setIsAdded(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isAdded])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className='group relative bg-t1-gray/5 border border-white/5 overflow-hidden transition-all duration-300 hover:border-t1-red/20'
    >
      <Link to={`/product/${product_id}`} className='block relative overflow-hidden bg-[#0d0d0d] aspect-square'>
        {/* Product Image */}
        {image && (
          <img
            src={image}
            alt={product_name}
            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
          />
        )}

        {/* Badge */}
        {badge === 'NEW' && !isSoldOut && (
          <div className='absolute top-4 left-4 z-20 bg-white text-t1-dark font-oswald font-bold px-3 py-1 text-xs tracking-widest italic shadow-lg shadow-white/10'>
            {t('shop.new').toUpperCase()}
          </div>
        )}
        {(badge === 'SALE' || (salePrice && salePrice < price)) && !isSoldOut && (
          <div className='absolute top-4 left-4 z-20 bg-t1-red text-white font-oswald font-bold px-3 py-1 text-xs tracking-widest italic shadow-lg shadow-t1-red/20'>
            {t('shop.sale').toUpperCase()}
          </div>
        )}

        {/* Sold out Badge */}
        {isSoldOut && (
          <div className='absolute inset-0 bg-black/60 flex items-center justify-center z-20 transition-all duration-500'>
            <span className='px-4 py-2 text-md font-oswald font-black text-white border-2 border-white italic uppercase tracking-[0.2em]'>
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
        {!isSoldOut && (
          <button
            className={`absolute bottom-4 right-4 z-30 w-11 h-11 backdrop-blur-md border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden ${
              isAdded
                ? 'bg-green-500 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-110'
                : 'bg-white/90 border-white text-t1-dark hover:bg-t1-red hover:border-t1-red hover:text-white hover:shadow-[0_0_15px_rgba(226,1,45,0.5)] hover:scale-110'
            }`}
            onClick={(e) => {
              e.preventDefault()
              setIsAdded(true)
              const firstItem = items?.[0]
              const stock = firstItem?.stock_quantity ?? 0
              addCartItem({
                id: product_id,
                name: product_name,
                price: salePrice ?? price,
                originalPrice: salePrice ? price : null,
                imageUrl: image,
                size: 'M'
              }, 1, stock)
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
      </Link>

      <div className='space-y-3 p-2 relative transition-all duration-300'>
        <h3 className='font-oswald font-bold text-lg uppercase tracking-wide group-hover:text-t1-red transition-colors duration-300 truncate'>
          {product_name}
        </h3>
        <div className='flex items-center gap-3'>
          {salePrice && salePrice < price ? (
            <div className='flex items-baseline gap-2'>
              <span className='font-oswald font-bold text-xl text-t1-red'>
                {formatPrice(salePrice, language)}
              </span>
              <span className='text-xs text-gray-500 line-through font-light'>
                {formatPrice(price, language)}
              </span>
            </div>
          ) : (
            <span className='font-oswald font-bold text-xl text-t1-red tracking-wide'>
              {formatPrice(price, language)}
            </span>
          )}
        </div>
      </div>

      {/* Login gate modal */}
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </motion.div>
  )
}
