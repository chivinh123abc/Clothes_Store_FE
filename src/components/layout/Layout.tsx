import { useState } from 'react'
import type { ReactNode } from 'react'
import Banner from '~/components/Banner/Banner'
import Navbar from '~/components/Navbar/Navbar'
import NavModal from '~/components/Modals/NavModal/NavModal'

interface LayoutProps {
  children: ReactNode
  footer?: ReactNode
  bleed?: boolean
}

/**
 * Shared layout wrapper for all pages.
 */
function Layout({ children, footer, bleed = false }: LayoutProps) {
  const [openNav, setOpenNav] = useState(false)

  return (
    <div className='bg-t1-dark min-h-screen text-t1-text font-t1-body selection:bg-t1-red selection:text-white'>
      <Banner />
      <Navbar setOpenNav={setOpenNav} />
      <NavModal open={openNav} onClose={() => setOpenNav(false)}>{null}</NavModal>

      {/* Push content below the fixed Banner + Navbar unless 'bleed' is active */}
      <div className={bleed ? '' : 'pt-[102px]'}>
        {children}
      </div>

      {footer}
    </div>
  )
}

export default Layout
