import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'
import 'swiper/css/scrollbar'
import UniformProductCard from './UniformProductCard'

import { newProducts, bestProducts, saleProducts } from '~/data/homeData'
import { useLanguage } from '~/contexts/LanguageContext'

const tabData: Record<string, any[]> = {
  NEW: newProducts,
  BEST: bestProducts,
  SALE: saleProducts
}

export const ProductTabContainer = () => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'NEW' | 'BEST' | 'SALE'>('NEW')
  const products = tabData[activeTab]

  const tabs = [
    { key: 'NEW' as const, label: t('nav.new') },
    { key: 'BEST' as const, label: t('nav.best') },
    { key: 'SALE' as const, label: t('nav.sale') }
  ]

  return (
    <div className='flex flex-col lg:flex-row w-full border-t border-t1-gray shadow-2xl bg-[#0c0c0c]'>
      {/* Sidebar */}
      <div className='lg:w-1/4 xl:w-[15%] p-5 flex flex-col justify-start border-t-[3px] border-t-t1-red'>
        <h2 className='text-xl md:text-2xl font-oswald font-black uppercase text-white mb-4 tracking-wide'>{t('nav.product')}</h2>
        <div className='flex flex-col gap-0'>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex justify-between items-center py-2.5 border-b border-[#333] font-oswald font-bold text-sm md:text-base hover:text-t1-red transition-colors ${activeTab === tab.key ? 'text-t1-red' : 'text-white'}`}
            >
              <span className='uppercase tracking-widest'>{tab.label}</span>
              <span className={`text-lg md:text-xl ${activeTab === tab.key ? 'text-t1-red' : 'text-white'}`}>+</span>
            </button>
          ))}
        </div>
        <div className='mt-auto pt-4'>
          <Link
            to="/shop"
            className='bg-[#1a1a1a] border border-[#2a2a2a] text-[10px] uppercase font-inter text-gray-300 py-1.5 px-3 hover:bg-t1-red hover:text-white transition duration-300 w-max flex items-center gap-1'
          >
            {t('home.seeAllProducts')} &gt;
          </Link>
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
                originalPrice={'originalPrice' in prod ? prod.originalPrice : undefined}
                discountPercentage={'discountPercentage' in prod ? prod.discountPercentage : undefined}
                imageUrl={prod.imageUrl}
                soldOut={'soldOut' in prod ? prod.soldOut : false}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
