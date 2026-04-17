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

import React, { useState, useMemo } from 'react'
import { FlyoutLink } from '../DropdownLanguage/DropdownLanguage'
import angleDownIcon from '~/assets/FAIcon/angle-down-solid-full.svg'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '~/contexts/LanguageContext'
import { useCollections } from '~/contexts/CollectionContext'
// import type { Collection } from '~/types/collection'

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

  const { t } = useLanguage()

  return (
    <ul className="flex flex-col gap-0 text-white font-oswald text-lg tracking-widest">
      <li className="border-b border-t1-gray/30 px-4 py-4 hover:bg-white/5 transition-colors">
        <Link to="/new" className={`hover:text-t1-red transition-colors ${isActive('/new') ? 'text-t1-red' : ''}`}>{t('nav.new')}</Link>
      </li>
      <li className="border-b border-t1-gray/30 px-4 py-4 hover:bg-white/5 transition-colors">
        <Link to="/best" className={`hover:text-t1-red transition-colors ${isActive('/best') ? 'text-t1-red' : ''}`}>{t('nav.best')}</Link>
      </li>
      <li className="relative border-b border-t1-gray/30 px-4 py-4 hover:bg-white/5 transition-colors">
        <Link to="/shop" className={`hover:text-t1-red transition-colors ${isParentActive('/shop') ? 'text-t1-red' : ''}`}>
          {t('nav.shop')}
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
        <Link to="/legacy" className={`hover:text-t1-red transition-colors ${isParentActive('/legacy') ? 'text-t1-red' : ''}`}>
          {t('nav.legacy')}
        </Link>
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
          {t('nav.community')}
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

  const { t } = useLanguage()

  return (
    <div className='bg-white/5'>
      <ul className="font-inter font-light text-sm pl-8 py-4 flex flex-col gap-4 text-gray-400">
        <li>
          <Link to="/shop" className={`hover:text-white transition-colors uppercase ${isActive('/shop') ? 'text-white' : ''}`}>{t('nav.all')}</Link>
        </li>
        <li>
          <Link to="/shop/team-kit" className="hover:text-white transition-colors uppercase">{t('nav.teamKit')}</Link>
        </li>

        {/* COLLECTION Nested Accordion */}
        <li className='relative flex flex-col gap-4'>
          <div className='flex items-center justify-between pr-4 cursor-pointer' onClick={() => toggleSub('COLLECTION')}>
            <span className={`hover:text-white transition-colors uppercase ${activeSub === 'COLLECTION' ? 'text-white' : ''}`}>{t('nav.collection')}</span>
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
                      <span className={`hover:text-white transition-colors uppercase ${activeLevel3 === item ? 'text-white' : ''}`}>{t(`nav.${item === 'ESSENTIAL' ? 'essential' : item === 'LEAGUE OF LEGENDS' ? 'leagueOfLegends' : 'valorant'}`)}</span>
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
                          <li><Link to={`/shop/collection/${item.toLowerCase().replace(/ /g, '-')}-gift-and-accessory`} className="hover:text-white transition-colors uppercase">{t('categories.gifts')}</Link></li>
                          <li><Link to={`/shop/collection/${item.toLowerCase().replace(/ /g, '-')}-apparel`} className="hover:text-white transition-colors uppercase">{t('categories.apparel')}</Link></li>
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
            <span className={`hover:text-white transition-colors uppercase ${activeSub === 'COLLABORATION' ? 'text-white' : ''}`}>{t('nav.collaboration')}</span>
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
                <li><Link to="/shop/collaboration/disney" className="hover:text-white transition-colors uppercase">{t('nav.disney')}</Link></li>
                <li><Link to="/shop/collaboration/rinstore-x-goalstudio" className="hover:text-white transition-colors uppercase">{t('nav.goalstudio')}</Link></li>
                <li><Link to="/shop/collaboration/rinstore-x-secretlab" className="hover:text-white transition-colors uppercase">{t('nav.secretlab')}</Link></li>
                <li><Link to="/shop/collaboration/rinstore-x-razer" className="hover:text-white transition-colors uppercase">{t('nav.razer')}</Link></li>
              </motion.ul>
            )}
          </AnimatePresence>
        </li>

        <li><Link to="/shop/sale" className="hover:text-white transition-colors uppercase text-t1-red">{t('nav.sale')}</Link></li>
      </ul>
    </div>
  )
}

const LegacyExpand = () => {
  const { t } = useLanguage()
  return (
    <div className='bg-white/5'>
      <ul className="font-inter font-light text-sm pl-8 py-4 flex flex-col gap-4 text-gray-400">
        <li><Link to="/legacy?sub=worlds-2025" className="hover:text-white transition-colors uppercase">{t('nav.worlds2025')}</Link></li>
        <li><Link to="/legacy?sub=worlds-2024" className="hover:text-white transition-colors uppercase">{t('nav.worlds2024')}</Link></li>
        <li><Link to="/legacy?sub=worlds-2023" className="hover:text-white transition-colors uppercase">{t('nav.worlds2023')}</Link></li>
        <li><Link to="/legacy?sub=apparel" className="hover:text-white transition-colors uppercase">{t('categories.apparel')}</Link></li>
        <li><Link to="/legacy?sub=gifts" className="hover:text-white transition-colors uppercase">{t('categories.gifts')}</Link></li>
      </ul>
    </div>
  )
}

