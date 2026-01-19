import { useState } from 'react'
import Banner from '~/components/Banner/Banner'
import { CollectionSlider } from '~/components/Card/CollectionSlider'
import NavModal from '~/components/Modals/NavModal/NavModal'
import Navbar from '~/components/Navbar/Navbar'

function Home() {
  const [openNav, setOpenNav] = useState(false)
  return (
    // <body className='font-poppins bg-gradient-to-t from-[#fbc2eb] to-[#a6c1ee] h-screen'>
    <div className='bg-[#A18D6D]'>
      {/* Nav + Search + Banner */}
      <Banner />
      <Navbar setOpenNav={setOpenNav} />
      <NavModal open={openNav} onClose={() => setOpenNav(false)}>  </NavModal>

      {/* NavbarModal */}
      <div className=''>
        <img className='w-screen' src="src/assets/Background/first_bg_img.jpg" alt="" />
      </div>

      {/* Collection Recomendation */}
      <div className=''>
        {/* CollectinTitle */}
        <div className='font-bold text-2xl mt-20 mb-10 text-center'>COLLECTION</div>
        {/* Collection Item */}
        <CollectionSlider />
      </div>

    </div>
  )
}

export default Home
