import type React from 'react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '~/contexts/LanguageContext'
import FAIcon from '~/assets/FAIcon/angle-down-solid-full.svg'

function DropdownLanguage() {
  const { language } = useLanguage()

  return (
    <div className='flex justify-center'>
      <FlyoutLink FlyoutContent={LanguageContent}>
        <div className='flex justify-center items-center gap-1 min-w-[32px]'>
          <span className='text-sm font-bold'>{language.toUpperCase()}</span>
          <img src={FAIcon} alt="angleDown" className='w-2.5 h-2.5 bg-img-white' />
        </div>
      </FlyoutLink>
    </div>
  )
}

export const FlyoutLink = ({
  children,
  FlyoutContent,
  align = 'center'
}: {
  children: React.ReactNode
  FlyoutContent: React.ComponentType
  align?: 'left' | 'right' | 'center'
}) => {
  const [open, setOpen] = useState(false)
  const showFlyout = open && FlyoutContent

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2'
  }

  return (
    <div
      className='group relative h-fit w-fit'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className='relative z-[60] text-inherit transition-colors group-hover:text-t1-red cursor-pointer'>
        {children}
      </div>

      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`absolute top-10 z-50 ${alignmentClasses[align]}`}
          >
            <div className='absolute -top-6 left-0 right-0 h-6 bg-transparent cursor-default' />
            <FlyoutContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const LanguageContent = () => {
  const { language, setLanguage } = useLanguage()

  return (
    <div className='w-20 bg-[#111] border border-white/10 shadow-2xl py-2 flex flex-col'>
      <button
        onClick={() => setLanguage('en')}
        className={`block text-[11px] py-2 font-oswald font-bold transition-colors cursor-pointer ${
          language === 'en' ? 'text-t1-red bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        ENGLISH
      </button>
      <button
        onClick={() => setLanguage('vi')}
        className={`block text-[11px] py-2 font-oswald font-bold transition-colors cursor-pointer ${
          language === 'vi' ? 'text-t1-red bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        TIẾNG VIỆT
      </button>
    </div>
  )
}

export default DropdownLanguage