const CommunityExpand = () => {
  const { t } = useLanguage()
  return (
    <div className='bg-white/5'>
      <ul className="font-inter font-light text-sm pl-8 py-4 flex flex-col gap-4 text-gray-400">
        <li><Link to="/community?tab=NOTICE" className="hover:text-white transition-colors uppercase">{t('nav.notice')}</Link></li>
        <li><Link to="/community?tab=REVIEW" className="hover:text-white transition-colors uppercase">{t('nav.review')}</Link></li>
        <li><Link to="/community?tab=EVENT" className="hover:text-white transition-colors uppercase">{t('nav.event')}</Link></li>
        <li><Link to="/community?tab=QA" className="hover:text-white transition-colors uppercase">{t('nav.qa')}</Link></li>
      </ul>
    </div>
  )
}

// 2. For Nav
export const NavMenuListMedium = () => {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path
  const isParentActive = (basePath: string) => location.pathname.startsWith(basePath)
  const { t } = useLanguage()

  return (
    <ul className="flex flex-row gap-[3vw]">
      <li>
        <Link to="/new" className={`hover:text-t1-red transition-colors cursor-pointer ${isActive('/new') ? 'text-t1-red' : ''}`}>{t('nav.new')}</Link>
      </li>
      <li>
        <Link to="/best" className={`hover:text-t1-red transition-colors cursor-pointer ${isActive('/best') ? 'text-t1-red' : ''}`}>{t('nav.best')}</Link>
      </li>
      <li>
        <DropdownItem title={t('nav.shop')} content={ShopContent} href='/shop' active={isParentActive('/shop')} align='left' />
      </li>
      <li>
        <DropdownItem title={t('nav.legacy')} content={LegacyContent} href='/legacy' active={isParentActive('/legacy')} />
      </li>
      <li>
        <DropdownItem title={t('nav.community')} content={CommunityContent} href='/community?tab=NOTICE' active={isParentActive('/community')} />
      </li>
    </ul>
  )
}

const DropdownItem = ({
  title,
  content,
  href = '#',
  active = false,
  align = 'center'
}: {
  title: string
  content: React.ComponentType
  href?: string
  active?: boolean
  align?: 'left' | 'right' | 'center'
}) => {
  return (
    <div className={`flex justify-center hover:text-t1-red transition-colors cursor-pointer ${active ? 'text-t1-red' : ''}`}>
      <FlyoutLink FlyoutContent={content} align={align}>
        <Link to={href} className='flex justify-center items-center'>
          <span className=''>{title}</span>
        </Link>
      </FlyoutLink>
    </div>
  )
}

