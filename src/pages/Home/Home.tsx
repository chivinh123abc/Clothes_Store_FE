import { useState } from 'react'
import Banner from '~/components/Banner/Banner'
import { CollectionSlider } from '~/components/Card/CollectionSlider'
import { UniformSlider } from '~/components/Card/UniformSlider'
import NavModal from '~/components/Modals/NavModal/NavModal'
import Navbar from '~/components/Navbar/Navbar'
import BGImage from '~/assets/Background/first_bg_img.jpg'

function Home() {
  const [openNav, setOpenNav] = useState(false)
  return (
    <div className='bg-t1-dark min-h-screen text-t1-text font-t1-body selection:bg-t1-red selection:text-white'>
      {/* Nav + Search + Banner */}
      <Banner />
      <Navbar setOpenNav={setOpenNav} />
      <NavModal open={openNav} onClose={() => setOpenNav(false)}>  </NavModal>

      {/* Hero Section */}
      <div className='relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-black mt-8 text-white'>
        <img className='absolute w-full h-full object-cover opacity-80' src={BGImage} alt="Main Banner" />
        <div className='absolute bottom-10 left-10'>
          <h1 className='font-oswald text-5xl md:text-7xl font-bold tracking-tight text-white mb-2 uppercase'>
            GEAR UP FOR <br /><span className='text-t1-red'>VICTORY</span>
          </h1>
          <p className='text-lg font-light mb-6'>Shop the latest 2026 Collection.</p>
          <button className='bg-white text-t1-dark font-oswald font-bold px-8 py-3 tracking-widest hover:bg-t1-red hover:text-white transition-colors duration-300'>
            SHOP NOW
          </button>
        </div>
      </div>

      {/* Collection */}
      <div className='py-16'>
        {/* Collection Title */}
        <div className='font-oswald font-black text-4xl mt-10 mb-12 text-center tracking-widest text-t1-text italic'>
          NEW ARRIVALS
        </div>
        {/* Collection Item */}
        <CollectionSlider />
      </div>

      {/* Recommended (Using Official Uniform Layout) */}
      <div className='pb-16 px-4 md:px-0'>
        <div className='font-oswald font-bold text-2xl md:text-3xl mb-8 text-center tracking-wider text-t1-text uppercase'>
          2026 OFFICIAL UNIFORM
        </div>

        {/* Split Layout Container */}
        <div className='flex flex-col lg:flex-row w-full border-t border-t1-gray border-b-4 border-b-t1-red min-h-[440px] shadow-2xl'>

          {/* Left Banner */}
          <div className='lg:w-1/3 xl:w-[35%] bg-gradient-to-tr from-black via-[#7a0016] to-[#e2012d] relative p-8 flex flex-col justify-end min-h-[300px] overflow-hidden'>
            <div className='absolute inset-0 flex items-center justify-center opacity-90'>
              {/* Mascot placeholder icon */}
              <div className='w-56 h-56 lg:w-72 lg:h-72 flex items-center justify-center drop-shadow-2xl overflow-hidden'>
                <img src="https://i.pinimg.com/736x/f6/14/00/f61400d720bc2c4dbd8eb4bbf949cc8b.jpg" alt="Mascot Avatar" className="w-full h-full object-cover scale-150 rounded-full" />
              </div>
            </div>
            <div className='relative z-10 bg-gradient-to-t from-black via-black/50 to-transparent pt-10 -mx-8 -mb-8 px-8 pb-8'>
              <p className='text-xs font-inter font-light mb-1 text-gray-200 tracking-wide'>
                Celebrate Victory with the Uniform!
              </p>
              <h2 className='text-xl md:text-2xl font-oswald font-bold text-t1-red uppercase tracking-widest leading-none'>
                2026 OFFICIAL UNIFORM
              </h2>
            </div>
          </div>

          {/* Right Product Carousel */}
          <div className='lg:w-2/3 xl:w-[65%] bg-[#1b1b1b] min-h-[440px]'>
            <UniformSlider />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home
