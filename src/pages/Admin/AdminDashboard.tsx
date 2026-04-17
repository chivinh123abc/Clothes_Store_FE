import { ShoppingBag, TrendingUp, Users, DollarSign, Layers, Grid } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Products', value: '48', icon: <ShoppingBag className="text-blue-500" />, change: '+5%' },
    { label: 'Total Revenue', value: '$12,450', icon: <DollarSign className="text-green-500" />, change: '+12%' },
    { label: 'Active Users', value: '1,240', icon: <Users className="text-purple-500" />, change: '+8%' },
    { label: 'Sales Velocity', value: '14/hr', icon: <TrendingUp className="text-orange-500" />, change: '+2%' }
  ]

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/5 rounded-xl">
                {stat.icon}
              </div>
              <span className="text-[10px] font-oswald font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="font-oswald text-xs text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="font-oswald font-black text-3xl italic tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/products" className="group">
          <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl group-hover:border-t1-red/50 transition-all duration-300">
            <ShoppingBag className="text-gray-500 group-hover:text-t1-red mb-4 transition-colors" size={32} />
            <h4 className="font-oswald font-black text-xl uppercase tracking-tight">Products</h4>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-oswald">Manage inventory & variants</p>
          </div>
        </Link>
        <Link to="/admin/categories" className="group">
          <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl group-hover:border-blue-500/50 transition-all duration-300">
            <Layers className="text-gray-500 group-hover:text-blue-500 mb-4 transition-colors" size={32} />
            <h4 className="font-oswald font-black text-xl uppercase tracking-tight">Categories</h4>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-oswald">Organize product types</p>
          </div>
        </Link>
        <Link to="/admin/collections" className="group">
          <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl group-hover:border-purple-500/50 transition-all duration-300">
            <Grid className="text-gray-500 group-hover:text-purple-500 mb-4 transition-colors" size={32} />
            <h4 className="font-oswald font-black text-xl uppercase tracking-tight">Collections</h4>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-oswald">Handle hierarchical grouping</p>
          </div>
        </Link>
      </div>

      {/* Recent Activity / Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
          <h3 className="font-oswald font-black italic text-xl uppercase mb-6 tracking-tight">Recent Sales</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-lg overflow-hidden">
                    <img
                      src={'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=100'}
                      className="w-full h-full object-cover"
                      alt="Product"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Essential Hoodie</p>
                    <p className="text-[10px] text-gray-500 font-oswald uppercase tracking-widest">Order #TX-105{i}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-t1-red">$89.99</p>
                  <p className="text-[10px] text-gray-500 font-oswald uppercase tracking-widest">2 mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <TrendingUp size={48} className="text-gray-800 mx-auto mb-4" />
            <p className="font-oswald font-bold text-gray-600 uppercase tracking-widest">Analytics Dashboard Coming Soon</p>
            <p className="text-xs text-gray-700 mt-2 italic">Real-time data visualization in progress</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
