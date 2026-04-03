import SearchBar from '~/components/SearchBar/SearchBar'
import CartIcon from '../Cart/CartIcon'
import DropdownLanguage from '../DropdownLanguage/DropdownLanguage'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { NavMenuListMedium } from '../MenuList/NavMenuList'
import heartIcon from '~/assets/SearchBar/heart.png'
import menuIcon from '~/assets/Navbar/menu.png'

interface NavbarProps {
  setOpenNav: Dispatch<SetStateAction<boolean>>;
}

function Navbar({ setOpenNav }: NavbarProps) {
  const [isTop, setIsTop] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // const [openNav, setOpenNav] = useState(false)
  // bg-white/30 backdrop-blur-md
  return (
    <nav className={'text-t1-text fixed top-8 w-screen z-50 transition-all duration-300 font-oswald text-lg tracking-wider'}>
      <div className={`flex justify-between items-center h-[70px] px-8 transition-all duration-500 ease-in-out border-b ${!isTop ? 'bg-[#111111]/80 backdrop-blur-xl border-[#333]' : 'bg-black/10 backdrop-blur-sm border-transparent'}`}>

        <div className='lg:hidden'>
          <input onClick={() => setOpenNav(true)} type="image" src={menuIcon} className='w-5 h-5 filter invert' />
        </div>

        {/* T1 typically puts the logo on the left. Let's place it on the left but keep links next to it or center. */}
        <div className='flex items-center gap-10'>
          <div className='text-t1-text font-black text-3xl italic tracking-tighter'>
            CLOTHES STORE
          </div>

          {/* Hidden UL in mobile */}
          <div className='hidden lg:block ml-4'>
            <NavMenuListMedium />
          </div>
        </div>

        <div className='flex gap-6 items-center'>
          <SearchBar />
          <input type="image" src={heartIcon} className='w-5 h-5 filter invert opacity-80 hover:opacity-100 transition-opacity' />
          <CartIcon />
          <DropdownLanguage />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
