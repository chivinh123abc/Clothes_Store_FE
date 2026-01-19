import type React from 'react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function DropdownLanguage() {
  return (
    <div className='flex justify-center'>
      <FlyoutLink href='#' FlyoutContent={LanguageContent}>
        <div className='flex justify-center items-center'>
          <span>GL</span>
          <img src="src/assets/FAIcon/angle-down-solid-full.svg" alt="angleDown" className='w-3 h-3 bg-img-white' />
        </div>
      </FlyoutLink>
    </div>
  )
}

export const FlyoutLink = ({ children, href, FlyoutContent }: { children: React.ReactNode; href: string; FlyoutContent: React.ComponentType }) => {

  const [open, setOpen] = useState(false)
  const showFlyout = open && FlyoutContent

  return (
    <div className='group relative h-fit w-fit'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a href={href} className='relative text-white'>
        {children}
      </a>

      {/* RENDER FLYOUT CONTENT */}
      <AnimatePresence>
        {showFlyout &&
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='absolute top-6 -left-2 bg-white text-black'
          >
            <div className='absolute -top-6 left-0 right-0 h-6 bg-transparent' />
            {/* <div className='absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white -z-1' /> */}
            <FlyoutContent />
          </motion.div>
        }
      </AnimatePresence>
    </div>
  )
}

const LanguageContent = () => {
  return (
    <div className='w-16 bg-white shadow-xl text-center'>
      <a href="" className='block text-sm py-1'>KR</a>
      <a href="" className='block text-sm py-1'>CN</a>
      <a href="" className='block text-sm py-1'>VN</a>
      <a href="" className='block text-sm py-1'>RS</a>
    </div>
  )
}

export default DropdownLanguage
