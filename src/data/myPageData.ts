import { CheckCircle, Clock, TrendingUp, XCircle } from 'lucide-react'


export const STATUS_CONFIG = {
  pending: {
    label: { en: 'Pending', vi: 'Chờ xử lý' },
    color: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
    icon: Clock
  },
  paid: {
    label: { en: 'Paid', vi: 'Đã thanh toán' },
    color: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    icon: CheckCircle
  },
  shipping: {
    label: { en: 'Shipping', vi: 'Đang giao hàng' },
    color: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    icon: TrendingUp
  },
  completed: {
    label: { en: 'Completed', vi: 'Đã hoàn thành' },
    color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
    icon: CheckCircle
  },
  cancelled: {
    label: { en: 'Cancelled', vi: 'Đã hủy đơn' },
    color: 'text-rose-500 border-rose-500/30 bg-rose-500/10',
    icon: XCircle
  }
}
