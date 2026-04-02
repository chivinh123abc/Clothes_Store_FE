// Dữ liệu chung cho cả 2 menu để tránh lặp lại code
// const NAV_ITEMS = [
//   { label: "NEW", href: "#" },
//   { label: "BEST", href: "#" },
//   { label: "SHOP", href: "#" },
//   { label: "LEGACY", href: "#" },
//   { label: "COMMUNITY", href: "#" },
//   { label: "Q&A", href: "#" },
// ];

import { useState } from 'react'
import { FlyoutLink } from '../DropdownLanguage/DropdownLanguage'
import angleDownIcon from '~/assets/FAIcon/angle-down-solid-full.svg'

// 1. For Medal
export const NavMenuListModal = () => {
  const [activeMenu, setActiveMenu] = useState<'shop' | 'legacy' | 'community' | null>(null)

  const onFocusShop = () => {
    setActiveMenu(activeMenu === 'shop' ? null : 'shop')
  }

  const onFocusLegacy = () => {
    setActiveMenu(activeMenu === 'legacy' ? null : 'legacy')
  }

  const onFocusCommunity = () => {
    setActiveMenu(activeMenu === 'community' ? null : 'community')
  }

  return (
    <ul className="flex flex-col gap-0">
      <li className="border border-gray-100 px-2 py-2">
        <a href="">
          NEW
        </a>
      </li>
      <li className="border border-gray-100 px-2 py-2">
        <a className='' href="">
          BEST
        </a>
      </li>
      <li className="relative border border-gray-100 px-2 py-2">
        <a href='' className=''>SHOP</a>
        <input
          onClick={onFocusShop}
          type="image" src={angleDownIcon} className={`w-5 h-5 absolute inset-0 translate-y-1/3 translate-x-40 z-20 transition-transform duration-300 ease-linear ${(activeMenu === 'shop') ? 'rotate-180' : 'rotate-0'}`}
        />
      </li>
      {activeMenu === 'shop' || true ? (
        <li className="w-full">
          <ShopExpand active={activeMenu === 'shop'} />
        </li>
      ) : null}
      <li className="relative border border-gray-100 px-2 py-2">
        <a href='' className=''>LEGACY</a>
        <input
          onClick={onFocusLegacy}
          type="image" src={angleDownIcon} className={`w-5 h-5 absolute inset-0 translate-y-1/3 translate-x-40 z-20 transition-transform duration-300 ${(activeMenu === 'legacy') ? 'rotate-180' : 'rotate-0'}`}
        />
      </li>
      {activeMenu === 'legacy' || true ? (
        <li className="w-full">
          <LegacyExpand active={activeMenu === 'legacy'} />
        </li>
      ) : null}
      <li className="relative border border-gray-100 px-2 py-2">
        <a href='' className=''>COMMUNITY</a>
        <input
          onClick={onFocusCommunity}
          type="image" src={angleDownIcon} className={`w-5 h-5 absolute inset-0 translate-y-1/3 translate-x-40 z-20 transition-transform duration-300 ${(activeMenu === 'community') ? 'rotate-180' : 'rotate-0'}`}
        />
      </li>
      {activeMenu === 'community' || true ? (
        <li className="w-full">
          <CommunityExpand active={activeMenu === 'community'} />
        </li>
      ) : null}
      <li className="border border-gray-100 px-2 py-2">
        <a href="">
          Q&A
        </a>
      </li>
    </ul>
  )
}

const ShopExpand = ({ active }: { active: boolean }) => {
  return (
    <div className={`grid transition-all duration-300 ease-in-out ${active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
      <div className="overflow-hidden">
        <ul className="font-light bg-gray-50 pl-4 py-2 flex flex-col gap-2">
          <li><a href="" className="hover:text-t1-red transition-colors">ALL</a></li>
          <li><a href="" className="hover:text-t1-red transition-colors">TEAM KIT</a></li>
          <li><a href="" className="hover:text-t1-red transition-colors">COLLECTION</a></li>
          <li><a href="" className="hover:text-t1-red transition-colors">COLLABORATION</a></li>
          <li><a href="" className="hover:text-t1-red transition-colors">SALE</a></li>
        </ul>
      </div>
    </div>
  )
}

const LegacyExpand = ({ active }: { active: boolean }) => {
  return (
    <div className={`grid transition-all duration-300 ease-in-out ${active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
      <div className="overflow-hidden">
        <ul className="font-light bg-gray-50 pl-4 py-2 flex flex-col gap-2">
          <li><a href="" className="hover:text-t1-red transition-colors">2025 WORLD COLLECTION</a></li>
          <li><a href="" className="hover:text-t1-red transition-colors">2024 WORLD COLLECTION</a></li>
          <li><a href="" className="hover:text-t1-red transition-colors">2023 WORLD COLLECTION</a></li>
          <li><a href="" className="hover:text-t1-red transition-colors">APPAREL</a></li>
          <li><a href="" className="hover:text-t1-red transition-colors">GIFT & ACCESSORIES</a></li>
        </ul>
      </div>
    </div>
  )
}

const CommunityExpand = ({ active }: { active: boolean }) => {
  return (
    <div className={`grid transition-all duration-300 ease-in-out ${active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
      <div className="overflow-hidden">
        <ul className="font-light bg-gray-50 pl-4 py-2 flex flex-col gap-2">
          <li><a href="" className="hover:text-t1-red transition-colors">NOTICE</a></li>
          <li><a href="" className="hover:text-t1-red transition-colors">REVIEW</a></li>
          <li><a href="" className="hover:text-t1-red transition-colors">EVENT</a></li>
          <li><a href="" className="hover:text-t1-red transition-colors">FAQ</a></li>
        </ul>
      </div>
    </div>
  )
}

// 2. For Nav
export const NavMenuListMedium = () => {
  return (
    <ul className="flex flex-row gap-[3vw]">
      <li>
        <a href="" className="hover:text-t1-red transition-colors cursor-pointer">NEW</a>
      </li>
      <li>
        <a href="" className="hover:text-t1-red transition-colors cursor-pointer">BEST</a>
      </li>
      <li>
        <DropdownItem title='SHOP' content={ShopContent} />
      </li>
      <li>
        <DropdownItem title='LEGACY' content={LegacyContent} />
      </li>
      <li>
        <DropdownItem title='COMMUNITY' content={CommunityContent} />
      </li>
      <li>
        <a href="" className="hover:text-t1-red transition-colors cursor-pointer">Q&A</a>
      </li>
    </ul>
  )
}

const DropdownItem = ({ title, content }: { title: string, content: React.ComponentType }) => {
  return (
    <div className='flex justify-center hover:text-t1-red transition-colors cursor-pointer'>
      <FlyoutLink href='#' FlyoutContent={content}>
        <div className='flex justify-center items-center'>
          <span className=''>{title}</span>
        </div>
      </FlyoutLink>
    </div>
  )
}

const ShopContent = () => {
  return (
    <div className='w-48 bg-[#111111]/95 backdrop-blur-md shadow-2xl border-t-[3px] border-t-t1-red p-5 flex flex-col gap-3'>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white hover:translate-x-1 transition-all'>ALL</a>
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
  return (
    <div className='w-40 bg-[#111111]/95 backdrop-blur-md shadow-2xl border-t-[3px] border-t-t1-red p-5 flex flex-col gap-3'>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white hover:translate-x-1 transition-all'>NOTICE</a>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white hover:translate-x-1 transition-all'>REVIEW</a>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white hover:translate-x-1 transition-all'>EVENT</a>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white hover:translate-x-1 transition-all'>FAQ</a>
    </div>
  )
}
