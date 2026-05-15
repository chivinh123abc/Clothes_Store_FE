import React from 'react'
import { motion } from 'framer-motion'
import { X, Package, User, MapPin, Phone, Mail, Calendar, DollarSign, MessageSquare } from 'lucide-react'

interface OrderItem {
  order_item_id: number
  product_item_id: number
  quantity: number
  price: number
  name: string
  image: string
}

interface OrderDetails {
  order_id: number
  user_id: number
  order_date: string
  total_amount: number
  status: string
  comment?: string
  user_name?: string
  user_email?: string
  full_name?: string
  user_address?: string
  user_phone?: string
  created_at: string
  items: OrderItem[]
}

interface OrderDetailsModalProps {
  order: OrderDetails
  onClose: () => void
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-t1-red/10 flex items-center justify-center text-t1-red">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-oswald font-bold uppercase tracking-tight text-white">Order Details</h2>
              <p className="text-gray-500 font-oswald text-[10px] uppercase tracking-[0.2em]">ID: #{order.order_id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Info */}
            <div className="space-y-6">
              <h3 className="font-oswald text-xs uppercase tracking-[0.2em] text-t1-red font-bold">Customer Information</h3>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-oswald">Full Name</p>
                    <p className="text-sm font-bold text-white">{order.full_name || order.user_name || 'Guest'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-oswald">Email Address</p>
                    <p className="text-sm font-bold text-white">{order.user_email || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-oswald">Phone Number</p>
                    <p className="text-sm font-bold text-white">{order.user_phone || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-oswald">Shipping Address</p>
                    <p className="text-sm font-medium text-white leading-relaxed">{order.user_address || 'No address provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Info */}
            <div className="space-y-6">
              <h3 className="font-oswald text-xs uppercase tracking-[0.2em] text-t1-red font-bold">Order Summary</h3>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-oswald">Order Date</span>
                  </div>
                  <span className="text-sm font-bold text-white">{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package size={16} className="text-gray-500" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-oswald">Status</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-oswald font-bold uppercase tracking-wider ${
                    order.status === 'completed' ? 'text-emerald-400 bg-emerald-400/10' :
                    order.status === 'pending' ? 'text-amber-400 bg-amber-400/10' :
                    order.status === 'shipping' ? 'text-blue-400 bg-blue-400/10' :
                    'text-rose-400 bg-rose-400/10'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign size={16} className="text-t1-red" />
                    <span className="text-sm uppercase tracking-widest text-white font-oswald font-black">Total Amount</span>
                  </div>
                  <span className="text-2xl font-oswald font-black text-t1-red tracking-tight">
                    {Number(order.total_amount).toLocaleString()}
                  </span>
                </div>
              </div>

              {order.comment && (
                <div className="space-y-4">
                  <h3 className="font-oswald text-xs uppercase tracking-[0.2em] text-gray-500 font-bold flex items-center gap-2">
                    <MessageSquare size={14} />
                    Customer Comment
                  </h3>
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 italic text-sm text-gray-400">
                    "{order.comment}"
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-6">
            <h3 className="font-oswald text-xs uppercase tracking-[0.2em] text-t1-red font-bold">Ordered Items ({order.items?.length || 0})</h3>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-oswald uppercase tracking-widest text-gray-500">Product</th>
                    <th className="px-6 py-4 text-[10px] font-oswald uppercase tracking-widest text-gray-500 text-center">Quantity</th>
                    <th className="px-6 py-4 text-[10px] font-oswald uppercase tracking-widest text-gray-500 text-right">Price</th>
                    <th className="px-6 py-4 text-[10px] font-oswald uppercase tracking-widest text-gray-500 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {order.items?.map((item) => (
                    <tr key={item.order_item_id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                          <span className="text-sm font-bold text-white group-hover:text-t1-red transition-colors">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-oswald font-bold text-gray-300">x{item.quantity}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-gray-400">{Number(item.price).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-oswald font-bold text-white">{ (item.price * item.quantity).toLocaleString() }</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-oswald text-xs uppercase tracking-widest text-white transition-all border border-white/5"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default OrderDetailsModal
