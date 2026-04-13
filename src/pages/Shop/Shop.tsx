import { useEffect } from 'react'
import { ProductList } from '~/components/Product/ProductList'
import Layout from '~/components/layout/Layout'
import Footer from '~/components/layout/Footer'

function Shop() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout footer={<Footer />} bleed={true}>
      <div className='pb-20'>
        <div className='max-w-7xl mx-auto px-4 md:px-10 lg:px-16 pt-32 pb-4'>
          <h1 className='text-4xl md:text-5xl font-oswald font-black text-white italic uppercase tracking-tighter'>
            ALL PRODUCTS
          </h1>
          <div className='w-20 h-1 bg-t1-red mt-4 mb-10'></div>
        </div>
        <ProductList />
      </div>
    </Layout>
  )
}

export default Shop
