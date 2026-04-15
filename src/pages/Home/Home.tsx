import { UniformSlider } from '~/components/Card/UniformSlider'
import { ProductTabContainer } from '~/components/Card/ProductTabContainer'
import Layout from '~/components/layout/Layout'
import Footer from '~/components/layout/Footer'
import { useLanguage } from '~/contexts/LanguageContext'

// Sections
import HeroSection from './sections/HeroSection'
import CollectionSection from './sections/CollectionSection'
import CommunitySection from './sections/CommunitySection'
import ReviewSection from './sections/ReviewSection'
import OfflineShopSection from './sections/OfflineShopSection'

function Home() {
  const { t } = useLanguage()
  return (
    <Layout footer={<Footer />} bleed={true}>
      {/* Hero */}
      <HeroSection />

      {/* Collection — 4 category cards */}
      <CollectionSection />

      {/* 2026 Official Uniform */}
      <div className='pb-24 px-4 md:px-10 lg:px-20'>
        <div className='font-oswald font-bold text-3xl mb-10 text-center tracking-widest text-t1-text uppercase'>
          {t('home.uniformTitle')}
        </div>
        <div className='flex flex-col lg:flex-row w-full border border-white/5 shadow-2xl relative overflow-hidden'>
          {/* Left Visual Accent */}
          <div className='lg:w-1/3 xl:w-[35%] bg-gradient-to-tr from-black via-t1-red/20 to-t1-red/60 relative p-12 flex flex-col justify-end overflow-hidden group'>
            <div className='absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity duration-700'>
              <div className='w-64 h-64 lg:w-96 lg:h-96 flex items-center justify-center drop-shadow-[0_0_50px_rgba(226,1,45,0.4)]'>
                <span className='font-oswald font-black text-[200px] text-white/10 italic'>T1</span>
              </div>
            </div>
            <div className='relative z-10'>
              <p className='text-sm font-inter font-light mb-2 text-gray-200 tracking-widest uppercase'>
                {t('home.uniformPeak')}
              </p>
              <h2 className='text-3xl md:text-4xl font-oswald font-black text-white uppercase tracking-tighter leading-none italic'>
                {t('home.uniformLabel')}
              </h2>
            </div>
          </div>
          {/* Right Product Carousel */}
          <div className='lg:w-2/3 xl:w-[65%] bg-[#1a1a1a]'>
            <UniformSlider />
          </div>
        </div>
      </div>

      {/* Product Tab Section */}
      <div className='py-20 bg-black/20'>
        <div className='px-4 md:px-10 lg:px-20'>
          <ProductTabContainer />
        </div>
      </div>

      <CommunitySection />
      <ReviewSection />
      <OfflineShopSection />
    </Layout>
  )
}

export default Home
