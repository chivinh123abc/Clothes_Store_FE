import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  Truck,
  CheckCircle,
  MapPin,
  Phone,
  User,
  Info,
  Lock,
  ArrowRight,
  ShoppingBag
} from 'lucide-react'
import { useCart } from '~/contexts/CartContext'
import { useAuth } from '~/hooks/useAuth'
import { useToast } from '~/contexts/ToastContext'
import { useNotifications } from '~/contexts/NotificationContext'
import { useLanguage } from '~/contexts/LanguageContext'
import { formatPrice } from '~/utils/format'
import { orderApi } from '~/apis/orderApi'
import productApi from '~/apis/productApi'
import Layout from '~/components/layout/Layout'
import Footer from '~/components/layout/Footer'

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const { addNotification } = useNotifications()
  const { language, t } = useLanguage()
  const navigate = useNavigate()

  // Form states prefilled with user info
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [comment, setComment] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'momo'>('cod')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null)

  // Populate data when user context is loaded
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || user.display_name || user.username || '')
      setPhoneNumber(user.phone_number || '')
      setShippingAddress(user.address || '')
    }
  }, [user])

  // Redirect if cart is empty and order hasn't been placed successfully
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      const timer = setTimeout(() => {
        navigate('/shop')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [items, orderSuccess, navigate])

  const subtotal = totalPrice
  const shippingFee = subtotal > 100 ? 0 : 5.0
  const finalTotal = subtotal + shippingFee

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      showToast('Please sign in to place an order.', 'error')
      return
    }

    if (!fullName.trim()) {
      showToast('Full name is required.', 'error')
      return
    }
    if (!phoneNumber.trim()) {
      showToast('Phone number is required.', 'error')
      return
    }
    if (!shippingAddress.trim()) {
      showToast('Shipping address is required.', 'error')
      return
    }
    if (comment.trim() && comment.trim().length < 5) {
      showToast('Order notes must be at least 5 characters long.', 'error')
      return
    }

    let createdOrderId: number | null = null
    try {
      setIsSubmitting(true)

      // 1. Create the parent order
      const orderPayload = {
        user_id: user.user_id,
        total_amount: finalTotal,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'momo' ? 'unpaid' : 'unpaid',
        comment: (comment.trim() || `Deliver to: ${fullName} - Phone: ${phoneNumber} - Address: ${shippingAddress}`).substring(0, 255)
      }

      const newOrder = await orderApi.createOrder(orderPayload)
      createdOrderId = newOrder.order_id

      // Notify the customer and admin immediately about the new order creation (regardless of MoMo or COD)
      addNotification(
        user.user_id,
        {
          en: paymentMethod === 'momo' ? 'Order Initialized' : 'Order Placed!',
          vi: paymentMethod === 'momo' ? 'Đơn hàng được khởi tạo' : 'Đặt hàng thành công!'
        },
        {
          en: paymentMethod === 'momo'
            ? `Your order #T1-000${newOrder.order_id} has been created. Awaiting payment via MoMo.`
            : `Your order #T1-000${newOrder.order_id} has been placed successfully via Cash On Delivery.`,
          vi: paymentMethod === 'momo'
            ? `Đơn hàng #T1-000${newOrder.order_id} của bạn đã được khởi tạo. Đang chờ thanh toán qua ví MoMo.`
            : `Đơn hàng #T1-000${newOrder.order_id} của bạn đã được đặt thành công bằng hình thức COD.`
        },
        'order_placed',
        '/my-page'
      )

      addNotification(
        'admin',
        {
          en: paymentMethod === 'momo' ? 'New MoMo Order Created' : 'New COD Order',
          vi: paymentMethod === 'momo' ? 'Đơn hàng MoMo mới được tạo' : 'Đơn hàng COD mới'
        },
        {
          en: paymentMethod === 'momo'
            ? `New order #T1-000${newOrder.order_id} received from ${fullName} for $${finalTotal.toFixed(2)} (Awaiting payment).`
            : `New COD order #T1-000${newOrder.order_id} received from ${fullName} for $${finalTotal.toFixed(2)}.`,
          vi: paymentMethod === 'momo'
            ? `Đơn hàng MoMo mới #T1-000${newOrder.order_id} từ ${fullName} trị giá $${finalTotal.toFixed(2)} (Đang chờ thanh toán).`
            : `Đơn hàng COD mới #T1-000${newOrder.order_id} từ ${fullName} trị giá $${finalTotal.toFixed(2)}.`
        },
        'order_received',
        '/admin/orders'
      )

      // 2. Create the child order items
      // For each item in the cart, resolve its product_item_id
      const itemPromises = items.map(async (cartItem) => {
        try {
          const prodResponse = await productApi.getById(cartItem.id)
          const productData = prodResponse.data
          // Find item with matching size
          const matchedVariant = productData.items?.find((v: any) => v.size?.toUpperCase() === cartItem.size?.toUpperCase())
          const productItemId = matchedVariant?.product_item_id || productData.items?.[0]?.product_item_id

          if (!productItemId) {
            throw new Error(`Could not find a valid variant for product: ${cartItem.name}`)
          }

          return orderApi.createOrderItem({
            order_id: newOrder.order_id,
            product_item_id: productItemId,
            quantity: cartItem.quantity
          })
        } catch (err) {
          // Fallback if API fails or item variant is not found
          // eslint-disable-next-line no-console
          console.error('Failed to create order item:', err)
          throw err
        }
      })

      await Promise.all(itemPromises)

      clearCart()

      // 3. Branch based on payment method
      if (paymentMethod === 'momo') {
        // Redirect to MoMo Sandbox payment gateway
        const res = await orderApi.createMoMoPayment(newOrder.order_id, finalTotal)
        if (res.payUrl) {
          const extraData = btoa(newOrder.order_id.toString())
          const testSuccessUrl = `http://localhost:5173/checkout/momo-return?resultCode=0&extraData=${extraData}`
          // eslint-disable-next-line no-console
          console.log('%c[MOMO TEST URL] 👇\n' + testSuccessUrl, 'color: #e2012d; font-weight: bold; font-size: 14px;')
          window.location.href = res.payUrl
          return
        }
      }
      // COD: go to success screen
      setOrderSuccess({
        order_id: newOrder.order_id,
        items: [...items],
        total: finalTotal,
        paymentMethod
      })

      showToast('Order placed successfully!', 'success')
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error placing order:', error)
      showToast(error.response?.data?.message || 'Failed to place order. Please try again.', 'error')

      // Clean up parent order if it was successfully created but items failed to save (e.g. out of stock)
      if (createdOrderId) {
        try {
          await orderApi.deleteOrder(createdOrderId)
        } catch (cleanupErr) {
          // eslint-disable-next-line no-console
          console.error('Failed to clean up orphaned order:', cleanupErr)
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render empty cart warning if no items
  if (items.length === 0 && !orderSuccess) {
    return (
      <Layout footer={<Footer />}>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center text-white px-4 pt-24">
          <div className="w-20 h-20 bg-t1-gray/10 rounded-full flex items-center justify-center mb-6 border border-t1-gray/20">
            <ShoppingBag size={36} className="text-t1-red" />
          </div>
          <h2 className="text-4xl font-oswald font-black uppercase italic mb-4 tracking-tighter">Your Cart Is Empty</h2>
          <p className="text-gray-400 font-light italic mb-8">Redirecting you to the shop in a few seconds...</p>
          <button
            onClick={() => navigate('/shop')}
            className="py-3 px-8 bg-t1-red text-white font-oswald font-bold tracking-[0.2em] uppercase hover:bg-[#ff0033] transition-all"
          >
            {t('productDetail.backToShop')}
          </button>
        </div>
      </Layout>
    )
  }

  // Render Order Success State
  if (orderSuccess) {
    return (
      <Layout footer={<Footer />} bleed={true}>
        <div className="min-h-[85vh] flex items-center justify-center pt-32 pb-24 px-4 bg-gradient-to-b from-black via-t1-red/5 to-black">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full bg-[#111111] border border-t1-red/30 p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-t1-red via-red-500 to-t1-red" />

            <div className="flex flex-col items-center text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30 text-green-500 mb-6"
              >
                <CheckCircle size={44} strokeWidth={1.5} />
              </motion.div>
              <h1 className="text-4xl font-oswald font-black uppercase italic text-white tracking-tighter mb-2">
                ORDER PLACED SUCCESSFULLY!
              </h1>
              <p className="text-gray-400 font-light text-sm italic">
                Thank you for your order. We are preparing to dispatch your champions gear.
              </p>
            </div>

            <div className="border-t border-b border-t1-gray/20 py-6 mb-8 grid grid-cols-2 gap-4 text-sm font-inter">
              <div>
                <span className="text-xs text-gray-500 block uppercase font-semibold">ORDER ID</span>
                <span className="text-white font-oswald font-bold text-lg tracking-wider">#T1-000{orderSuccess.order_id}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block uppercase font-semibold">PAYMENT METHOD</span>
                <span className="text-white font-oswald font-bold text-base tracking-wider uppercase">
                  {orderSuccess.paymentMethod === 'cod' ? 'Cash On Delivery' : orderSuccess.paymentMethod === 'bank' ? 'Bank Transfer' : 'Credit Card'}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-oswald font-bold text-sm tracking-widest text-gray-400 uppercase mb-4">ITEMS PURCHASED</h3>
              <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-2">
                {orderSuccess.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-t1-gray/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-t1-gray/10 border border-t1-gray/20 overflow-hidden shrink-0">
                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <span className="text-white font-medium line-clamp-1">{item.name}</span>
                        <span className="text-xs text-gray-500">Size: {item.size} × {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-t1-red font-semibold">{formatPrice(item.price * item.quantity, language)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-t1-gray/20 pt-6 mb-10">
              <span className="text-sm font-inter text-gray-400 font-bold uppercase tracking-wider">TOTAL AMOUNT</span>
              <span className="text-3xl font-oswald font-black text-t1-red italic tracking-wide">{formatPrice(orderSuccess.total, language)}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/my-page')}
                className="flex-1 py-4 bg-transparent border-2 border-t1-gray/40 text-white font-oswald font-bold tracking-[0.2em] uppercase hover:border-white transition-colors"
              >
                VIEW MY ORDERS
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="flex-1 py-4 bg-t1-red hover:bg-[#ff0033] text-white font-oswald font-bold tracking-[0.2em] uppercase shadow-lg shadow-t1-red/20 transition-all"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </motion.div>
        </div>
      </Layout>
    )
  }



  return (
    <Layout footer={<Footer />} bleed={true}>
      <div className="min-h-screen pt-32 pb-24 px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-oswald font-black uppercase italic mb-4 tracking-tighter text-white">
          CHECKOUT
        </h1>
        <p className="text-gray-400 font-light italic mb-12 border-b border-t1-gray/20 pb-6 flex items-center gap-2">
          <Lock size={14} className="text-t1-red" /> Secure, premium checkout experience.
        </p>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form & Payment */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {/* Shipping Info */}
            <div className="bg-[#111111] border border-t1-gray/20 p-6 md:p-8 relative">
              <h2 className="text-2xl font-oswald font-black uppercase italic text-white tracking-widest mb-6 flex items-center gap-3">
                <Truck className="text-t1-red" size={22} /> SHIPPING DETAILS
              </h2>

              <div className="flex flex-col gap-6 font-inter text-sm">
                <div>
                  <label className="text-xs font-bold text-gray-400 tracking-wider uppercase block mb-2">FULL NAME *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Receiver name"
                      className="w-full bg-transparent border border-t1-gray/40 focus:border-t1-red h-12 pl-12 pr-4 text-white placeholder-gray-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 tracking-wider uppercase block mb-2">PHONE NUMBER *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Receiver phone number"
                      className="w-full bg-transparent border border-t1-gray/40 focus:border-t1-red h-12 pl-12 pr-4 text-white placeholder-gray-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 tracking-wider uppercase block mb-2">SHIPPING ADDRESS *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-gray-500" size={16} />
                    <textarea
                      required
                      rows={3}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Street address, City, Country"
                      className="w-full bg-transparent border border-t1-gray/40 focus:border-t1-red p-4 pl-12 text-white placeholder-gray-600 outline-none transition-colors resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 tracking-wider uppercase block mb-2">ORDER NOTES (OPTIONAL)</label>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="E.g., Special instructions for delivery"
                    className="w-full bg-transparent border border-t1-gray/40 focus:border-t1-red p-4 text-white placeholder-gray-600 outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#111111] border border-t1-gray/20 p-6 md:p-8">
              <h2 className="text-2xl font-oswald font-black uppercase italic text-white tracking-widest mb-6 flex items-center gap-3">
                <CreditCard className="text-t1-red" size={22} /> PAYMENT METHOD
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-oswald text-xs tracking-widest uppercase">
                {/* COD Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`border p-5 text-center flex flex-col items-center gap-3 transition-all duration-300 ${paymentMethod === 'cod'
                      ? 'border-t1-red bg-t1-red/5 text-white shadow-[0_0_15px_rgba(226,1,45,0.15)]'
                      : 'border-t1-gray/30 text-gray-500 hover:border-white hover:text-white'
                    }`}
                >
                  <Truck size={24} className={paymentMethod === 'cod' ? 'text-t1-red animate-pulse' : 'text-gray-500'} />
                  <span>CASH ON DELIVERY</span>
                </button>

                {/* MoMo Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`border p-5 text-center flex flex-col items-center gap-3 transition-all duration-300 ${paymentMethod === 'momo'
                      ? 'border-[#A50064] bg-[#A50064]/10 text-white shadow-[0_0_15px_rgba(165,0,100,0.3)]'
                      : 'border-t1-gray/30 text-gray-500 hover:border-white hover:text-white'
                    }`}
                >
                  <span className="text-xl">💳</span>
                  <span>MOMO E-WALLET</span>
                </button>
              </div>

              {/* Payment Method Details */}
              <AnimatePresence mode="wait">
                {paymentMethod === 'momo' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6 p-5 border border-[#A50064]/30 bg-[#A50064]/5 text-sm font-inter italic text-gray-300 leading-relaxed rounded"
                  >
                    <p className="font-bold text-[#A50064] mb-2 not-italic flex items-center gap-2 text-base">
                      💳 MOMO SANDBOX PAYMENT
                    </p>
                    <p>After clicking <strong className="text-white not-italic">PLACE ORDER</strong>, you will be securely redirected to the MoMo gateway.</p>
                    <p className="mt-2 text-xs text-gray-400">Your order will be processed immediately upon successful payment verification.</p>
                  </motion.div>
                )}

                {paymentMethod === 'cod' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6 p-5 border border-t1-gray/20 bg-black/40 text-sm font-inter italic text-gray-400"
                  >
                    <p className="flex items-center gap-2 text-white font-bold mb-1 not-italic">
                      <Info size={16} className="text-t1-red" /> CASH ON DELIVERY SELECTED
                    </p>
                    <p>Pay cash straight to the shipper upon receipt of your Champions gear. Highly recommended and secure.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-[#111111] border border-t1-gray/20 p-6 md:p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl font-oswald font-black uppercase italic text-white tracking-widest border-b border-t1-gray/20 pb-4 flex items-center gap-3">
              <ShoppingBag className="text-t1-red" size={22} /> ORDER SUMMARY
            </h2>

            {/* Cart Items List */}
            <div className="flex flex-col gap-6 max-h-[350px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-t1-gray/50">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 items-center border-b border-t1-gray/10 pb-4">
                  <div className="w-16 h-20 bg-t1-gray/10 border border-t1-gray/20 overflow-hidden shrink-0">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-oswald font-bold text-white uppercase line-clamp-1 block">{item.name}</span>
                    <span className="text-xs text-gray-500 font-inter">SIZE: {item.size}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm text-gray-400 block font-light font-inter">Qty: {item.quantity}</span>
                    <span className="text-sm font-oswald font-bold text-t1-red tracking-wide">{formatPrice(item.price * item.quantity, language)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Fee Calculations */}
            <div className="flex flex-col gap-3 font-inter text-sm border-t border-t1-gray/20 pt-6">
              <div className="flex justify-between items-center text-gray-500">
                <span>SUBTOTAL</span>
                <span className="text-white font-medium">{formatPrice(subtotal, language)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500">
                <span>SHIPPING FEE</span>
                <span className="text-white font-medium">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee, language)}</span>
              </div>

              <div className="flex justify-between items-end border-t border-t1-gray/20 pt-6 mt-4">
                <span className="text-base font-bold text-white uppercase tracking-wider">TOTAL DUE</span>
                <span className="text-3xl font-oswald font-black text-t1-red italic tracking-wide">{formatPrice(finalTotal, language)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-4 bg-t1-red hover:bg-[#ff0033] disabled:bg-t1-gray/40 disabled:cursor-not-allowed text-white font-oswald font-black text-sm tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(226,1,45,0.3)] hover:shadow-[0_0_35px_rgba(226,1,45,0.6)] transition-all duration-300 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  PROCESSING ORDER...
                </>
              ) : (
                <>
                  PLACE ORDER <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
