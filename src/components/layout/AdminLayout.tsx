/* eslint-disable indent */
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, PlusCircle, Users, Settings, LogOut, ChevronRight, Layers, Grid } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '~/hooks/useAuth'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout, user } = useAuth()
  const location = useLocation()

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <ShoppingBag size={20} />, label: 'Products', path: '/admin/products' },
    { icon: <Layers size={20} />, label: 'Categories', path: '/admin/categories' },
    { icon: <Grid size={20} />, label: 'Collections', path: '/admin/collections' },
    { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' }
  ]

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-t1-red flex items-center justify-center font-oswald font-black italic text-xl">T1</div>
            <span className="font-oswald font-black italic tracking-tighter text-xl uppercase">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                  ? 'bg-t1-red text-white'
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
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

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-t1-red to-red-900 flex items-center justify-center font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.username}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-oswald">Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white/5 text-gray-400 hover:bg-red-900/20 hover:text-t1-red transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="font-oswald font-bold tracking-widest uppercase text-xs">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-[#050505]/80 backdrop-blur-md z-40">
          <h2 className="font-oswald font-black italic text-2xl uppercase tracking-tight">
            {menuItems.find(i => i.path === location.pathname)?.label || 'Admin'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-oswald text-gray-500 tracking-[0.3em] uppercase">Status: Live</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
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
