import SearchBar from '~/components/SearchBar/SearchBar'
import CartIcon from '../Cart/CartIcon'
import DropdownLanguage from '../DropdownLanguage/DropdownLanguage'
import { type Dispatch, type SetStateAction } from 'react'
import { NavMenuListMedium } from '../MenuList/NavMenuList';

interface NavbarProps {
  setOpenNav: Dispatch<SetStateAction<boolean>>;
}

function Navbar({ setOpenNav }: NavbarProps) {
  // const [openNav, setOpenNav] = useState(false)
  return (
    <nav className='text-white text-xs'>
      <div className='flex justify-between items-center h-18 px-12 font-semibold bg-white/30 backdrop-blur-md'>

        <div className='lg:hidden'>
          <input onClick={() => setOpenNav(true)} type="image" src='src/assets/Navbar/menu.png' className='w-4 h-4 filter bg-img-white' />
        </div>

        {/* Hidden UL in mobile */}
        <div className='hidden lg:block'>
          <NavMenuListMedium />
        </div>

        {/* absolute left-1/2 -translate-x-4/5 */}
        <div className='absolute left-1/2 -translate-x-16'>

          <img className='w-16 rounded-full' src="https://i.pinimg.com/736x/45/51/18/45511811d2a613a3f780f75829307928.jpg" alt="rinStore" />
        </div>

        <div className='flex gap-2'>
          <SearchBar />
          <div className='flex gap-1 px-1'>
            <input type="image" src='src/assets/SearchBar/heart.png' className='w-4 h-4 filter bg-img-white' />
            <CartIcon />
          </div>
          <DropdownLanguage />
        </div>
      </div>
    </nav>
  )
}




export default Navbar