const ShopContent = () => {
  const { collections, loading } = useCollections()
  const [activeSubId, setActiveSubId] = useState<number | null>(null)
  const [activeLevel3Id, setActiveLevel3Id] = useState<number | null>(null)
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path
  const { t } = useLanguage()

  const shopRoots = useMemo(() => {
    // We want roots that are NOT legacy
    return collections.filter(c => c.collection_slug !== 'legacy')
  }, [collections])

  const activeSub = useMemo(() =>
    shopRoots.find(c => c.collection_id === activeSubId),
    [shopRoots, activeSubId])

  const activeLevel3 = useMemo(() =>
    activeSub?.children?.find(c => c.collection_id === activeLevel3Id),
    [activeSub, activeLevel3Id])

  if (loading) return null

  return (
    <div className='relative flex items-start bg-transparent'>
      <div className='absolute -top-12 left-0 w-full h-12 bg-transparent z-[-1]' />

      {/* Column 1: Main Shop Roots */}
      <div className='flex flex-col gap-3 w-44 shrink-0 bg-[#111111]/95 backdrop-blur-md shadow-2xl border-t-[3px] border-t-t1-red p-5 z-10'>
        <Link
          to="/shop"
          onMouseEnter={() => {
            setActiveSubId(null)
            setActiveLevel3Id(null)
          }}
          className={`block text-xs font-inter tracking-widest hover:text-white transition-all whitespace-nowrap ${isActive('/shop') ? 'text-white' : 'text-[#cccccc]'}`}
        >
          {t('nav.all')}
        </Link>

        {shopRoots.map(root => (
          <Link
            key={root.collection_id}
            to={root.children && root.children.length > 0 ? `/shop/${root.collection_slug}` : `/shop/collection/${root.collection_slug}`}
            onMouseEnter={() => {
              setActiveSubId(root.collection_id)
              setActiveLevel3Id(null)
            }}
            className={`block text-xs font-inter tracking-widest hover:text-white transition-all uppercase whitespace-nowrap ${activeSubId === root.collection_id ? 'text-white' : 'text-[#cccccc]'}`}
          >
            {root.collection_name}
          </Link>
        ))}

        <Link
          to="/shop/sale"
          onMouseEnter={() => {
            setActiveSubId(null)
            setActiveLevel3Id(null)
          }}
          className='block text-xs font-inter tracking-widest text-t1-red hover:text-red-500 transition-all uppercase whitespace-nowrap'
        >
          {t('nav.sale')}
        </Link>
      </div>

      {/* Column 2: Level 2 Children */}
      <AnimatePresence mode='wait'>
        {activeSub && activeSub.children && activeSub.children.length > 0 && (
          <div className='absolute left-full top-0 h-full'>
            <div className='absolute -left-2 top-0 w-2 h-[800px] bg-transparent z-0' />
            <motion.div
              key={activeSub.collection_id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="relative ml-0 flex flex-col gap-3 bg-[#111111]/95 backdrop-blur-md shadow-2xl border-t-[3px] border-t-t1-red p-5 min-w-[200px] z-10"
            >
              {activeSub.children.map(child => (
                <Link
                  key={child.collection_id}
                  to={`/shop/collection/${child.collection_slug}`}
                  onMouseEnter={() => setActiveLevel3Id(child.collection_id)}
                  className={`block text-xs font-inter tracking-widest transition-all uppercase whitespace-nowrap ${activeLevel3Id === child.collection_id ? 'text-white' : 'text-[#cccccc] hover:text-white'}`}
                >
                  {child.collection_name}
                </Link>
              ))}

              {/* Column 3: Level 3 Children */}
              <AnimatePresence mode='wait'>
                {activeLevel3 && activeLevel3.children && activeLevel3.children.length > 0 && (
                  <div className='absolute left-full top-0 h-full'>
                    <div className='absolute -left-2 top-0 w-2 h-[800px] bg-transparent z-0' />
                    <motion.div
                      key={activeLevel3.collection_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="relative ml-0 flex flex-col gap-3 bg-[#111111]/95 backdrop-blur-md shadow-2xl border-t-[3px] border-t-t1-red p-5 min-w-[200px] z-10"
                    >
                      {activeLevel3.children.map(gChild => (
                        <Link
                          key={gChild.collection_id}
                          to={`/shop/collection/${gChild.collection_slug}`}
                          className='block text-xs font-inter tracking-widest text-[#cccccc] hover:text-white transition-all uppercase whitespace-nowrap'
                        >
                          {gChild.collection_name}
                        </Link>
                      ))}
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
  const { collections, loading } = useCollections()
  // const { t } = useLanguage()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const currentSub = searchParams.get('sub')
  const isSubActive = (slug: string) => location.pathname === '/legacy' && currentSub === slug

  const legacyCollection = useMemo(() =>
    collections.find(c => c.collection_slug === 'legacy'),
    [collections])

  if (loading || !legacyCollection) return null

  return (
    <div className='w-64 bg-[#111111]/95 backdrop-blur-md shadow-2xl border-t-[3px] border-t-t1-red p-5 flex flex-col gap-3'>
      {legacyCollection.children?.map(child => (
        <Link
          key={child.collection_id}
          to={`/legacy?sub=${child.collection_slug}`}
          className={`block text-xs font-inter tracking-widest hover:text-white transition-all ${isSubActive(child.collection_slug) ? 'text-white' : 'text-[#cccccc]'}`}
        >
          {child.collection_name}
        </Link>
      ))}
    </div>
  )
}

const CommunityContent = () => {
  const { t } = useLanguage()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const currentTab = searchParams.get('tab')

  const isTabActive = (tab: string) => location.pathname === '/community' && currentTab === tab

  return (
    <div className='w-40 bg-[#111111]/95 backdrop-blur-md shadow-2xl border-t-[3px] border-t-t1-red p-5 flex flex-col gap-3'>
      <Link to="/community?tab=NOTICE" className={`block text-xs font-inter tracking-widest hover:text-white transition-all ${isTabActive('NOTICE') ? 'text-white' : 'text-[#cccccc]'}`}>{t('nav.notice')}</Link>
      <Link to="/community?tab=REVIEW" className={`block text-xs font-inter tracking-widest hover:text-white transition-all ${isTabActive('REVIEW') ? 'text-white' : 'text-[#cccccc]'}`}>{t('nav.review')}</Link>
      <Link to="/community?tab=EVENT" className={`block text-xs font-inter tracking-widest hover:text-white transition-all ${isTabActive('EVENT') ? 'text-white' : 'text-[#cccccc]'}`}>{t('nav.event')}</Link>
      <Link to="/community?tab=QA" className={`block text-xs font-inter tracking-widest hover:text-white transition-all ${isTabActive('QA') ? 'text-white' : 'text-[#cccccc]'}`}>{t('nav.qa')}</Link>
    </div>
  )
}
