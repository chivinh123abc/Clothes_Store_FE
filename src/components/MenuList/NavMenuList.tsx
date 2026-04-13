// Dữ liệu chung cho cả 2 menu để tránh lặp lại code
// const NAV_ITEMS = [
//   { label: "NEW", href: "#" },
//   { label: "BEST", href: "#" },
//   { label: "SHOP", href: "#" },
//   { label: "LEGACY", href: "#" },
//   { label: "COMMUNITY", href: "#" },
//   { label: "Q&A", href: "#" },
// ];

import React, { useState } from 'react'
import { FlyoutLink } from '../DropdownLanguage/DropdownLanguage'
import angleDownIcon from '~/assets/FAIcon/angle-down-solid-full.svg'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

// 1. For Medal
export const NavMenuListModal = () => {
  const [activeMenu, setActiveMenu] = useState<
    'shop' | 'legacy' | 'community' | null
  >(null)

  const onFocusShop = () => {
    setActiveMenu(activeMenu === 'shop' ? null : 'shop')
  }

  const onFocusLegacy = () => {
    setActiveMenu(activeMenu === 'legacy' ? null : 'legacy')
  }

  const onFocusCommunity = () => {
    setActiveMenu(activeMenu === 'community' ? null : 'community')
  }

  const location = useLocation()
  const isActive = (path: string) => location.pathname === path
  const isParentActive = (basePath: string) => location.pathname.startsWith(basePath)

  return (
    <ul className="flex flex-col gap-0 text-white font-oswald text-lg tracking-widest">
      <li className="border-b border-t1-gray/30 px-4 py-4 hover:bg-white/5 transition-colors">
        <Link to="/new" className={`hover:text-t1-red transition-colors ${isActive('/new') ? 'text-t1-red' : ''}`}>NEW</Link>
      </li>
      <li className="border-b border-t1-gray/30 px-4 py-4 hover:bg-white/5 transition-colors">
        <Link to="/best" className={`hover:text-t1-red transition-colors ${isActive('/best') ? 'text-t1-red' : ''}`}>BEST</Link>
      </li>
      <li className="relative border-b border-t1-gray/30 px-4 py-4 hover:bg-white/5 transition-colors">
        <Link to="/shop" className={`hover:text-t1-red transition-colors ${isParentActive('/shop') ? 'text-t1-red' : ''}`}>
          SHOP
        </Link>
        <input
          onClick={onFocusShop}
          type="image"
          src={angleDownIcon}
          className={`w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 z-20 filter invert opacity-70 transition-transform duration-300 ease-linear ${activeMenu === 'shop' ? 'rotate-180' : 'rotate-0'}`}
        />
      </li>
      <AnimatePresence initial={false}>
        {activeMenu === 'shop' && (
          <motion.li
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full overflow-hidden"
          >
            <ShopExpand />
          </motion.li>
        )}
      </AnimatePresence>
      <li className="relative border-b border-t1-gray/30 px-4 py-4 hover:bg-white/5 transition-colors">
        <a href="" className="hover:text-t1-red">
          LEGACY
        </a>
        <input
          onClick={onFocusLegacy}
          type="image"
          src={angleDownIcon}
          className={`w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 z-20 filter invert opacity-70 transition-transform duration-300 ${activeMenu === 'legacy' ? 'rotate-180' : 'rotate-0'}`}
        />
      </li>
      <AnimatePresence initial={false}>
        {activeMenu === 'legacy' && (
          <motion.li
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full overflow-hidden"
          >
            <LegacyExpand />
          </motion.li>
        )}
      </AnimatePresence>
      <li className="relative border-b border-t1-gray/30 px-4 py-4 hover:bg-white/5 transition-colors">
        <Link to='/community?tab=NOTICE' className={`hover:text-t1-red transition-colors ${isParentActive('/community') ? 'text-t1-red' : ''}`}>
          COMMUNITY
        </Link>
        <input
          onClick={onFocusCommunity}
          type="image"
          src={angleDownIcon}
          className={`w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 z-20 filter invert opacity-70 transition-transform duration-300 ${activeMenu === 'community' ? 'rotate-180' : 'rotate-0'}`}
        />
      </li>
      <AnimatePresence initial={false}>
        {activeMenu === 'community' && (
          <motion.li
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full overflow-hidden"
          >
            <CommunityExpand />
          </motion.li>
        )}
      </AnimatePresence>
    </ul>
  )
}

const ShopExpand = () => {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <div className='bg-white/5'>
      <ul className="font-inter font-light text-sm pl-8 py-4 flex flex-col gap-4 text-gray-400">
        <li><Link to="/shop" className={`hover:text-white transition-colors uppercase ${isActive('/shop') ? 'text-white' : ''}`}>ALL</Link></li>
        <li><a href="" className="hover:text-white transition-colors uppercase">TEAM KIT</a></li>
        <li><a href="" className="hover:text-white transition-colors uppercase">COLLECTION</a></li>
        <li><a href="" className="hover:text-white transition-colors uppercase">COLLABORATION</a></li>
        <li><a href="" className="hover:text-white transition-colors uppercase">SALE</a></li>
      </ul>
    </div>
  )
}

