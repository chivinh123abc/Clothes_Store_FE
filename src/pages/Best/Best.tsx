import { useEffect, useState } from 'react'
import Banner from '~/components/Banner/Banner'
import { ProductList } from '~/components/Product/ProductList'
import NavModal from '~/components/Modals/NavModal/NavModal'
import Navbar from '~/components/Navbar/Navbar'

function Best() {
  const [openNav, setOpenNav] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-black min-h-screen">
      <Banner />
      <Navbar setOpenNav={setOpenNav} />
      <NavModal open={openNav} onClose={() => setOpenNav(false)}>
        {' '}
      </NavModal>
      <div>
        <ProductList filter="best" />
      </div>
    </div>
  )
}

export default Best
