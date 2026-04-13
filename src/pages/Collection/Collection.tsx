import { useEffect } from 'react'
import Layout from '~/components/layout/Layout'
import Footer from '~/components/layout/Footer'
import { CollectionSlider } from '~/components/Card/CollectionSlider'

function Collection() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout footer={<Footer />} bleed={true}>
      <div className='pb-20 pt-32'>
        <div className='max-w-7xl mx-auto px-4 md:px-10 lg:px-16 pb-10'>
          <h1 className='text-4xl md:text-5xl font-oswald font-black text-white italic uppercase tracking-tighter'>
            THE 2026 COLLECTION
          </h1>
          <div className='w-20 h-1 bg-t1-red mt-4 mb-6'></div>
          <p className='text-gray-400 font-light italic max-w-2xl leading-relaxed'>
            A fusion of athletic heritage and avant-garde streetwear. Discover our latest creative direction designed for the modern urban landscape.
          </p>
        </div>

        <div className='pb-20'>
          <CollectionSlider />
        </div>

        <div className='max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-20 border-t border-white/5'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-20 items-center'>
            <div className='aspect-square bg-white shadow-2xl relative overflow-hidden group'>
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000" className='w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000' alt="Lookbook" />
              <div className='absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors'></div>
            </div>
            <div>
              <h3 className='font-oswald font-black text-3xl text-white uppercase italic mb-6'>Behind the Silhouette</h3>
              <p className='text-gray-400 font-light leading-relaxed mb-8 italic'>
                        Every piece in the 2026 collection represents our commitment to detail. From the reinforced stitching to the custom-developed fabrics, we've pushed the boundaries of what performance wear can be.
              </p>
              <button className='px-12 py-4 border border-white text-white font-oswald font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all'>
                        READ STORY
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Collection