const LegacyExpand = () => {
  const location = useLocation()

  return (
    <div className='bg-white/5'>
      <ul className="font-inter font-light text-sm pl-8 py-4 flex flex-col gap-4 text-gray-400">
        <li><a href="" className="hover:text-white transition-colors uppercase">2025 WORLD COLLECTION</a></li>
        <li><a href="" className="hover:text-white transition-colors uppercase">2024 WORLD COLLECTION</a></li>
        <li><a href="" className="hover:text-white transition-colors uppercase">2023 WORLD COLLECTION</a></li>
        <li><a href="" className="hover:text-white transition-colors uppercase">APPAREL</a></li>
        <li><a href="" className="hover:text-white transition-colors uppercase">GIFT & ACCESSORIES</a></li>
      </ul>
    </div>
  )
}

const CommunityExpand = () => {
  return (
    <div className='bg-white/5'>
      <ul className="font-inter font-light text-sm pl-8 py-4 flex flex-col gap-4 text-gray-400">
        <li><Link to="/community?tab=NOTICE" className="hover:text-white transition-colors uppercase">NOTICE</Link></li>
        <li><Link to="/community?tab=REVIEW" className="hover:text-white transition-colors uppercase">REVIEW</Link></li>
        <li><Link to="/community?tab=EVENT" className="hover:text-white transition-colors uppercase">EVENT</Link></li>
        <li><Link to="/community?tab=QA" className="hover:text-white transition-colors uppercase">Q&A</Link></li>
      </ul>
    </div>
  )
}

// 2. For Nav
export const NavMenuListMedium = () => {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path
  const isParentActive = (basePath: string) => location.pathname.startsWith(basePath)

  return (
    <ul className="flex flex-row gap-[3vw]">
      <li>
        <Link to="/new" className={`hover:text-t1-red transition-colors cursor-pointer ${isActive('/new') ? 'text-t1-red' : ''}`}>NEW</Link>
      </li>
      <li>
        <Link to="/best" className={`hover:text-t1-red transition-colors cursor-pointer ${isActive('/best') ? 'text-t1-red' : ''}`}>BEST</Link>
      </li>
      <li>
        <DropdownItem title="SHOP" content={ShopContent} href='/shop' active={isParentActive('/shop')} />
      </li>
      <li>
        <DropdownItem title="LEGACY" content={LegacyContent} active={isParentActive('/legacy')} />
      </li>
      <li>
        <DropdownItem title='COMMUNITY' content={CommunityContent} href='/community?tab=NOTICE' active={isParentActive('/community')} />
      </li>
    </ul>
  )
}

const DropdownItem = ({
  title,
  content,
  href = '#',
  active = false
}: {
  title: string
  content: React.ComponentType
  href?: string
  active?: boolean
}) => {
  return (
    <div className={`flex justify-center hover:text-t1-red transition-colors ${active ? 'text-t1-red' : ''}`}>
      <FlyoutLink href={href} FlyoutContent={content}>
        <div className='flex justify-center items-center'>
          <span className=''>{title}</span>
        </div>
      </FlyoutLink>
    </div>
  )
}

const ShopContent = () => {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <div className='w-48 bg-[#111111]/95 backdrop-blur-md shadow-2xl border-t-[3px] border-t-t1-red p-5 flex flex-col gap-3'>
      <Link to="/shop" className={`block text-xs font-inter tracking-widest hover:text-white hover:translate-x-1 transition-all ${isActive('/shop') ? 'text-white' : 'text-[#cccccc]'}`}>ALL</Link>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white hover:translate-x-1 transition-all'>TEAM KIT</a>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white hover:translate-x-1 transition-all'>COLLECTION</a>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white hover:translate-x-1 transition-all'>COLLABORATION</a>
      <a href="" className='block text-xs font-inter tracking-widest text-t1-red hover:text-red-500 hover:translate-x-1 transition-all'>SALE</a>
    </div>
  )
}

const LegacyContent = () => {
  return (
    <div className='w-56 bg-[#111111]/95 backdrop-blur-md shadow-2xl border-t-[3px] border-t-t1-red p-5 flex flex-col gap-3'>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white hover:translate-x-1 transition-all'>2025 WORLD COLLECTION</a>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white hover:translate-x-1 transition-all'>2024 WORLD COLLECTION</a>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white hover:translate-x-1 transition-all'>2023 WORLD COLLECTION</a>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white hover:translate-x-1 transition-all'>APPAREL</a>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white hover:translate-x-1 transition-all'>GIFT & ACCESSORIES</a>
    </div>
  )
}

const CommunityContent = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const currentTab = searchParams.get('tab')

  const isTabActive = (tab: string) => location.pathname === '/community' && currentTab === tab

  return (
    <div className='w-40 bg-[#111111]/95 backdrop-blur-md shadow-2xl border-t-[3px] border-t-t1-red p-5 flex flex-col gap-3'>
      <Link to="/community?tab=NOTICE" className={`block text-xs font-inter tracking-widest hover:text-white hover:translate-x-1 transition-all ${isTabActive('NOTICE') ? 'text-white' : 'text-[#cccccc]'}`}>NOTICE</Link>
      <Link to="/community?tab=REVIEW" className={`block text-xs font-inter tracking-widest hover:text-white hover:translate-x-1 transition-all ${isTabActive('REVIEW') ? 'text-white' : 'text-[#cccccc]'}`}>REVIEW</Link>
      <Link to="/community?tab=EVENT" className={`block text-xs font-inter tracking-widest hover:text-white hover:translate-x-1 transition-all ${isTabActive('EVENT') ? 'text-white' : 'text-[#cccccc]'}`}>EVENT</Link>
      <Link to="/community?tab=QA" className={`block text-xs font-inter tracking-widest hover:text-white hover:translate-x-1 transition-all ${isTabActive('QA') ? 'text-white' : 'text-[#cccccc]'}`}>Q&A</Link>
    </div>
  )
}
