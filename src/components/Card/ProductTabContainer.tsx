import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'
import 'swiper/css/scrollbar'
import UniformProductCard from './UniformProductCard'

import { useLanguage } from '~/contexts/LanguageContext'
import { formatPrice } from '~/utils/format'
import productApi from '~/apis/productApi'
import type { Product } from '~/types/product'

export const ProductTabContainer = () => {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState<'NEW' | 'BEST' | 'SALE'>('NEW')
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getAll()
        setAllProducts(response.data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch products for homepage:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const NEW_PRODUCT_DAYS = 7

  const newArrivalThresholdDate = useMemo(() => {
    if (allProducts.length === 0) return new Date()
    const sortedDates = [...allProducts]
      .map(p => new Date(p.created_at || 0).getTime())
      .sort((a, b) => b - a)
    const index = Math.min(15, sortedDates.length - 1)
    return new Date(sortedDates[index] || 0)
  }, [allProducts])

  const isNewProduct = (createdAt: string) => {
    if (!createdAt) return false
    const createdDate = new Date(createdAt)
    const now = new Date()
    const hasRecentProducts = allProducts.some(p => {
      const pDate = new Date(p.created_at || 0)
      return (now.getTime() - pDate.getTime()) / (1000 * 60 * 60 * 24) <= NEW_PRODUCT_DAYS
    })

    if (hasRecentProducts) {
      const diffTime = now.getTime() - createdDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      return diffDays <= NEW_PRODUCT_DAYS
    } else {
      return createdDate.getTime() >= newArrivalThresholdDate.getTime()
    }
  }

  const getTabProducts = () => {
    if (loading) return []

    switch (activeTab) {
      case 'NEW': {
        const newProds = allProducts.filter((p) => isNewProduct(p.created_at))
        if (newProds.length > 0) return newProds
        return [...allProducts]
          .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
          .slice(0, 8)
      }
      case 'BEST': {
        const bestProds = allProducts.filter((p) => p.is_bestseller)
        if (bestProds.length > 0) return bestProds
        return [...allProducts]
          .sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0))
          .slice(0, 8)
      }
      case 'SALE': {
        const saleProds = allProducts.filter((p) => p.items?.[0]?.sale_price != null)
        if (saleProds.length > 0) return saleProds
        return allProducts.slice(0, 8)
      }
      default:
        return []
    }
  }

  const products = getTabProducts()

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
      <div className='lg:w-3/4 xl:w-[85%] bg-[#1b1b1b] flex items-center justify-center min-h-[300px]'>
        {loading ? (
          <div className='flex gap-4 p-4 overflow-hidden w-full'>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="w-[18%] min-w-[140px] flex-shrink-0 flex flex-col bg-[#1b1b1b] border-r border-[#333]">
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
    </div>
  )
}

