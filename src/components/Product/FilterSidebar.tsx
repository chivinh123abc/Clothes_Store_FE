/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

interface FilterSidebarProps {
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  maxPrice: number
  isOpen: boolean
  onClose: () => void
}

const SHOP_MENU = [
  { label: 'ALL', path: '/shop' },
  { label: 'TEAM KIT', path: '/shop/team-kit' },
  {
    label: 'COLLECTION',
    path: '/shop/collection',
    children: [
      {
        label: 'ESSENTIAL', path: '/shop/collection/essential', children: [
          { label: 'GIFT & ACCESSORY', path: '/shop/collection/essential/gift-and-accessory' },
          { label: 'APPAREL', path: '/shop/collection/essential/apparel' }
        ]
      },
      {
        label: 'LEAGUE OF LEGENDS', path: '/shop/collection/league-of-legends', children: [
          { label: 'GIFT & ACCESSORY', path: '/shop/collection/league-of-legends/gift-and-accessory' },
          { label: 'APPAREL', path: '/shop/collection/league-of-legends/apparel' }
        ]
      },
      {
        label: 'VALORANT', path: '/shop/collection/valorant', children: [
          { label: 'GIFT & ACCESSORY', path: '/shop/collection/valorant/gift-and-accessory' },
          { label: 'APPAREL', path: '/shop/collection/valorant/apparel' }
        ]
      }
    ]
  },
  {
    label: 'COLLABORATION',
    path: '/shop/collaboration',
    children: [
      { label: 'DISNEY', path: '/shop/collaboration/disney' },
      { label: 'RINSTORE X GOALSTUDIO', path: '/shop/collaboration/rinstore-x-goalstudio' },
      { label: 'RINSTORE X SECRETLAB', path: '/shop/collaboration/rinstore-x-secretlab' },
      { label: 'RINSTORE X RAZER', path: '/shop/collaboration/rinstore-x-razer' }
    ]
  },
  { label: 'SALE', path: '/shop/sale' }
]

const MenuItem = ({ item, level = 0, onClose }: { item: any, level?: number, onClose: () => void }) => {
  const location = useLocation()
  const isExactActive = location.pathname === item.path
  const isActive = isExactActive || (item.path !== '/shop' && location.pathname.startsWith(item.path))

  const [isOpen, setIsOpen] = useState(isActive)

  React.useEffect(() => {
    if (isActive) setIsOpen(true)
  }, [isActive])

  const hasChildren = item.children && item.children.length > 0

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-2 group cursor-pointer">
        <Link
          to={item.path}
          onClick={() => {
            if (!hasChildren) onClose()
            if (hasChildren && isExactActive) setIsOpen(!isOpen)
            else setIsOpen(true)
          }}
          className={`flex-1 font-inter transition-colors duration-200 block
            ${level === 0 ? 'font-oswald font-bold uppercase tracking-widest text-sm' : 'text-xs uppercase'}
            ${isExactActive ? 'text-t1-red' : isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}
          `}
          style={{ paddingLeft: `${level * 16}px` }}
        >
          {item.label}
        </Link>
        {hasChildren && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(!isOpen) }}
            className="p-1 ml-2"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 hover:text-white ${isExactActive ? 'text-t1-red' : isActive ? 'text-white' : 'text-gray-500'} ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {hasChildren && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col mt-2 mb-2 space-y-1">
                {item.children.map((child: any) => (
                  <MenuItem key={child.label} item={child} level={level + 1} onClose={onClose} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export function FilterSidebar({
  priceRange,
  setPriceRange,
  maxPrice,
  isOpen,
  onClose
}: FilterSidebarProps) {

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange([0, parseInt(e.target.value)])
  }

  const sidebarContent = (
    <div className='flex flex-col h-full bg-t1-dark p-6 text-t1-text select-none'>
      <div className='flex items-center justify-between mb-8 lg:hidden'>
        <h2 className='font-oswald text-2xl font-bold italic uppercase'>Menu</h2>
        <button onClick={onClose} className='p-2 hover:bg-white/10 rounded-full transition-colors'>
          <X className='w-6 h-6' />
        </button>
      </div>

      {/* CATEGORIES MENU */}
      <div className='mb-10'>
        <h3 className='font-oswald text-sm tracking-[0.2em] text-gray-600 uppercase mb-6'>Categories</h3>
        <div className='space-y-1'>
          {SHOP_MENU.map((menu) => (
            <MenuItem key={menu.label} item={menu} onClose={onClose} />
          ))}
        </div>
      </div>

      {/* PRICE RANGE */}
      <div className='mb-10'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='font-oswald text-sm tracking-[0.2em] text-gray-600 uppercase'>Price Range</h3>
          <span className='font-inter text-xs text-t1-red font-bold'>Up to ${priceRange[1]}</span>
        </div>
        <input
          type='range'
          min='0'
          max={maxPrice}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className='w-full h-1 bg-t1-gray rounded-lg appearance-none cursor-pointer accent-t1-red'
        />
        <div className='flex justify-between mt-2'>
          <span className='font-inter text-[10px] text-gray-500'>$0</span>
          <span className='font-inter text-[10px] text-gray-500'>${maxPrice}</span>
        </div>
      </div>

      {/* RESET */}
      <button
        onClick={() => {
          setPriceRange([0, maxPrice])
        }}
        className='mt-auto py-3 border border-white/10 font-oswald text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300'
      >
        Reset Filters
      </button>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className='hidden lg:block w-64 shrink-0 sticky top-32 h-[calc(100vh-160px)] overflow-y-auto pr-6 custom-scrollbar'>
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className='fixed inset-0 z-[100] lg:hidden w-full max-w-xs h-full shadow-2xl shadow-black/50'
      >
        {sidebarContent}
      </motion.div>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] lg:hidden'
        />
      )}
    </>
  )
}
