import { useEffect, useState } from 'react'
import Banner from '~/components/Banner/Banner'
import { ProductList } from '~/components/Product/ProductList'
import NavModal from '~/components/Modals/NavModal/NavModal'
import Navbar from '~/components/Navbar/Navbar'

function New() {
  const [openNav, setOpenNav] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='bg-t1-dark min-h-screen text-t1-text font-t1-body selection:bg-t1-red selection:text-white'>
      <Banner />
      <Navbar setOpenNav={setOpenNav} />
      <NavModal open={openNav} onClose={() => setOpenNav(false)}>{null}</NavModal>
      <div className='pb-20'>
        <ProductList filter='new' />
      </div>
    </div>
  )
}

export default New
