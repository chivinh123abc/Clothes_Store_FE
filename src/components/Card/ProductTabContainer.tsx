import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'
import 'swiper/css/scrollbar'
import UniformProductCard from './UniformProductCard'

// Dummy Data
const newProducts = [
  { name: "[Pre-Sale] Other Friends Cushion Keychain Set", price: "$12.60", imageUrl: "https://i.pinimg.com/736x/8a/6d/a4/8a6da44fd555cdef4768b409557d5022.jpg", soldOut: true },
  { name: "Animal Friends Zip-Up Hoodie - Circus Edition", price: "$70.00", imageUrl: "https://i.pinimg.com/736x/6b/09/e9/6b09e91287d1010f3c16e889d5b9f66d.jpg" },
  { name: "Animal Friends Collect Book - Circus Edition", price: "$14.80", imageUrl: "https://i.pinimg.com/736x/8a/6d/a4/8a6da44fd555cdef4768b409557d5022.jpg" },
  { name: "Animal Friends Acrylic Keychain - Circus Edition", price: "$8.20", imageUrl: "https://i.pinimg.com/736x/6b/09/e9/6b09e91287d1010f3c16e889d5b9f66d.jpg" },
  { name: "Animal Friends Ticket Keychain - Circus Edition", price: "$9.20", imageUrl: "https://i.pinimg.com/736x/8a22.j/6d/a4/8a6da44fd555cdef4768b409557d50pg", soldOut: true },
  { name: "Animal Friends Poster - Circus Edition", price: "$15.00", imageUrl: "https://i.pinimg.com/736x/6b/09/e9/6b09e91287d1010f3c16e889d5b9f66d.jpg" },
]

const bestProducts = [
  { name: "[LoL] 2026 DIY Marking Kit", price: "$10.00", imageUrl: "https://i.pinimg.com/736x/6b/09/e9/6b09e91287d1010f3c16e889d5b9f66d.jpg" },
  { name: "[LoL] 2026 Uniform Jacket", price: "$160.00", imageUrl: "https://i.pinimg.com/736x/8a/6d/a4/8a6da44fd555cdef4768b409557d5022.jpg", soldOut: true },
  { name: "[LoL] 2026 Uniform Jersey", price: "$113.00", imageUrl: "https://i.pinimg.com/736x/6b/09/e9/6b09e91287d1010f3c16e889d5b9f66d.jpg" },
  { name: "2026 Uniform Pants", price: "$88.00", imageUrl: "https://i.pinimg.com/736x/8a/6d/a4/8a6da44fd555cdef4768b409557d5022.jpg" },
]

const saleProducts = [
  { name: "T1 Worlds 2023 Cap", price: "$20.00", originalPrice: "$25.00", discountPercentage: 20, imageUrl: "https://i.pinimg.com/736x/8a/6d/a4/8a6da44fd555cdef4768b409557d5022.jpg" },
  { name: "T1 Varsity Jacket", price: "$72.00", originalPrice: "$90.00", discountPercentage: 20, imageUrl: "https://i.pinimg.com/736x/6b/09/e9/6b09e91287d1010f3c16e889d5b9f66d.jpg" },
  { name: "Faker Hall of Legends Poster", price: "$10.50", originalPrice: "$15.00", discountPercentage: 30, imageUrl: "https://i.pinimg.com/736x/8a/6d/a4/8a6da44fd555cdef4768b409557d5022.jpg" },
]

const tabData: Record<string, any[]> = {
  NEW: newProducts,
  BEST: bestProducts,
  SALE: saleProducts
}

export const ProductTabContainer = () => {
  const [activeTab, setActiveTab] = useState<'NEW' | 'BEST' | 'SALE'>('NEW')
  const products = tabData[activeTab]

  return (
    <div className='flex flex-col lg:flex-row w-full border-t border-t1-gray shadow-2xl bg-[#0c0c0c]'>
      {/* Sidebar */}
      <div className='lg:w-1/4 xl:w-[15%] p-5 flex flex-col justify-start border-t-[3px] border-t-t1-red'>
        <h2 className='text-xl md:text-2xl font-oswald font-black uppercase text-white mb-4 tracking-wide'>PRODUCT</h2>
        <div className='flex flex-col gap-0'>
          {(['NEW', 'BEST', 'SALE'] as const).map(val => (
            <button
              key={val}
              onClick={() => setActiveTab(val)}
              className={`flex justify-between items-center py-2.5 border-b border-[#333] font-oswald font-bold text-sm md:text-base hover:text-t1-red transition-colors ${activeTab === val ? 'text-t1-red' : 'text-white'}`}
            >
              <span className='uppercase tracking-widest'>{val}</span>
              <span className={`text-lg md:text-xl ${activeTab === val ? 'text-t1-red' : 'text-white'}`}>+</span>
            </button>
          ))}
        </div>
        <div className='mt-auto pt-4'>
          <button className='bg-[#1a1a1a] border border-[#2a2a2a] text-[10px] uppercase font-inter text-gray-300 py-1.5 px-3 hover:bg-t1-red hover:text-white transition duration-300 w-max flex items-center gap-1'>
            SEE ALL PRODUCTS &gt;
          </button>
        </div>
      </div>

      {/* Product Carousel */}
      <div className='lg:w-3/4 xl:w-[85%] bg-[#1b1b1b]'>
        <Swiper
          key={activeTab} // To force re-render/reset when tab changes
          breakpoints={{
            340: { slidesPerView: 1.5 },
            600: { slidesPerView: 2.5 },
            1000: { slidesPerView: 4.5 },
            1280: { slidesPerView: 5.5 }
          }}
          freeMode={true}
          navigation={true}
          scrollbar={{ draggable: true, hide: false }}
          modules={[FreeMode, Navigation, Scrollbar]}
          className='h-full w-full pb-8 px-2'
          style={{
            '--swiper-scrollbar-bg-color': '#333',
            '--swiper-scrollbar-drag-bg-color': '#e2012d',
            '--swiper-scrollbar-bottom': '0px',
            '--swiper-scrollbar-size': '0.5px',
            '--swiper-scrollbar-sides-offset': '0px'
          } as React.CSSProperties}
        >
          {products.map((prod, index) => (
            <SwiperSlide key={index} className='h-full'>
              <UniformProductCard
                name={prod.name}
                price={prod.price}
                originalPrice={"originalPrice" in prod ? prod.originalPrice : undefined}
                discountPercentage={"discountPercentage" in prod ? prod.discountPercentage : undefined}
                imageUrl={prod.imageUrl}
                soldOut={"soldOut" in prod ? prod.soldOut : false}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
