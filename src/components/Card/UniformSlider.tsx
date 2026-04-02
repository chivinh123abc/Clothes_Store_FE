// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'
import UniformProductCard from './UniformProductCard'

const DUMMY_PRODUCTS = [
  { name: "[LoL] 2026 DIY Marking Kit", price: "$10.00", imageUrl: "https://i.pinimg.com/736x/8a/6d/a4/8a6da44fd555cdef4768b409557d5022.jpg" },
  { name: "[LoL] 2026 Uniform Jacket", price: "$160.00", imageUrl: "https://i.pinimg.com/736x/6b/09/e9/6b09e91287d1010f3c16e889d5b9f66d.jpg" },
  { name: "[LoL] 2026 Uniform Jersey", price: "$113.00", imageUrl: "https://i.pinimg.com/736x/8a/6d/a4/8a6da44fd555cdef4768b409557d5022.jpg" },
  { name: "[VAL] 2026 DIY Marking Kit", price: "$10.00", imageUrl: "https://i.pinimg.com/736x/6b/09/e9/6b09e91287d1010f3c16e889d5b9f66d.jpg" },
  { name: "2026 Uniform Pants", price: "$88.00", imageUrl: "https://i.pinimg.com/736x/8a/6d/a4/8a6da44fd555cdef4768b409557d5022.jpg" },
]

export const UniformSlider = () => {
  return (
    <div className='w-full h-full relative'>
      <Swiper
        breakpoints={{
          340: { slidesPerView: 1.5 },
          600: { slidesPerView: 2.5 },
          1000: { slidesPerView: 3.5 }
        }}
        freeMode={true}
        navigation={true}
        modules={[FreeMode, Navigation]}
        className='h-full w-full'
      >
        {DUMMY_PRODUCTS.map((prod, index) => (
          <SwiperSlide key={index} className='h-full'>
            <UniformProductCard name={prod.name} price={prod.price} imageUrl={prod.imageUrl} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
