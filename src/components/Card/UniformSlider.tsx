// Import Swiper React components
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Scrollbar } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'
import 'swiper/css/scrollbar'
import UniformProductCard from './UniformProductCard'

import { DUMMY_PRODUCTS } from '~/data/homeData'

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
        {DUMMY_PRODUCTS.map((prod, index) => (
          <SwiperSlide key={index} className='h-full'>
            <UniformProductCard name={prod.name} price={prod.price} imageUrl={prod.imageUrl} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
