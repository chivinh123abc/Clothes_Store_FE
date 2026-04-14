/* eslint-disable indent */
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
  const [activeSub, setActiveSub] = useState<'COLLECTION' | 'COLLABORATION' | null>(null)
  const [activeLevel3, setActiveLevel3] = useState<'ESSENTIAL' | 'LEAGUE OF LEGENDS' | 'VALORANT' | null>(null)

  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  const toggleSub = (sub: 'COLLECTION' | 'COLLABORATION') => {
    setActiveSub(activeSub === sub ? null : sub)
    setActiveLevel3(null)
  }

  const toggleLevel3 = (item: 'ESSENTIAL' | 'LEAGUE OF LEGENDS' | 'VALORANT') => {
    setActiveLevel3(activeLevel3 === item ? null : item)
  }

  return (
    <div className='bg-white/5'>
      <ul className="font-inter font-light text-sm pl-8 py-4 flex flex-col gap-4 text-gray-400">
        <li>
          <Link to="/shop" className={`hover:text-white transition-colors uppercase ${isActive('/shop') ? 'text-white' : ''}`}>ALL</Link>
        </li>
        <li>
          <Link to="/shop/team-kit" className="hover:text-white transition-colors uppercase">TEAM KIT</Link>
        </li>

        {/* COLLECTION Nested Accordion */}
        <li className='relative flex flex-col gap-4'>
          <div className='flex items-center justify-between pr-4 cursor-pointer' onClick={() => toggleSub('COLLECTION')}>
            <span className={`hover:text-white transition-colors uppercase ${activeSub === 'COLLECTION' ? 'text-white' : ''}`}>COLLECTION</span>
            <img
              src={angleDownIcon}
              className={`w-3 h-3 invert opacity-50 transition-transform ${activeSub === 'COLLECTION' ? 'rotate-180' : ''}`}
            />
          </div>
          <AnimatePresence>
            {activeSub === 'COLLECTION' && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className='pl-4 flex flex-col gap-4 overflow-hidden border-l border-white/10'
              >
                {['ESSENTIAL', 'LEAGUE OF LEGENDS', 'VALORANT'].map((item) => (
                  <li key={item} className='flex flex-col gap-4'>
                    <div
                      className='flex items-center justify-between pr-4 cursor-pointer'
                      onClick={() => toggleLevel3(item as any)}
                    >
                      <span className={`hover:text-white transition-colors uppercase ${activeLevel3 === item ? 'text-white' : ''}`}>{item}</span>
                      <img
                        src={angleDownIcon}
                        className={`w-3 h-3 invert opacity-50 transition-transform ${activeLevel3 === item ? 'rotate-180' : ''}`}
                      />
                    </div>
                    <AnimatePresence>
                      {activeLevel3 === item && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className='pl-4 flex flex-col gap-4 overflow-hidden border-l border-white/10'
                        >
                          <li><Link to={`/shop/collection/${item.toLowerCase().replace(/ /g, '-')}/gift-and-accessory`} className="hover:text-white transition-colors uppercase">GIFT & ACCESSORY</Link></li>
                          <li><Link to={`/shop/collection/${item.toLowerCase().replace(/ /g, '-')}/apparel`} className="hover:text-white transition-colors uppercase">APPAREL</Link></li>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>

        {/* COLLABORATION Nested Accordion */}
        <li className='relative flex flex-col gap-4'>
          <div className='flex items-center justify-between pr-4 cursor-pointer' onClick={() => toggleSub('COLLABORATION')}>
            <span className={`hover:text-white transition-colors uppercase ${activeSub === 'COLLABORATION' ? 'text-white' : ''}`}>COLLABORATION</span>
            <img
              src={angleDownIcon}
              className={`w-3 h-3 invert opacity-50 transition-transform ${activeSub === 'COLLABORATION' ? 'rotate-180' : ''}`}
            />
          </div>
          <AnimatePresence>
            {activeSub === 'COLLABORATION' && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className='pl-4 flex flex-col gap-4 overflow-hidden border-l border-white/10'
              >
                <li><Link to="/shop/collaboration/disney" className="hover:text-white transition-colors uppercase">DISNEY</Link></li>
                <li><Link to="/shop/collaboration/rinstore-x-goalstudio" className="hover:text-white transition-colors uppercase">RINSTORE X GOALSTUDIO</Link></li>
                <li><Link to="/shop/collaboration/rinstore-x-secretlab" className="hover:text-white transition-colors uppercase">RINSTORE X SECRETLAB</Link></li>
                <li><Link to="/shop/collaboration/rinstore-x-razer" className="hover:text-white transition-colors uppercase">RINSTORE X RAZER</Link></li>
              </motion.ul>
            )}
          </AnimatePresence>
        </li>

        <li><Link to="/shop/sale" className="hover:text-white transition-colors uppercase text-t1-red">SALE</Link></li>
      </ul>
    </div>
  )
}

const LegacyExpand = () => {
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
    <div className={`flex justify-center hover:text-t1-red transition-colors cursor-pointer ${active ? 'text-t1-red' : ''}`}>
      <FlyoutLink href={href} FlyoutContent={content}>
        <div className='flex justify-center items-center'>
          <span className=''>{title}</span>
        </div>
      </FlyoutLink>
    </div>
  )
}

const ShopContent = () => {
  const [activeSub, setActiveSub] = useState<'COLLECTION' | 'COLLABORATION' | null>(null)
  const [activeLevel3, setActiveLevel3] = useState<'ESSENTIAL' | 'LEAGUE OF LEGENDS' | 'VALORANT' | null>(null)
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  // Map sub-menus to their vertical alignment offsets
  const getLevel2Top = () => {
    if (activeSub === 'COLLECTION') return 'top-[56px]'
    if (activeSub === 'COLLABORATION') return 'top-[84px]'
    return 'top-0'
  }

  const getLevel3Top = () => {
    if (activeLevel3 === 'ESSENTIAL') return 'top-0'
    if (activeLevel3 === 'LEAGUE OF LEGENDS') return 'top-[28px]'
    if (activeLevel3 === 'VALORANT') return 'top-[56px]'
    return 'top-0'
  }

  return (
    <div className='relative flex items-start bg-transparent'>
      {/* Vertical Hover Bridge: Connects Navbar link to Menu. z-[-1] to not block clicks */}
      <div className='absolute -top-12 left-0 w-full h-12 bg-transparent z-[-1]' />

      {/* Column 1: Main Shop Links Block */}
      <div className='flex flex-col gap-3 w-44 shrink-0 bg-[#111111]/95 backdrop-blur-md shadow-2xl border-t-[3px] border-t-t1-red p-5 z-10'>
        <Link
          to="/shop"
          onMouseEnter={() => {
            setActiveSub(null)
            setActiveLevel3(null)
          }}
          className={`block text-xs font-inter tracking-widest hover:text-white transition-all whitespace-nowrap ${isActive('/shop') ? 'text-white' : 'text-[#cccccc]'}`}
        >
          ALL
        </Link>
        <Link
          to="/shop/team-kit"
          onMouseEnter={() => {
            setActiveSub(null)
            setActiveLevel3(null)
          }}
          className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white transition-all uppercase whitespace-nowrap'
        >
          TEAM KIT
        </Link>
        <Link
          to="/shop/collection"
          onMouseEnter={() => {
            setActiveSub('COLLECTION')
            setActiveLevel3(null)
          }}
          className={`block text-xs font-inter tracking-widest cursor-pointer hover:text-white transition-all uppercase whitespace-nowrap ${activeSub === 'COLLECTION' ? 'text-white' : 'text-[#cccccc]'}`}
        >
          COLLECTION
        </Link>
        <Link
          to="/shop/collaboration"
          onMouseEnter={() => {
            setActiveSub('COLLABORATION')
            setActiveLevel3(null)
          }}
          className={`block text-xs font-inter tracking-widest cursor-pointer hover:text-white transition-all uppercase whitespace-nowrap ${activeSub === 'COLLABORATION' ? 'text-white' : 'text-[#cccccc]'}`}
        >
          COLLABORATION
        </Link>
        <Link
          to="/shop/sale"
          onMouseEnter={() => {
            setActiveSub(null)
            setActiveLevel3(null)
          }}
          className='block text-xs font-inter tracking-widest text-t1-red hover:text-red-500 transition-all uppercase whitespace-nowrap'
        >
          SALE
        </Link>
      </div>

      {/* Dynamic Sub-column Block (Level 2) */}
      <AnimatePresence mode='wait'>
        {activeSub && (
          <div className='absolute left-full top-0 h-full'>
            {/* Hover Bridge 1: Fixed relative to Col 1 */}
            <div className='absolute -left-2 top-0 w-2 h-[800px] bg-transparent z-0' />

            <motion.div
              key={activeSub}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={`relative ml-0 flex flex-col gap-3 bg-[#111111]/95 backdrop-blur-md shadow-2xl border-t-[3px] border-t-t1-red p-5 min-w-[200px] z-10 ${getLevel2Top()}`}
            >
              {activeSub === 'COLLECTION' && (
                <>
                  <Link
                    to="/shop/collection/essential"
                    onMouseEnter={() => setActiveLevel3('ESSENTIAL')}
                    className={`block text-xs font-inter tracking-widest transition-all uppercase whitespace-nowrap ${activeLevel3 === 'ESSENTIAL' ? 'text-white' : 'text-[#cccccc] hover:text-white'}`}
                  >
                    ESSENTIAL
                  </Link>
                  <Link
                    to="/shop/collection/league-of-legends"
                    onMouseEnter={() => setActiveLevel3('LEAGUE OF LEGENDS')}
                    className={`block text-xs font-inter tracking-widest transition-all uppercase whitespace-nowrap ${activeLevel3 === 'LEAGUE OF LEGENDS' ? 'text-white' : 'text-[#cccccc] hover:text-white'}`}
                  >
                    LEAGUE OF LEGENDS
                  </Link>
                  <Link
                    to="/shop/collection/valorant"
                    onMouseEnter={() => setActiveLevel3('VALORANT')}
                    className={`block text-xs font-inter tracking-widest transition-all uppercase whitespace-nowrap ${activeLevel3 === 'VALORANT' ? 'text-white' : 'text-[#cccccc] hover:text-white'}`}
                  >
                    VALORANT
                  </Link>
                </>
              )}
              {activeSub === 'COLLABORATION' && (
                <>
                  <Link to="/shop/collaboration/disney" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white transition-all uppercase whitespace-nowrap'>DISNEY</Link>
                  <Link to="/shop/collaboration/rinstore-x-goalstudio" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white transition-all uppercase whitespace-nowrap'>RINSTORE X GOALSTUDIO</Link>
                  <Link to="/shop/collaboration/rinstore-x-secretlab" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white transition-all uppercase whitespace-nowrap'>RINSTORE X SECRETLAB</Link>
                  <Link to="/shop/collaboration/rinstore-x-razer" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white transition-all uppercase whitespace-nowrap'>RINSTORE X RAZER</Link>
                </>
              )}

              {/* Dynamic Sub-column Block (Level 3) */}
              <AnimatePresence mode='wait'>
                {activeLevel3 && (
                  <div className='absolute left-full top-0 h-full'>
                    {/* Hover Bridge 2: Fixed relative to Col 2 */}
                    <div className='absolute -left-2 top-0 w-2 h-[800px] bg-transparent z-0' />

                    <motion.div
                      key={activeLevel3}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`relative ml-0 flex flex-col gap-3 bg-[#111111]/95 backdrop-blur-md shadow-2xl border-t-[3px] border-t-t1-red p-5 min-w-[200px] z-10 ${getLevel3Top()}`}
                    >
                      <Link to={`/shop/collection/${activeLevel3.toLowerCase().replace(/ /g, '-')}/gift-and-accessory`} className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white transition-all uppercase whitespace-nowrap'>GIFT & ACCESSORY</Link>
                      <Link to={`/shop/collection/${activeLevel3.toLowerCase().replace(/ /g, '-')}/apparel`} className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white transition-all uppercase whitespace-nowrap'>APPAREL</Link>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

const LegacyContent = () => {
  return (
    <div className='w-56 bg-[#111111]/95 backdrop-blur-md shadow-2xl border-t-[3px] border-t-t1-red p-5 flex flex-col gap-3'>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white transition-all'>2025 WORLD COLLECTION</a>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white transition-all'>2024 WORLD COLLECTION</a>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white transition-all'>2023 WORLD COLLECTION</a>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white transition-all'>APPAREL</a>
      <a href="" className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white transition-all'>GIFT & ACCESSORIES</a>
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
      <Link to="/community?tab=NOTICE" className={`block text-xs font-inter tracking-widest hover:text-white transition-all ${isTabActive('NOTICE') ? 'text-white' : 'text-[#cccccc]'}`}>NOTICE</Link>
      <Link to="/community?tab=REVIEW" className={`block text-xs font-inter tracking-widest hover:text-white transition-all ${isTabActive('REVIEW') ? 'text-white' : 'text-[#cccccc]'}`}>REVIEW</Link>
      <Link to="/community?tab=EVENT" className={`block text-xs font-inter tracking-widest hover:text-white transition-all ${isTabActive('EVENT') ? 'text-white' : 'text-[#cccccc]'}`}>EVENT</Link>
      <Link to="/community?tab=QA" className={`block text-xs font-inter tracking-widest hover:text-white transition-all ${isTabActive('QA') ? 'text-white' : 'text-[#cccccc]'}`}>Q&A</Link>
    </div>
  )
}
