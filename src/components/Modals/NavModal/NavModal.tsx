import type { ReactNode } from 'react'
import { NavMenuListModal } from '~/components/MenuList/NavMenuList'
import angleDownIcon from '~/assets/FAIcon/angle-down-solid-full.svg'

interface NavModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function NavModal({ open, onClose, children }: NavModalProps) {
  return (
    <div onClick={onClose} className={`z-200 fixed inset-0 flex justify-start items-center transition-colors ${open ? 'visible bg-black/20' : 'invisible'}`}>
      <div onClick={(e) => e.stopPropagation()} className='inset w-50 h-screen bg-white text-black text-xs font-bold border-b border-black'>
        {children}
        <NavMenuLogin />
        <NavMenuListModal />
      </div>

    </div>
  )
}

const NavMenuLogin = () => {
  return (
    <div className='z-200 p-3 border-b-6 border-gray-100'>
      <p className='pb-2 font-thin'>GLOBAL / USD</p>
      <div className='flex gap-1 items-center'>
        <button className='-translate-y-0.5'>Login</button>
        <div className='flex justify-center items-center w-5 h-5 bg-black rounded-full'>
          <input type="image" src={angleDownIcon} className='w-5 h-5 p-1 filter bg-img-white -rotate-90 ' />
        </div>
      </div>
    </div>

  )
}

