import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import CollectionCard from './CollectionCard'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import 'swiper/css/free-mode'

export const CollectionSlider = () => {
  return (
    <div className='flex items-center justify-center flex-col'>
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
      }} modules={[FreeMode]} className='max-w-[95%]'
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <SwiperSlide key={index} className=''>
            <div className=''>
              <CollectionCard />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}