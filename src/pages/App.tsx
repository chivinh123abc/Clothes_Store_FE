import { useState } from 'react'
import Banner from '~/components/Banner/Banner'
import NavModal from '~/components/Modals/NavModal/NavModal'
import Navbar from '~/components/Navbar/Navbar'


function App() {
  const [openNav, setOpenNav] = useState(false)
  return (
    // <body className='font-poppins bg-gradient-to-t from-[#fbc2eb] to-[#a6c1ee] h-screen'>
    <header className='bg-[#A18D6D]'>
      <div>
        <Banner />
        <Navbar setOpenNav={setOpenNav} />
      </div>
      {/* NavbarModal */}
      <NavModal open={openNav} onClose={() => setOpenNav(false)}>  </NavModal>
    </header>
  )
}


export default App
