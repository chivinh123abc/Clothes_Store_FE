// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Pagination } from 'swiper/modules'
import CollectionCard from './CollectionCard'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
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
            spaceBetween: 15
          },
          700: {
            slidesPerView: 4,
            spaceBetween: 15
          }
        }
      } freeMode={{
        enabled: true,
        sticky: true
      }} pagination={{
        clickable: true
      }} modules={[FreeMode, Pagination]} className='max-w-[98%] '
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <SwiperSlide key={index}>
            <CollectionCard />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}