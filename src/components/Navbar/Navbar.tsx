import SearchBar from '~/components/SearchBar/SearchBar'
import { Link } from 'react-router-dom'
import CartIcon from '../Cart/CartIcon'
import CartDrawer from '../Cart/CartDrawer'
import DropdownLanguage from '../DropdownLanguage/DropdownLanguage'
import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'
import { NavMenuListMedium } from '../MenuList/NavMenuList'
import heartIcon from '~/assets/SearchBar/heart.png'
import menuIcon from '~/assets/Navbar/menu.png'

import { motion } from 'framer-motion'

interface NavbarProps {
  setOpenNav: Dispatch<SetStateAction<boolean>>;
}

function Navbar({ setOpenNav }: NavbarProps) {
  const [isTop, setIsTop] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={false}
      animate={{
        top: 24,
        width: '100%'
      }}
      transition={{ duration: 0.1 }}
      className="text-t1-text fixed z-50 font-oswald text-lg tracking-wider"
    >
      <motion.div
        animate={{
          height: 70,
          backgroundColor: isTop ? 'rgba(17, 17, 17, 0)' : 'rgba(17, 17, 17, 0.95)',
          backdropFilter: isTop ? 'blur(0px)' : 'blur(70px)',
          borderColor: 'transparent',
          borderRadius: 0,
          paddingLeft: 24,
          paddingRight: 24
        }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center w-full border-b transition-colors"
      >

        <div className='lg:hidden'>
          <input onClick={() => setOpenNav(true)} type="image" src={menuIcon} className='w-5 h-5 filter invert' />
        </div>

        <div className='flex items-center gap-4 md:gap-10'>
          <Link to='/' className='text-t1-text font-black text-xl md:text-3xl italic tracking-tighter hover:text-t1-red transition-colors cursor-pointer'>
            CLOTHES STORE
          </Link>

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
      </motion.div>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </motion.nav>
  )
}

export default Navbar
