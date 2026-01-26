// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import 'swiper/css/free-mode'
import SellingItemCard from './SellingItemCard'

export const RecomendationSlider = () => {
  return (
    <div className='flex items-center justify-center'>
      <Swiper breakpoints={
        {
          340: {
            slidesPerView: 2,
            spaceBetween: 10
          },
          600: {
            slidesPerView: 3,
            spaceBetween: 10
          },
          1000: {
            slidesPerView: 4,
            spaceBetween: 10
          }
        }
      } freeMode={{
        enabled: true,
        sticky: true
      }} modules={[FreeMode]} className='max-w-[98%]'
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <SwiperSlide key={index} className=''>
            <SellingItemCard />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}