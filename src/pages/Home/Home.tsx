import { useState } from 'react'
import Banner from '~/components/Banner/Banner'
import BannerCard from '~/components/Card/BannerCard'
import { CollectionSlider } from '~/components/Card/CollectionSlider'
import { RecomendationSlider } from '~/components/Card/RecomendationSlider'
import NavModal from '~/components/Modals/NavModal/NavModal'
import Navbar from '~/components/Navbar/Navbar'
import BGImage from '~/assets/Background/first_bg_img.jpg'

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
        <img className='w-screen' src={BGImage} alt="" />
      </div>

      {/* Collection Recomendation */}
      <div className=''>
        {/* Collection Title */}
        <div className='font-bold text-2xl mt-20 mb-10 text-center'>COLLECTION</div>
        {/* Collection Item */}
        <CollectionSlider />
      </div>

      {/* Recomendation item */}
      <div className=''>
        <div className='font-bold text-2xl mt-20 mb-10 text-center'>RECOMENDDATION</div>
        <div className='flex justify-center'>
          <div className='w-1/3 ml-10 mr-0'>
            <BannerCard />
          </div>
          <div className='w-2/3'>
            <RecomendationSlider />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home
