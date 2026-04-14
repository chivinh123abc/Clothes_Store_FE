import { useEffect } from 'react'
import { ProductList } from '~/components/Product/ProductList'
import Layout from '~/components/layout/Layout'
import Footer from '~/components/layout/Footer'

function New() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout footer={<Footer />} bleed={true}>
      <div className='pb-20'>
        <ProductList filter='new' />
      </div>
    </Layout>
  )
}

export default New
