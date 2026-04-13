import type { ReactNode } from 'react'
import { NavMenuListModal } from '~/components/MenuList/NavMenuList'
import angleDownIcon from '~/assets/FAIcon/angle-down-solid-full.svg'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface NavModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function NavModal({ open, onClose, children }: NavModalProps) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[990] cursor-pointer'
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: 'easeOut' }}
            className='fixed top-0 left-0 w-[300px] max-w-[80vw] h-full bg-[#111111] text-t1-text z-[999] shadow-2xl flex flex-col font-inter border-r border-t1-gray/40 overflow-y-auto'
          >
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b border-t1-gray/40 bg-black/40'>
              <h2 className='text-lg font-oswald font-black italic tracking-[0.2em] text-white'>MENU</h2>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-t1-red hover:rotate-90 transition-all duration-300'
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>

            {/* Menu Items */}
            <div className='flex-1 p-4'>
              {children}
              <NavMenuLogin />
              <div className='mt-4'>
                <NavMenuListModal />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

const NavMenuLogin = () => {
  return (
    <div className='p-3 border-b border-t1-gray/30 text-white'>
      <p className='pb-2 font-light text-xs text-gray-400 tracking-widest'>GLOBAL / USD</p>
      <div className='flex gap-2 items-center cursor-pointer hover:text-t1-red transition-colors group'>
        <span className='font-bold uppercase tracking-wider text-sm'>Login</span>
        <div className='flex justify-center items-center w-5 h-5'>
          <input type="image" src={angleDownIcon} className='w-4 h-4 filter invert opacity-50 group-hover:opacity-100 transition-opacity -rotate-90 pointer-events-none' />
        </div>
      </div>
    </div>
  )
}
