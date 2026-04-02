
interface ProductProps {
  name: string
  price: string
  imageUrl: string
}

export default function UniformProductCard({ name, price, imageUrl }: ProductProps) {
  return (
    <a href="#" className="flex flex-col h-full bg-[#1b1b1b] border-r border-[#333] transition-transform duration-300 group">
      {/* Top Image Section */}
      <div className="flex-1 bg-white relative overflow-hidden flex items-center justify-center min-h-[350px]">
        <img
          src={imageUrl}
          alt={name}
          className="w-[85%] h-auto max-h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* Bottom Info Section */}
      <div className="flex flex-col justify-between py-4 px-5 text-t1-text h-[90px] border-t-2 border-[#333]">
        <h3 className="font-inter text-xs font-light text-gray-400 mb-2 truncate">
          {name}
        </h3>
        <p className="font-oswald text-lg font-bold">
          {price}
        </p>
      </div>
    </a>
  )
}
