import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { motion } from 'motion/react'

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  badge?: 'NEW' | 'SALE';
  salePrice?: number;
  soldOut?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  badge,
  salePrice,
  soldOut
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${id}`} className="block">
        <div className="relative aspect-[3/4] bg-[#E5E5E5] rounded-lg overflow-hidden mb-4">
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              soldOut ? ' opacity-60 ' : ''
            }`}
          />

          {/* Badge */}
          {!soldOut && badge && (
            <span
              className={`absolute top-4 left-4 z-20 px-3 py-1 text-xs font-semibold rounded ${
                badge === 'NEW'
                  ? 'bg-black text-white'
                  : 'bg-[#FF4D4F] text-white'
              }`}
            >
              {badge}
            </span>
          )}
          {soldOut && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <span className="px-6 py-3 text-lg md:text-2xl font-bold tracking-widest uppercase text-white rounded font-mono font-bold bg-black/40">
                SOLD OUT
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#A18D6D] hover:text-white">
            <Heart size={18} />
          </button>

          {/* Add to Cart Button - only show when not sold out */}
          {!soldOut && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-4 left-4 right-4 bg-white hover:bg-[#A18D6D] hover:text-white py-3 rounded font-medium transition-colors flex items-center justify-center gap-2"
              onClick={(e) => {
                e.preventDefault()
                // Add to cart logic
              }}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </motion.button>
          )}
        </div>

        <div className="space-y-1 border border-gray-200 rounded-sm p-4 relative -top-[22px] bg-white shadow-sm">
          <h3 className="font-medium text-sm group-hover:text-[#A18D6D] transition-colors">
            {name}
          </h3>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F5F5F5] border border-gray-200 rounded-md">
            {salePrice ? (
              <>
                <span className="font-semibold text-[#FF4D4F]">
                  ${salePrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-semibold">${price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
