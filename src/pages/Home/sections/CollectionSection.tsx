import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import { useLanguage } from '~/contexts/LanguageContext'

const CollectionSection = () => {
  const { t } = useLanguage()

  const COLLECTIONS = [
    {
      id: 'team-kit',
      label: t('nav.teamKit'),
      subtitle: t('home.teamKitSub'),
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=900&h=1200',
      path: '/shop/team-kit',
      tag: t('home.official')
    },
    {
      id: 'essential',
      label: t('nav.essential'),
      subtitle: t('home.essentialSub'),
      image: 'https://images.unsplash.com/photo-1556821840-ecc63f93428c?auto=format&fit=crop&q=80&w=900&h=1200',
      path: '/shop/collection/essential',
      tag: t('home.core')
    },
    {
      id: 'players',
      label: t('nav.players'),
      subtitle: t('home.playersSub'),
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=900&h=1200',
      path: '/community',
      tag: t('home.new')
    },
    {
      id: 'collaboration',
      label: t('nav.collaboration'),
      subtitle: t('home.collabSub'),
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=900&h=1200',
      path: '/shop/collaboration',
      tag: t('home.limited')
    }
  ]

  return (
    <section className='py-16 md:py-24 bg-t1-dark overflow-hidden'>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className='flex flex-col sm:flex-row sm:items-end sm:justify-between px-6 md:px-12 lg:px-20 mb-10 md:mb-14'
      >
        <div>
          <p className='font-oswald text-t1-red font-bold tracking-[0.4em] uppercase text-[11px] mb-3'>
            {t('home.collectionSub')}
          </p>
          <h2 className='font-oswald font-black text-5xl md:text-6xl text-white uppercase tracking-tighter italic leading-none'>
            {t('home.collectionTitle')}
          </h2>
          <div className='flex items-center gap-3 mt-4'>
            <div className='w-10 h-[3px] bg-t1-red shadow-[0_0_10px_rgba(226,1,45,0.8)]' />
            <div className='w-3 h-[3px] bg-t1-red/40' />
            <div className='w-1.5 h-[3px] bg-t1-red/20' />
          </div>
        </div>

        <Link
          to='/shop'
          className='hidden sm:flex items-center gap-2 mt-4 sm:mt-0 font-oswald font-bold text-[11px] tracking-[0.3em] uppercase text-gray-400 hover:text-white transition-colors duration-300 group'
        >
          {t('home.viewAll')}
          <span className='inline-block w-6 h-[1px] bg-gray-500 group-hover:w-10 group-hover:bg-t1-red transition-all duration-300' />
        </Link>
      </motion.div>

      {/* Swiper Carousel */}
      <div className='pl-6 md:pl-12 lg:pl-20'>
        <Swiper
          modules={[FreeMode]}
          freeMode={{ enabled: true, sticky: false }}
          slidesPerView={1.15}
          spaceBetween={14}
          breakpoints={{
            480: { slidesPerView: 1.8, spaceBetween: 16 },
            640: { slidesPerView: 2.2, spaceBetween: 18 },
            900: { slidesPerView: 3.1, spaceBetween: 20 },
            1280: { slidesPerView: 4, spaceBetween: 22 }
          }}
          className='!overflow-visible'
        >
          {COLLECTIONS.map((col, index) => (
            <SwiperSlide key={col.id} className='!h-auto'>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: 'easeOut' as const }}
              >
                <Link
                  to={col.path}
                  className='group relative flex flex-col overflow-hidden bg-[#111] cursor-pointer block'
                >
                  {/* Image container */}
                  <div className='relative overflow-hidden aspect-[3/4]'>
                    <img
                      src={col.image}
                      alt={col.label}
                      className='w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105'
                    />

                    {/* Permanent bottom gradient */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent' />

                    {/* Tag pill */}
                    <div className='absolute top-4 left-4 z-10'>
                      <span className='font-oswald font-bold text-[9px] tracking-[0.3em] uppercase bg-t1-red text-white px-3 py-1'>
                        {col.tag}
                      </span>
                    </div>

                    {/* Hover overlay */}
                    <div className='absolute inset-0 bg-t1-red/0 group-hover:bg-t1-red/10 transition-colors duration-500' />

                    {/* Animated border on hover */}
                    <div className='absolute inset-0 border border-white/0 group-hover:border-t1-red/50 transition-colors duration-500' />

                    {/* Bottom text block */}
                    <div className='absolute bottom-0 left-0 right-0 p-5 z-10'>
                      <p className='font-inter text-[9px] text-gray-400 tracking-[0.25em] uppercase mb-2 transition-colors duration-300'>
                        {col.subtitle}
                      </p>
                      <div className='flex items-end justify-between'>
                        <h3 className='font-oswald font-black text-2xl md:text-3xl text-white uppercase tracking-tight leading-none group-hover:text-t1-red transition-colors duration-300'>
                          {col.label}
                        </h3>
                        <div className='w-8 h-8 bg-white/10 group-hover:bg-t1-red border border-white/10 group-hover:border-t1-red flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-3 mb-0.5'>
                          <svg width='12' height='12' viewBox='0 0 12 12' fill='none' className='text-white transition-transform duration-300 group-hover:translate-x-0.5'>
                            <path d='M1 6h10M7 2l4 4-4 4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile view all */}
      <div className='flex justify-center mt-10 sm:hidden px-6'>
        <Link
          to='/shop'
          className='w-full text-center py-3 border border-white/10 font-oswald font-bold text-[11px] tracking-[0.3em] uppercase text-gray-400 hover:border-t1-red hover:text-white transition-all duration-300'
        >
          {t('home.viewAllCol')}
        </Link>
      </div>
    </section>
  )
}

export default CollectionSection
