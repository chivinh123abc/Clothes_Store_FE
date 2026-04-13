import SearchBar from '~/components/SearchBar/SearchBar'
import { Link } from 'react-router-dom'
import CartIcon from '../Cart/CartIcon'
import CartDrawer from '../Cart/CartDrawer'
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
  const [isCartOpen, setIsCartOpen] = useState(false)

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
      <div className={`flex justify-between items-center h-[60px] md:h-[70px] px-4 md:px-8 transition-all duration-500 ease-in-out border-b ${!isTop ? 'bg-[#111111]/80 backdrop-blur-xl border-[#333]' : 'bg-black/10 backdrop-blur-sm border-transparent'}`}>

        <div className='lg:hidden'>
          <input onClick={() => setOpenNav(true)} type="image" src={menuIcon} className='w-5 h-5 filter invert' />
        </div>

        {/* T1 typically puts the logo on the left. Let's place it on the left but keep links next to it or center. */}
        <div className='flex items-center gap-4 md:gap-10'>
          <Link to='/' className='text-t1-text font-black text-xl md:text-3xl italic tracking-tighter hover:text-t1-red transition-colors cursor-pointer'>
            CLOTHES STORE
          </Link>

          {/* Hidden UL in mobile */}
          <div className='hidden lg:block ml-4'>
            <NavMenuListMedium />
          </div>
        </div>

        <div className='flex gap-4 md:gap-6 items-center'>
          <SearchBar />
          <div className='hidden sm:block'>
            <input type="image" src={heartIcon} className='w-5 h-5 filter invert opacity-80 hover:opacity-100 transition-opacity' />
          </div>
          <CartIcon onClick={() => setIsCartOpen(true)} />
          <div className='hidden lg:block z-[90]'>
            <DropdownLanguage />
          </div>
        </div>
      </div>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  )
}

export default Navbar
