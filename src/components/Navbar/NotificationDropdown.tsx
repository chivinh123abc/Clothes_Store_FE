import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Trash2, CheckCircle, ShoppingBag, X, Info, Check } from 'lucide-react'
import { useNotifications } from '~/contexts/NotificationContext'
import { useLanguage } from '~/contexts/LanguageContext'

const formatTimeAgo = (dateString: string, lang: 'vi' | 'en') => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) {
    return lang === 'vi' ? 'Vừa xong' : 'Just now'
  }
  if (diffMins < 60) {
    return lang === 'vi' ? `${diffMins} phút trước` : `${diffMins}m ago`
  }
  if (diffHours < 24) {
    return lang === 'vi' ? `${diffHours} giờ trước` : `${diffHours}h ago`
  }
  return lang === 'vi' ? `${diffDays} ngày trước` : `${diffDays}d ago`
}

export default function NotificationDropdown() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotifications()

  const { language } = useLanguage()
  const lang = (language === 'vi' ? 'vi' : 'en') as 'vi' | 'en'
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id)
    setIsOpen(false)
    if (link) {
      navigate(link)
    }
  }

  // Swinging animation variants for the bell icon when there are unread notifications
  const bellVariants = {
    shake: {
      rotate: [0, -15, 12, -10, 8, -4, 4, -2, 2, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatDelay: 4
      }
    },
    idle: { rotate: 0 }
  }

  return (
    <div className="relative font-inter" ref={dropdownRef}>
      {/* Bell Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-white/5 transition-all text-white flex items-center justify-center cursor-pointer outline-none"
        animate={unreadCount > 0 ? 'shake' : 'idle'}
        variants={bellVariants}
        title={lang === 'vi' ? 'Thông báo' : 'Notifications'}
      >
        <Bell size={20} className={unreadCount > 0 ? 'text-t1-red' : 'text-white'} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-t1-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-t1-red text-[9px] font-bold font-inter text-white items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </motion.button>

      {/* Dropdown Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#111111]/95 border border-white/10 shadow-2xl rounded-xl overflow-hidden z-[9999] backdrop-blur-[25px]"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
              <span className="font-oswald font-black text-sm uppercase tracking-wider text-white">
                {lang === 'vi' ? 'THÔNG BÁO' : 'NOTIFICATIONS'}
              </span>
              <div className="flex gap-3 text-xs">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllAsRead}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                      title={lang === 'vi' ? 'Đánh dấu tất cả đã đọc' : 'Mark all as read'}
                    >
                      <Check size={14} />
                      <span className="hidden sm:inline">{lang === 'vi' ? 'Đã đọc' : 'Read all'}</span>
                    </button>
                    <span className="text-white/10">|</span>
                    <button
                      onClick={clearAll}
                      className="text-gray-400 hover:text-t1-red transition-colors flex items-center gap-1 cursor-pointer"
                      title={lang === 'vi' ? 'Xóa tất cả' : 'Clear all'}
                    >
                      <Trash2 size={13} />
                      <span className="hidden sm:inline">{lang === 'vi' ? 'Xóa hết' : 'Clear'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-[360px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center text-gray-500">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3">
                    <Bell size={20} className="text-gray-600" />
                  </div>
                  <p className="font-oswald uppercase text-xs tracking-wider text-gray-400">
                    {lang === 'vi' ? 'Không có thông báo mới' : 'No notifications yet'}
                  </p>
                  <p className="text-[11px] text-gray-600 font-light italic mt-1">
                    {lang === 'vi' ? 'Mọi hoạt động đơn hàng sẽ hiển thị ở đây.' : 'All order updates will show up here.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((item) => {
                    const isUnread = !item.read

                    // Icon selector based on type
                    let TypeIcon = Info
                    let iconColor = 'text-blue-500 bg-blue-500/10'
                    if (item.type === 'order_placed') {
                      TypeIcon = ShoppingBag
                      iconColor = 'text-t1-red bg-t1-red/10'
                    } else if (item.type === 'order_received') {
                      TypeIcon = ShoppingBag
                      iconColor = 'text-emerald-500 bg-emerald-500/10'
                    } else if (item.type === 'success') {
                      TypeIcon = CheckCircle
                      iconColor = 'text-green-500 bg-green-500/10'
                    }

                    return (
                      <div
                        key={item.id}
                        className={`group relative flex gap-3.5 p-4 transition-all duration-200 hover:bg-white/[0.02] ${
                          isUnread ? 'bg-t1-red/[0.02] border-l-2 border-t1-red' : 'border-l-2 border-transparent'
                        }`}
                      >
                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center ${iconColor}`}>
                          <TypeIcon size={18} />
                        </div>

                        {/* Text */}
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => handleNotificationClick(item.id, item.link)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-xs font-bold truncate ${isUnread ? 'text-white font-semibold' : 'text-gray-300'}`}>
                              {item.title[lang]}
                            </p>
                            <span className="text-[9px] text-gray-500 shrink-0 uppercase font-mono tracking-tighter">
                              {formatTimeAgo(item.createdAt, lang)}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {item.message[lang]}
                          </p>
                        </div>

                        {/* Right elements: unread dot & delete btn */}
                        <div className="flex flex-col items-center justify-center shrink-0 w-5">
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-t1-red shadow-[0_0_8px_#e2012d] group-hover:scale-0 transition-transform duration-200" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(item.id)
                            }}
                            className="text-gray-600 hover:text-t1-red p-1 rounded transition-colors scale-0 group-hover:scale-100 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer bg-[#111111]/80"
                            title={lang === 'vi' ? 'Xóa thông báo' : 'Delete notification'}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-2 text-center bg-black/20 border-t border-white/5">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-1.5 text-[10px] font-oswald font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'vi' ? 'ĐÓNG BẢNG THÔNG BÁO' : 'CLOSE NOTIFICATIONS'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
