/* eslint-disable indent */
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Users, LogOut, ChevronRight,
  Layers, Grid, Package, Percent, Sun, Moon
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '~/hooks/useAuth'
import NotificationDropdown from '~/components/Navbar/NotificationDropdown'
import { useAdminTheme } from '~/contexts/AdminThemeContext'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout, user } = useAuth()
  const { theme, themeMode, toggleTheme } = useAdminTheme()
  const location = useLocation()

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <ShoppingBag size={20} />, label: 'Products', path: '/admin/products' },
    { icon: <Layers size={20} />, label: 'Categories', path: '/admin/categories' },
    { icon: <Grid size={20} />, label: 'Collections', path: '/admin/collections' },
    { icon: <Package size={20} />, label: 'Orders', path: '/admin/orders' },
    { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
    { icon: <Percent size={20} />, label: 'Discounts', path: '/admin/discounts' }
  ]

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${theme.getBgClass()}`}>
      {/* Sidebar */}
      <aside className={`w-64 flex flex-col fixed inset-y-0 z-50 transition-colors duration-300 ${theme.getSidebarBgClass()}`}>
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-t1-red flex items-center justify-center font-oswald font-black italic text-xl text-white">T1</div>
            <span className={`font-oswald font-black italic tracking-tighter text-xl uppercase ${theme.getTextClass()}`}>Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? theme.getMenuActiveBtnClass()
                    : theme.getMenuInactiveBtnClass()
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-oswald font-bold tracking-widest uppercase text-xs">{item.label}</span>
                </div>
                {isActive && <motion.div layoutId="active-indicator"><ChevronRight size={14} /></motion.div>}
              </Link>
            )
          })}
        </nav>

        <div className={`p-6 border-t space-y-4 transition-colors duration-300 ${theme.getBorderClass()}`}>
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-t1-red to-red-900 flex items-center justify-center font-bold text-white shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: `center ${user.avatar.split('?position=')[1] || '50'}%` }}
                />
              ) : (
                user?.username?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className={`text-sm font-bold truncate ${theme.getTextClass()}`}>{user?.username}</p>
              <p className={`text-[10px] uppercase tracking-widest font-oswald ${theme.getTextMutedClass()}`}>Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 ${
              themeMode === 'light'
                ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-t1-red border border-gray-200'
                : 'bg-white/5 text-gray-400 hover:bg-red-900/20 hover:text-t1-red'
            }`}
          >
            <LogOut size={18} />
            <span className="font-oswald font-bold tracking-widest uppercase text-xs">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <header className={`h-20 border-b flex items-center justify-between px-10 sticky top-0 z-40 transition-colors duration-300 ${theme.getHeaderBgClass()}`}>
          <h2 className={`font-oswald font-black italic text-2xl uppercase tracking-tight ${theme.getTextClass()}`}>
            {menuItems.find(i => i.path === location.pathname)?.label || 'Admin'}
          </h2>
          
          <div className="flex items-center gap-6">
            {/* Theme Toggle Button using Factory Method */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg border transition-all duration-300 ${
                themeMode === 'light'
                  ? 'border-gray-200 hover:bg-gray-100 text-gray-700'
                  : 'border-white/5 hover:bg-white/5 text-gray-300'
              }`}
              title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {themeMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <NotificationDropdown />
            
            <div className={`h-4 w-px transition-colors duration-300 ${theme.getBorderClass()}`} />
            
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-oswald tracking-[0.3em] uppercase ${theme.getTextMutedClass()}`}>Status: Live</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </header>

        <section className="p-10">
          {children}
        </section>
      </main>
    </div>
  )
}

export default AdminLayout
