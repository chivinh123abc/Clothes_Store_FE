import SearchBar from '~/components/SearchBar/SearchBar'
import CartIcon from '../Cart/CartIcon'
import DropdownLanguage from '../DropdownLanguage/DropdownLanguage'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { NavMenuListMedium } from '../MenuList/NavMenuList'
import heartIcon from '~/assets/SearchBar/heart.png'
import menuIcon from '~/assets/Navbar/menu.png'
import { Link, useLocation } from 'react-router-dom'; // Thêm useLocation

// Đổi thành optional (?) để khi gọi <Navbar /> ở trang Community không bị báo lỗi thiếu prop
interface NavbarProps {
  setOpenNav?: Dispatch<SetStateAction<boolean>>;
}

function Navbar({ setOpenNav }: NavbarProps) {
  const [isTop, setIsTop] = useState(true);
  const location = useLocation(); // Lấy đường dẫn URL hiện tại

  // Kiểm tra xem người dùng có đang ở trang Community không
  const isCommunity = location.pathname.includes('/community');

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // LOGIC ĐỔI MÀU GIAO DIỆN TỰ ĐỘNG:
  // - Nếu ở trang Community: Chữ đỏ (text-red-600), nền trắng mờ (bg-white/80)
  // - Nếu ở trang Home: Chữ trắng (text-white), nền đen mờ (bg-black/20)
  const navTextColor = isCommunity ? 'text-red-700' : 'text-white';
  const navBgColor = isCommunity 
    ? (isTop ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-gray-200' : 'bg-white/95 backdrop-blur-2xl shadow-md') 
    : (isTop ? 'bg-black/20' : 'bg-black/30 backdrop-blur-2xl');

  return (
    <nav className={`${navTextColor} text-xs fixed top-8 w-screen z-[100] transition-colors duration-300`}>
      <div className={`flex justify-between items-center h-18 px-12 font-semibold transition-all duration-300 ${navBgColor}`}>

        <div className='lg:hidden'>
          <input 
            onClick={() => setOpenNav && setOpenNav(true)} 
            type="image" 
            src={menuIcon} 
            className={`w-4 h-4 ${isCommunity ? 'opacity-70' : 'filter bg-img-white'}`} 
          />
        </div>

        {/* Hidden UL in mobile */}
        <div className='hidden lg:block'>
          <NavMenuListMedium />
        </div>

        {/* LOGO CON RÙA (Đã được bọc Link để bấm về Home) */}
        <div className='absolute left-1/2 -translate-x-16 hover:scale-105 transition-transform cursor-pointer'>
          <Link to="/">
            <img className='w-16 rounded-full border-2 border-transparent hover:border-red-500 transition-all' src="https://i.pinimg.com/736x/45/51/18/45511811d2a613a3f780f75829307928.jpg" alt="rinStore" />
          </Link>
        </div>

        <div className='flex gap-2 items-center'>
          <SearchBar />
          <div className='flex gap-1 px-1 items-center'>
            <input 
              type="image" 
              src={heartIcon} 
              className={`w-4 h-4 ${isCommunity ? 'opacity-70' : 'filter bg-img-white'}`} 
            />
            <CartIcon />
          </div>
          <DropdownLanguage />
        </div>
      </div>
    </nav>
  )
}

export default Navbar