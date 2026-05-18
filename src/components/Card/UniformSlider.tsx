// Import Swiper React components
import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Scrollbar } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'
import 'swiper/css/scrollbar'
import UniformProductCard from './UniformProductCard'

import productApi from '~/apis/productApi'
import type { Product } from '~/types/product'
import { useLanguage } from '~/contexts/LanguageContext'
import { formatPrice } from '~/utils/format'

export const UniformSlider = () => {
  const { language } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchUniformProducts = async () => {
      try {
        const response = await productApi.getAll()
        const allProds = response.data
        // Filter products in 'team-kit' collection
        let teamKitProds = allProds.filter(p =>
          p.collections?.some(c => c.collection_slug === 'team-kit')
        )
        if (teamKitProds.length === 0) {
          // Fallback: take top 8
          teamKitProds = allProds.slice(0, 8)
        }
        setProducts(teamKitProds)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch uniform products for slider:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUniformProducts()
  }, [])

  return (
    <div className='w-full h-full relative flex items-center justify-center min-h-[300px]'>
      {loading ? (
        <div className='flex gap-4 p-4 overflow-hidden w-full'>
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="w-[30%] min-w-[140px] flex-shrink-0 flex flex-col bg-[#1b1b1b] border-r border-[#333]">
              <div className="bg-[#222] w-full aspect-square animate-pulse" />
              <div className="flex flex-col justify-center py-3 px-4 h-[75px] border-t-2 border-[#333] space-y-2">
                <div className="h-2.5 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
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
          {products.map((prod) => {
            const priceNum = prod.items?.[0]?.product_item_price ?? 0
            const salePriceNum = prod.items?.[0]?.sale_price ?? null
            const isSoldOut = prod.soldOut ?? (
              prod.items && prod.items.length > 0
                ? prod.items.every(item => item.stock_quantity === 0)
                : true
            )

            const displayPrice = formatPrice(salePriceNum != null ? salePriceNum : priceNum, language)
            const displayOriginalPrice = salePriceNum != null ? formatPrice(priceNum, language) : undefined
            const displayDiscount = (salePriceNum != null && priceNum > 0)
              ? Math.round(((priceNum - salePriceNum) / priceNum) * 100)
              : undefined
            const imageUrl = prod.items?.[0]?.product_item_image ?? ''

            return (
              <SwiperSlide key={prod.product_id} className='h-full'>
                <UniformProductCard
                  id={prod.product_id.toString()}
                  name={prod.product_name}
                  price={displayPrice}
                  originalPrice={displayOriginalPrice}
                  discountPercentage={displayDiscount}
                  imageUrl={imageUrl}
                  soldOut={isSoldOut}
                />
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}
    </div>
  )
}

