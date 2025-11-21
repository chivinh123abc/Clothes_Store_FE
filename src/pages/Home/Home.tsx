import { useState } from 'react'
import Banner from '~/components/Banner/Banner'
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


      <div className=''>
        <img className='w-screen' src="src/assets/Background/first_bg_img.jpg" alt="" />
      </div>
      {/* NavbarModal */}
    </div>
  )
}


export default Home
