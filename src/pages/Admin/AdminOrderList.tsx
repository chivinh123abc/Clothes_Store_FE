import React, { useEffect, useState, useCallback } from 'react'
import {
  Package,
  Search,
  Filter,
  Trash2,
  Eye,
  Calendar,
  User,
  Mail,
  DollarSign,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowUpCircle
} from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { orderApi } from '../../apis/orderApi'
import { useToast } from '../../contexts/ToastContext'
import { useNotifications } from '../../contexts/NotificationContext'
import OrderDetailsModal from './OrderDetailsModal'
import ConfirmModal from '../../components/ui/ConfirmModal'

interface Order {
  order_id: number
  user_id: number
  order_date: string
  total_amount: number
  status: string
  payment_method: string
  payment_status: string
  user_name?: string
  user_email?: string
  created_at: string
}

const AdminOrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPayment, setFilterPayment] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null)
  const { showToast } = useToast()
  const { addNotification } = useNotifications()

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const data = await orderApi.getAllOrders()
      setOrders(data)
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message
      showToast(`Failed to fetch orders: ${errorMsg}`, 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await orderApi.updateOrderStatus(id, newStatus)
      showToast(`Order status updated to ${newStatus}`, 'success')

      // Notify the buyer of their order status change
      const order = orders.find(o => o.order_id === id)
      if (order) {
        const buyerId = order.user_id
        if (newStatus === 'shipping') {
          addNotification(
            buyerId,
            { en: 'Order Shipped!', vi: 'Đơn hàng đang giao!' },
            {
              en: `Your order #T1-000${id} has been dispatched and is on its way.`,
              vi: `Đơn hàng #T1-000${id} của bạn đã được gửi đi và đang trên đường giao đến bạn.`
            },
            'info',
            '/my-page'
          )
        } else if (newStatus === 'completed') {
          addNotification(
            buyerId,
            { en: 'Order Completed!', vi: 'Đơn hàng hoàn tất!' },
            {
              en: `Your order #T1-000${id} has been successfully completed. Thank you!`,
              vi: `Đơn hàng #T1-000${id} của bạn đã hoàn thành xuất sắc. Cảm ơn bạn!`
            },
            'success',
            '/my-page'
          )
        } else if (newStatus === 'cancelled') {
          addNotification(
            buyerId,
            { en: 'Order Cancelled', vi: 'Đơn hàng đã hủy' },
            {
              en: `Your order #T1-000${id} has been cancelled.`,
              vi: `Đơn hàng #T1-000${id} của bạn đã bị hủy.`
            },
            'info',
            '/my-page'
          )
        }
      }

      fetchOrders()
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message
      showToast(`Failed to update order status: ${errorMsg}`, 'error')
    }
  }

  const handleUpdatePaymentStatus = async (id: number, newPaymentStatus: string) => {
    try {
      await orderApi.updateOrderStatus(id, undefined, newPaymentStatus)
      showToast(`Payment status updated to ${newPaymentStatus}`, 'success')

      // Notify the buyer of payment verification
      const order = orders.find(o => o.order_id === id)
      if (order && newPaymentStatus === 'paid') {
        addNotification(
          order.user_id,
          { en: 'Payment Confirmed!', vi: 'Xác nhận thanh toán!' },
          {
            en: `Your payment for order #T1-000${id} has been successfully verified.`,
            vi: `Thanh toán cho đơn hàng #T1-000${id} của bạn đã được xác nhận thành công.`
          },
          'success',
          '/my-page'
        )
      }

      fetchOrders()
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message
      showToast(`Failed to update payment status: ${errorMsg}`, 'error')
    }
  }

  const handleDeleteOrder = async (id: number) => {
    try {
      await orderApi.deleteOrder(id)
      showToast('Order deleted successfully', 'success')
      fetchOrders()
    } catch (error: any) {
      showToast('Failed to delete order', 'error')
    }
  }

  const handleViewDetails = async (id: number) => {
    try {
      setDetailsLoading(true)
      const data = await orderApi.getOrderDetails(id)
      setSelectedOrder(data)
    } catch (error: any) {
      showToast('Failed to fetch order details', 'error')
    } finally {
      setDetailsLoading(false)
    }
  }

  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.order_id.toString().includes(searchTerm) ||
        order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user_email?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase()
      const matchesPayment = filterPayment === 'all' || order.payment_status?.toLowerCase() === filterPayment.toLowerCase()

      return matchesSearch && matchesStatus && matchesPayment
    })
  }, [orders, searchTerm, filterStatus, filterPayment])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/10'
      case 'pending': return 'text-amber-400 bg-amber-400/10'
      case 'paid': return 'text-blue-300 bg-blue-300/10'
      case 'shipping': return 'text-blue-400 bg-blue-400/10'
      case 'cancelled': return 'text-rose-400 bg-rose-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getNextStatus = (currentStatus: string): string | null => {
    const status = currentStatus.toLowerCase()
    if (status === 'pending' || status === 'paid') {
      return 'shipping'
    }
    if (status === 'shipping') {
      return 'completed'
    }
    return null
  }

  return (
    <div className="space-y-8">
      {detailsLoading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-t1-red border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={orderToDelete !== null}
        title="Delete Order"
        message="Are you sure you want to PERMANENTLY delete this order? This action cannot be undone."
        confirmText="Delete Order"
        onConfirm={() => orderToDelete && handleDeleteOrder(orderToDelete)}
        onClose={() => setOrderToDelete(null)}
        type="danger"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-oswald uppercase tracking-wider text-white flex items-center gap-3">
            <Package className="text-t1-red" size={32} />
            Order Management
          </h1>
          <p className="text-gray-400 mt-1 font-oswald text-xs uppercase tracking-[0.2em]">Monitor and manage customer transactions</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-4 h-12 flex items-center bg-white/[0.03] border border-white/5 rounded-xl px-4 gap-3 group focus-within:border-t1-red/50 transition-all">
            <Search className="text-gray-500 group-focus-within:text-t1-red transition-colors shrink-0" size={18} />
            <input
              autoComplete="off"
              type="text"
              placeholder="Search by Order ID, Customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white focus:outline-none text-sm placeholder:text-gray-600"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Delivery Status */}
          <div className="flex-1 overflow-x-auto scrollbar-none bg-white/[0.03] border border-white/5 rounded-xl p-1">
            <div className="grid grid-cols-6 min-w-[600px] w-full gap-1">
              {['all', 'pending', 'paid', 'shipping', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`w-full py-2 px-1 rounded-lg font-oswald text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap text-center ${filterStatus === status
                    ? 'bg-t1-red text-white shadow-lg shadow-t1-red/20'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Status */}
          <div className="md:w-64 bg-white/[0.03] border border-white/5 rounded-xl p-1">
            <div className="grid grid-cols-3 w-full gap-1">
              {['all', 'paid', 'unpaid'].map((pStatus) => (
                <button
                  key={pStatus}
                  onClick={() => setFilterPayment(pStatus)}
                  className={`w-full py-2 px-1 rounded-lg font-oswald text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap text-center ${filterPayment === pStatus
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {pStatus}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-5 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500">Order ID</th>
                <th className="px-6 py-5 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500">Customer</th>
                <th className="px-6 py-5 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500">Date</th>
                <th className="px-6 py-5 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500">Total</th>
                <th className="px-6 py-5 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500">Payment</th>
                <th className="px-6 py-5 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500">Status</th>
                <th className="px-6 py-5 font-oswald text-[10px] uppercase tracking-[0.2em] text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-8">
                      <div className="h-4 bg-white/5 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.order_id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-oswald text-sm font-bold text-white">#{order.order_id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white flex items-center gap-2">
                          <User size={12} className="text-gray-600" />
                          {order.user_name || 'Guest'}
                        </span>
                        <span className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                          <Mail size={12} className="text-gray-600" />
                          {order.user_email || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-300 flex items-center gap-2">
                          <Calendar size={12} className="text-gray-600" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-[11px] text-gray-500 mt-0.5">
                          {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-oswald font-bold text-t1-red flex items-center gap-1">
                        <DollarSign size={14} />
                        {Number(order.total_amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {/* Method */}
                        <div className="flex items-center gap-2">
                          {order.payment_method?.toLowerCase() === 'cod' ? (
                            <DollarSign size={14} className="text-amber-500" />
                          ) : (
                            <CreditCard size={14} className="text-cyan-400" />
                          )}
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${order.payment_method?.toLowerCase() === 'cod' ? 'text-amber-500' : 'text-cyan-400'}`}>
                            {order.payment_method || 'COD'}
                          </span>
                        </div>
                        {/* Status Toggle */}
                        <button
                          onClick={() => handleUpdatePaymentStatus(order.order_id, order.payment_status === 'paid' ? 'unpaid' : 'paid')}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all ${order.payment_status === 'paid'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {order.payment_status === 'paid' ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          <span className="text-[9px] font-bold uppercase tracking-widest">
                            {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="relative w-[135px] group/select">
                          <select
                            value={order.status.toLowerCase()}
                            onChange={(e) => handleUpdateStatus(order.order_id, e.target.value)}
                            className={`w-full appearance-none pl-4 pr-8 py-1.5 rounded-full text-[10px] font-oswald font-bold uppercase tracking-wider border border-white/10 outline-none cursor-pointer transition-all hover:border-white/30 focus:border-t1-red/50 ${getStatusColor(order.status)}`}
                          >
                            <option value="pending" className="bg-[#111] text-amber-400">PENDING</option>
                            <option
                              value="paid"
                              disabled={order.payment_method?.toLowerCase() === 'cod'}
                              className={`bg-[#111] ${order.payment_method?.toLowerCase() === 'cod' ? 'text-gray-600' : 'text-blue-300'}`}
                            >
                              PAID {order.payment_method?.toLowerCase() === 'cod' ? '(N/A for COD)' : ''}
                            </option>
                            <option value="shipping" className="bg-[#111] text-blue-400">SHIPPING</option>
                            <option value="completed" className="bg-[#111] text-emerald-400">COMPLETED</option>
                            <option value="cancelled" className="bg-[#111] text-rose-400">CANCELLED</option>
                          </select>
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                            <Filter size={10} />
                          </div>
                        </div>

                        {/* Quick Upgrade Level Up Button */}
                        {getNextStatus(order.status) ? (
                          <button
                            onClick={() => handleUpdateStatus(order.order_id, getNextStatus(order.status)!)}
                            className="p-2 bg-t1-red/10 text-t1-red hover:bg-t1-red hover:text-white rounded-full border border-t1-red/30 hover:border-t1-red transition-all cursor-pointer flex items-center justify-center group/btn shrink-0"
                            title={`Upgrade status to ${getNextStatus(order.status)?.toUpperCase()}`}
                          >
                            <ArrowUpCircle size={14} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        ) : (
                          <div className="w-[30px] h-[30px] shrink-0" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(order.order_id)}
                          className="p-2 text-gray-400 hover:bg-white/5 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setOrderToDelete(order.order_id)}
                          className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Filter size={48} />
                      <p className="font-oswald uppercase tracking-widest text-sm">No orders found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderList
