import SearchBar from '~/components/SearchBar/SearchBar'
import { Link } from 'react-router-dom'
import CartIcon from '../Cart/CartIcon'
import CartDrawer from '../Cart/CartDrawer'
import FavoritesDrawer from '../Favorites/FavoritesDrawer'
import DropdownLanguage from '../DropdownLanguage/DropdownLanguage'
import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'
import { NavMenuListMedium } from '../MenuList/NavMenuList'
import LoginModal from '../Modals/LoginModal/LoginModal'
import menuIcon from '~/assets/Navbar/menu.png'
import { Heart } from 'lucide-react'
import { useAuth } from '~/hooks/useAuth'
import { useFavorites } from '~/contexts/FavoritesContext'

interface NavbarProps {
  setOpenNav: Dispatch<SetStateAction<boolean>>;
}

function Navbar({ setOpenNav }: NavbarProps) {
  const [isTop, setIsTop] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFavOpen, setIsFavOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { user } = useAuth()
  const { totalFavorites } = useFavorites()

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleHeartClick = () => {
    if (user) {
      setIsFavOpen(true)
    } else {
      setIsLoginOpen(true)
    }
  }

  return (
    <nav
      className="text-t1-text fixed top-[32px] left-0 right-0 z-50 font-oswald text-lg tracking-wider w-full"
    >
      <div
        className={`flex justify-between items-center w-full min-h-[70px] border-b border-transparent transition-all duration-500 ease-in-out px-6 ${isTop ? 'bg-transparent backdrop-blur-0' : 'bg-[#111111]/95 backdrop-blur-[70px]'}`}
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

          {/* Heart / Favorites button */}
          <div className='hidden sm:block'>
            <button
              onClick={handleHeartClick}
              className='relative w-5 h-5 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity'
              title={user ? 'My Favorites' : 'Sign in to view favorites'}
            >
              <Heart
                size={20}
                className={`transition-colors duration-200 ${user && totalFavorites > 0 ? 'text-t1-red fill-t1-red' : 'text-white'}`}
              />
              {user && totalFavorites > 0 && (
                <span className='absolute -top-1 -right-2 bg-t1-red text-white text-[10px] w-4 h-4 font-inter font-bold flex items-center justify-center rounded-full pointer-events-none'>
                  {totalFavorites > 99 ? '99+' : totalFavorites}
                </span>
              )}
            </button>
          </div>

          <CartIcon onClick={() => setIsCartOpen(true)} />

          <div className='hidden lg:block z-[90]'>
            <DropdownLanguage />
          </div>
        </div>
      </div>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FavoritesDrawer open={isFavOpen} onClose={() => setIsFavOpen(false)} />
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  )
}

export default Navbar

