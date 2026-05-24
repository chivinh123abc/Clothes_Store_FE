import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react'
import Layout from '~/components/layout/Layout'
import Footer from '~/components/layout/Footer'
import { orderApi } from '~/apis/orderApi'
import { useNotifications } from '~/contexts/NotificationContext'
import { useAuth } from '~/hooks/useAuth'

export default function MoMoReturn() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const { user } = useAuth()
  const confirmedRef = useRef(false)

  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState('')

  const resultCode = searchParams.get('resultCode')
  const extraData = searchParams.get('extraData') // We passed base64 encoded orderId in extraData

  useEffect(() => {
    if (confirmedRef.current) return
    confirmedRef.current = true

    const confirmPayment = async () => {
      try {
        if (resultCode === '0') {
          // Payment successful
          if (extraData) {
            const orderIdStr = atob(extraData)
            const orderId = parseInt(orderIdStr, 10)
            if (!isNaN(orderId)) {
              await orderApi.confirmMoMoPayment(orderId)

              // Fetch details to retrieve final order total for premium notifications
              try {
                const orderData = await orderApi.getOrderDetails(orderId)
                const amount = parseFloat(orderData?.total_amount || '0')
                const userDisplayName = user?.full_name || user?.display_name || user?.username || 'Customer'

                addNotification(
                  user?.user_id || 'unknown',
                  { en: 'Payment Confirmed!', vi: 'Thanh toán thành công!' },
                  {
                    en: `Your payment of $${amount.toFixed(2)} was successfully processed for order #T1-000${orderId}.`,
                    vi: `Thanh toán $${amount.toFixed(2)} cho đơn hàng #T1-000${orderId} đã được xác nhận thành công.`
                  },
                  'success',
                  '/my-page'
                )

                addNotification(
                  'admin',
                  { en: 'MoMo Order Paid', vi: 'Đơn MoMo đã thanh toán' },
                  {
                    en: `Order #T1-000${orderId} has been successfully paid via MoMo by ${userDisplayName} for $${amount.toFixed(2)}.`,
                    vi: `Đơn hàng #T1-000${orderId} trị giá $${amount.toFixed(2)} đã được thanh toán thành công qua MoMo bởi ${userDisplayName}.`
                  },
                  'order_received',
                  '/admin/orders'
                )
              } catch (notifErr) {
                console.error('Notification trigger details fetch failed:', notifErr)
                // Fallback triggers if order details fetch fails
                addNotification(
                  user?.user_id || 'unknown',
                  { en: 'Payment Confirmed!', vi: 'Thanh toán thành công!' },
                  {
                    en: `Your order #T1-000${orderId} has been paid successfully via MoMo.`,
                    vi: `Đơn hàng #T1-000${orderId} của bạn đã thanh toán thành công qua MoMo.`
                  },
                  'success',
                  '/my-page'
                )

                addNotification(
                  'admin',
                  { en: 'MoMo Order Paid', vi: 'Đơn MoMo đã thanh toán' },
                  {
                    en: `Order #T1-000${orderId} has been paid via MoMo.`,
                    vi: `Đơn hàng #T1-000${orderId} đã thanh toán thành công qua MoMo.`
                  },
                  'order_received',
                  '/admin/orders'
                )
              }
            }
          }
          setStatus('success')
        } else {
          // Payment failed or canceled
          setStatus('error')
          setErrorMessage('Payment was canceled or an error occurred.')
        }
      } catch (error) {
        console.error('Error confirming payment:', error)
        setStatus('error')
        setErrorMessage('Failed to verify payment with our servers. Please contact support.')
      }
    }

    confirmPayment()
  }, [resultCode, extraData])

  return (
    <Layout footer={<Footer />} bleed={true}>
      <div className="min-h-[85vh] flex items-center justify-center pt-32 pb-24 px-4 bg-gradient-to-b from-black via-t1-red/5 to-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#111111] border border-t1-red/30 p-8 md:p-12 shadow-2xl relative overflow-hidden text-center"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-t1-red via-red-500 to-t1-red" />

          {status === 'processing' && (
            <div className="flex flex-col items-center">
              <Loader2 size={48} className="text-t1-red animate-spin mb-6" />
              <h2 className="text-2xl font-oswald font-black uppercase italic text-white tracking-tighter mb-2">
                VERIFYING PAYMENT...
              </h2>
              <p className="text-gray-400 font-light text-sm italic">
                Please wait while we confirm your transaction with MoMo.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30 text-green-500 mb-6"
              >
                <CheckCircle size={44} strokeWidth={1.5} />
              </motion.div>
              <h2 className="text-3xl font-oswald font-black uppercase italic text-white tracking-tighter mb-2">
                PAYMENT SUCCESSFUL!
              </h2>
              <p className="text-gray-400 font-light text-sm italic mb-8">
                Your payment has been received. Your order is now being processed.
              </p>
              
              <button
                onClick={() => navigate('/my-page')}
                className="w-full py-4 bg-t1-red hover:bg-[#ff0033] text-white font-oswald font-bold tracking-[0.2em] uppercase shadow-lg shadow-t1-red/20 transition-all flex items-center justify-center gap-2"
              >
                VIEW MY ORDERS <ArrowRight size={18} />
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30 text-red-500 mb-6"
              >
                <XCircle size={44} strokeWidth={1.5} />
              </motion.div>
              <h2 className="text-3xl font-oswald font-black uppercase italic text-white tracking-tighter mb-2">
                PAYMENT FAILED
              </h2>
              <p className="text-gray-400 font-light text-sm italic mb-8">
                {errorMessage}
              </p>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => navigate('/my-page')}
                  className="w-full py-4 bg-t1-red hover:bg-[#ff0033] text-white font-oswald font-bold tracking-[0.2em] uppercase shadow-lg shadow-t1-red/20 transition-all"
                >
                  GO TO ORDERS TO RETRY
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full py-4 bg-transparent border-2 border-t1-gray/40 text-white hover:border-white font-oswald font-bold tracking-[0.2em] uppercase transition-all"
                >
                  RETURN TO SHOP
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </Layout>
  )
}
