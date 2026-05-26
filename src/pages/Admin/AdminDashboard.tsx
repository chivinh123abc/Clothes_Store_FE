import { useState, useEffect } from 'react'
import {
  ShoppingBag, TrendingUp, Users, DollarSign, Layers,
  Grid, Loader2, ArrowRight, Sparkles, AlertCircle, ShoppingCart
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { orderApi } from '~/apis/orderApi'
import productApi from '~/apis/productApi'
import type { Product } from '~/types/product'
import { userApi } from '~/apis/userApi'
import { formatPrice } from '~/utils/format'
import { useLanguage } from '~/contexts/LanguageContext'
import { useAdminTheme } from '~/contexts/AdminThemeContext'

interface Order {
  order_id: number
  user_id: number
  total_amount: any
  status: string
  payment_method: string
  payment_status: string
  user_name?: string
  user_email?: string
  created_at: string
}

interface UserDto {
  user_id: number
  username: string
  email: string
  role: string | number
}

const STATUS_BADGES = {
  pending: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
  paid: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
  shipping: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
  completed: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
  cancelled: 'text-rose-500 border-rose-500/20 bg-rose-500/5'
}

const STATUS_LABELS = {
  pending: { en: 'Pending', vi: 'Chờ xử lý' },
  paid: { en: 'Paid', vi: 'Đã thanh toán' },
  shipping: { en: 'Shipping', vi: 'Đang giao' },
  completed: { en: 'Completed', vi: 'Hoàn thành' },
  cancelled: { en: 'Cancelled', vi: 'Đã hủy' }
}

const AdminDashboard = () => {
  const { language } = useLanguage()
  const { theme, themeMode } = useAdminTheme()
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [ordersData, productsRes, usersData] = await Promise.all([
          orderApi.getAllOrders(),
          productApi.getAll(),
          userApi.getUsers()
        ])
        setOrders(ordersData || [])
        setProducts(productsRes.data || [])
        setUsers(usersData || [])
      } catch (err: any) {
        console.error('Error fetching admin dashboard data:', err)
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard statistics.')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  // Calculate metrics
  const totalProducts = products.length
  const totalUsers = users.length
  const totalOrders = orders.length

  // Total revenue is the sum of paid orders
  const totalRevenue = orders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + parseFloat(o.total_amount || '0'), 0)

  // Recent 5 sales
  const recentSales = orders.slice(0, 5)

  // Generate last 7 days of sales for chart
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]

    const dayOrders = orders.filter(o => o.created_at?.split('T')[0] === dateStr)
    const revenue = dayOrders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + parseFloat(o.total_amount || '0'), 0)

    return {
      dateLabel: d.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'short', day: 'numeric' }),
      revenue,
      orderCount: dayOrders.length
    }
  })

  // SVG Chart Calculations
  const maxRevenue = Math.max(...last7DaysData.map(d => d.revenue), 100)
  const chartWidth = 500
  const chartHeight = 200
  const paddingX = 40
  const paddingY = 30
  const plotWidth = chartWidth - paddingX * 2
  const plotHeight = chartHeight - paddingY * 2

  const points = last7DaysData.map((d, i) => {
    const x = paddingX + (i / 6) * plotWidth
    const y = chartHeight - paddingY - (d.revenue / maxRevenue) * plotHeight
    return { x, y, val: d.revenue, label: d.dateLabel, count: d.orderCount }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : ''

  const stats = [
    { label: language === 'vi' ? 'Tổng sản phẩm' : 'Total Products', value: totalProducts, icon: <ShoppingBag className="text-blue-500" />, change: '+5%', link: '/admin/products' },
    { label: language === 'vi' ? 'Tổng doanh thu' : 'Total Revenue', value: formatPrice(totalRevenue, language), icon: <DollarSign className="text-green-500" />, change: '+12%', link: '/admin/orders' },
    { label: language === 'vi' ? 'Người dùng active' : 'Active Users', value: totalUsers, icon: <Users className="text-purple-500" />, change: '+8%', link: '/admin/users' },
    { label: language === 'vi' ? 'Tổng đơn hàng' : 'Total Orders', value: totalOrders, icon: <ShoppingCart className="text-orange-500" />, change: '+15%', link: '/admin/orders' }
  ]

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-t1-red animate-spin" />
        <p className="font-oswald text-xs tracking-widest text-gray-500 uppercase">
          {language === 'vi' ? 'ĐANG TẢI DỮ LIỆU DASHBOARD...' : 'LOADING DASHBOARD STATISTICS...'}
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-2xl flex items-center gap-4 text-red-500 max-w-xl mx-auto my-12">
        <AlertCircle size={24} className="shrink-0" />
        <div>
          <h4 className="font-oswald font-black uppercase text-sm tracking-wider">Error Loading Statistics</h4>
          <p className="text-xs text-gray-400 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link to={stat.link} key={stat.label}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl transition-all duration-300 relative group cursor-pointer overflow-hidden ${theme.getCardBgClass()}`}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-t1-red transition-all duration-300" />
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl transition-colors ${themeMode === 'light' ? 'bg-gray-100 group-hover:bg-gray-200' : 'bg-white/5 group-hover:bg-white/10'}`}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-oswald font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className={`font-oswald text-xs uppercase tracking-widest mb-1 group-hover:text-t1-red transition-colors ${theme.getTextMutedClass()}`}>{stat.label}</p>
              <p className={`font-oswald font-black text-2xl italic tracking-tight group-hover:text-t1-red transition-colors ${theme.getTextClass()}`}>{stat.value}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/products" className="group">
          <div className={`p-8 rounded-2xl group-hover:border-t1-red/30 transition-all duration-300 relative overflow-hidden ${theme.getCardBgClass()}`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-t1-red/5 rounded-full blur-2xl group-hover:bg-t1-red/10 transition-all" />
            <ShoppingBag className="text-gray-500 group-hover:text-t1-red mb-4 transition-colors" size={32} />
            <h4 className={`font-oswald font-black text-xl uppercase tracking-tight ${theme.getTextClass()}`}>
              {language === 'vi' ? 'Sản phẩm' : 'Products'}
            </h4>
            <p className={`text-xs mt-1 uppercase tracking-widest font-oswald ${theme.getTextMutedClass()}`}>
              {language === 'vi' ? 'Quản lý kho & Biến thể' : 'Manage inventory & variants'}
            </p>
          </div>
        </Link>
        <Link to="/admin/categories" className="group">
          <div className={`p-8 rounded-2xl group-hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden ${theme.getCardBgClass()}`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
            <Layers className="text-gray-500 group-hover:text-blue-500 mb-4 transition-colors" size={32} />
            <h4 className={`font-oswald font-black text-xl uppercase tracking-tight ${theme.getTextClass()}`}>
              {language === 'vi' ? 'Danh mục' : 'Categories'}
            </h4>
            <p className={`text-xs mt-1 uppercase tracking-widest font-oswald ${theme.getTextMutedClass()}`}>
              {language === 'vi' ? 'Tổ chức phân loại sản phẩm' : 'Organize product types'}
            </p>
          </div>
        </Link>
        <Link to="/admin/collections" className="group">
          <div className={`p-8 rounded-2xl group-hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden ${theme.getCardBgClass()}`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
            <Grid className="text-gray-500 group-hover:text-purple-500 mb-4 transition-colors" size={32} />
            <h4 className={`font-oswald font-black text-xl uppercase tracking-tight ${theme.getTextClass()}`}>
              {language === 'vi' ? 'Bộ sưu tập' : 'Collections'}
            </h4>
            <p className={`text-xs mt-1 uppercase tracking-widest font-oswald ${theme.getTextMutedClass()}`}>
              {language === 'vi' ? 'Nhóm sản phẩm chiến dịch' : 'Handle hierarchical grouping'}
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Activity / Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales Panel */}
        <div className={`rounded-2xl p-8 flex flex-col justify-between ${theme.getCardBgClass()}`}>
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-oswald font-black italic text-xl uppercase tracking-tight flex items-center gap-2 ${theme.getTextClass()}`}>
                <Sparkles size={18} className="text-t1-red" />
                {language === 'vi' ? 'Đơn hàng vừa qua' : 'Recent Sales'}
              </h3>
              <Link to="/admin/orders" className="text-xs font-oswald font-bold tracking-widest text-t1-red hover:text-white uppercase transition-colors flex items-center gap-1.5">
                {language === 'vi' ? 'Xem tất cả' : 'View All'} <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-4">
              {recentSales.length === 0 ? (
                <div className={`text-center py-12 font-oswald text-xs tracking-widest uppercase ${theme.getTextMutedClass()}`}>
                  {language === 'vi' ? 'CHƯA CÓ ĐƠN HÀNG NÀO' : 'NO GIVEN SALES YET'}
                </div>
              ) : (
                recentSales.map((order) => {
                  const badgeColor = STATUS_BADGES[order.status as keyof typeof STATUS_BADGES] || 'text-gray-500 border-white/10 bg-white/5'
                  const badgeLabel = STATUS_LABELS[order.status as keyof typeof STATUS_LABELS]?.[language as 'vi' | 'en'] || order.status

                  return (
                    <div key={order.order_id} className={`flex items-center justify-between py-3.5 border-b last:border-0 px-2 transition-all ${theme.getBorderClass()} ${theme.getHoverBgClass()}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-oswald font-black ${themeMode === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-white/5 text-gray-400'}`}>
                          {order.user_name ? order.user_name.substring(0, 2).toUpperCase() : 'US'}
                        </div>
                        <div>
                          <p className={`text-sm font-bold transition-colors ${theme.getTextClass()} group-hover:text-t1-red`}>
                            {order.user_name || order.user_email || 'Customer'}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-oswald uppercase tracking-widest ${theme.getTextMutedClass()}`}>
                              #T1-000{order.order_id}
                            </span>
                            <span className={`text-[8px] font-oswald font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${badgeColor}`}>
                              {badgeLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-t1-red">{formatPrice(parseFloat(order.total_amount || '0'), language)}</p>
                        <p className={`text-[9px] font-oswald uppercase tracking-widest mt-0.5 ${theme.getTextMutedClass()}`}>
                          {new Date(order.created_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Analytics Chart Panel */}
        <div className={`rounded-2xl p-8 flex flex-col justify-between min-h-[400px] ${theme.getCardBgClass()}`}>
          <div>
            <h3 className={`font-oswald font-black italic text-xl uppercase mb-6 tracking-tight flex items-center gap-2 ${theme.getTextClass()}`}>
              <TrendingUp size={18} className="text-t1-red" />
              {language === 'vi' ? 'Doanh Thu 7 Ngày Qua' : '7-Day Revenue Analytics'}
            </h3>

            <div className="relative mt-8">
              {/* Custom SVG Line Chart */}
              <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e2012d" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#e2012d" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                  const y = paddingY + ratio * plotHeight
                  const gridVal = maxRevenue * (1 - ratio)
                  return (
                    <g key={index} className="opacity-20">
                      <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke={themeMode === 'light' ? '#000' : '#fff'} strokeWidth="0.5" strokeDasharray="4" />
                      <text x={paddingX - 10} y={y + 3} textAnchor="end" className={`font-oswald text-[9px] font-bold ${themeMode === 'light' ? 'fill-gray-600' : 'fill-gray-400'}`}>
                        {gridVal >= 1000 ? `$${(gridVal / 1000).toFixed(1)}k` : `$${Math.round(gridVal)}`}
                      </text>
                    </g>
                  )
                })}

                {/* Gradient area under line */}
                {areaPath && (
                  <path d={areaPath} fill="url(#chartGradient)" />
                )}

                {/* Main line path */}
                {linePath && (
                  <motion.path
                    d={linePath}
                    fill="none"
                    stroke="#e2012d"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />
                )}

                {/* Plot points */}
                {points.map((p, i) => (
                  <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={hoveredPoint === i ? 6 : 4}
                      className={`${themeMode === 'light' ? 'fill-white' : 'fill-[#0a0a0a]'} stroke-t1-red`}
                      strokeWidth={hoveredPoint === i ? 3 : 2}
                    />
                    {hoveredPoint === i && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={12}
                        className="fill-t1-red/10 stroke-none animate-ping"
                      />
                    )}
                  </g>
                ))}

                {/* X Axis Labels */}
                {points.map((p, i) => (
                  <text
                    key={i}
                    x={p.x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    className={`font-oswald text-[9px] tracking-wider uppercase font-bold ${themeMode === 'light' ? 'fill-gray-600' : 'fill-gray-400'}`}
                  >
                    {p.label.split(',')[0]}
                  </text>
                ))}
              </svg>

              {/* Tooltip Overlay */}
              <AnimatePresence>
                {hoveredPoint !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute border p-3 rounded-lg shadow-2xl z-20 pointer-events-none text-left ${
                      themeMode === 'light'
                        ? 'bg-white border-gray-200 text-gray-900 shadow-md'
                        : 'bg-black/95 border-t1-red/30 text-white shadow-2xl'
                    }`}
                    style={{
                      left: `${(points[hoveredPoint].x / chartWidth) * 90}%`,
                      top: `${(points[hoveredPoint].y / chartHeight) * 55}%`
                    }}
                  >
                    <p className="font-oswald text-[9px] text-gray-500 uppercase tracking-widest font-bold">
                      {points[hoveredPoint].label}
                    </p>
                    <p className="font-oswald font-black text-sm text-t1-red mt-1">
                      {formatPrice(points[hoveredPoint].val, language)}
                    </p>
                    <p className={`text-[9px] mt-0.5 ${themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {points[hoveredPoint].count} {language === 'vi' ? 'đơn hàng' : 'orders'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className={`pt-4 border-t flex justify-between text-[10px] font-oswald tracking-widest uppercase ${theme.getBorderClass()} ${theme.getTextMutedClass()}`}>
            <span>{language === 'vi' ? 'HOẠT ĐỘNG: LIVE' : 'STATUS: LIVE'}</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {language === 'vi' ? 'DỮ LIỆU THỰC TẾ' : 'REAL-TIME DATA'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
