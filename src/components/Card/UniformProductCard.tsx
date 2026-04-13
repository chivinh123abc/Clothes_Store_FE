import { Link } from 'react-router-dom'

interface ProductProps {
  id?: string
  name: string
  price: string
  originalPrice?: string
  discountPercentage?: number
  imageUrl: string
  soldOut?: boolean
}

export default function UniformProductCard({ id, name, price, originalPrice, discountPercentage, imageUrl, soldOut }: ProductProps) {
  return (
    <Link to={id ? `/product/${id}` : '#'} className="flex flex-col h-full bg-[#1b1b1b] border-r border-[#333] transition-transform duration-300 group">
      {/* Top Image Section */}
      <div className="bg-white relative overflow-hidden w-full aspect-square flex items-center justify-center">
        <img
          src={imageUrl}
          alt={name}
          className={`w-[85%] h-[85%] object-contain transition-transform duration-500 ease-out group-hover:scale-105 ${soldOut ? 'opacity-50' : ''}`}
        />
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-gray-200/50">
            <span className="text-[#333] text-2xl font-oswald font-black tracking-widest uppercase drop-shadow-sm">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Bottom Info Section */}
      <div className="flex flex-col justify-center py-3 px-4 text-t1-text h-[75px] border-t-2 border-[#333]">
        <h3 className="font-inter text-[11px] font-light text-gray-400 mb-1 truncate">
          {name}
        </h3>
        <div className="flex items-baseline gap-2">
          <p className="font-oswald text-sm md:text-base font-bold">
            {price}
          </p>
          {originalPrice && (
            <span className="font-oswald text-[10px] md:text-xs font-medium text-gray-500 line-through">
              {originalPrice}
            </span>
          )}
          {discountPercentage && (
            <span className="font-oswald text-[10px] md:text-xs font-bold text-t1-red ml-auto">
              -{discountPercentage}%
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
