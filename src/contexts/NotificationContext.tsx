import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../hooks/useAuth'
import { orderApi } from '../apis/orderApi'

export interface NotificationItem {
  id: string
  userId: number | string // 'admin' for seller/admin, or customer's userId
  title: { en: string; vi: string }
  message: { en: string; vi: string }
  type: 'order_placed' | 'order_received' | 'info' | 'success'
  link?: string
  read: boolean
  createdAt: string
}

interface NotificationContextType {
  notifications: NotificationItem[]
  unreadCount: number
  // eslint-disable-next-line no-unused-vars
  addNotification: (
    userId: number | string | 'admin',
    title: { en: string; vi: string },
    message: { en: string; vi: string },
    type: 'order_placed' | 'order_received' | 'info' | 'success',
    link?: string
  ) => void
  // eslint-disable-next-line no-unused-vars
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  // eslint-disable-next-line no-unused-vars
  deleteNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = useAuth()
  const user = authContext?.user || null
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>([])

  // Load all notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('t1_notifications')
    if (stored) {
      try {
        setAllNotifications(JSON.parse(stored))
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse notifications from localStorage', e)
      }
    }
  }, [])

  // Sync with other tabs using storage event listener (keeps duplicate local-storage in sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 't1_notifications') {
        if (e.newValue) {
          try {
            setAllNotifications(JSON.parse(e.newValue))
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to parse notifications storage change', err)
          }
        } else {
          setAllNotifications([])
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Filter notifications for active user
  // If active user is Admin (role === 1), show notifications for 'admin'
  // Else show notifications specifically for their user_id
  const notifications = allNotifications.filter((n) => {
    if (!user) return false
    if (Number(user.role) === 1) {
      return n.userId === 'admin'
    } else {
      return String(n.userId) === String(user.user_id)
    }
  })

  // Unread count
  const unreadCount = notifications.filter((n) => !n.read).length

  // Add a new notification (can be triggered locally by anyone, and will be saved globally)
  const addNotification = useCallback((
    userId: number | string | 'admin',
    title: { en: string; vi: string },
    message: { en: string; vi: string },
    type: 'order_placed' | 'order_received' | 'info' | 'success',
    link?: string
  ) => {
    const newNotif: NotificationItem = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      title,
      message,
      type,
      link,
      read: false,
      createdAt: new Date().toISOString()
    }

    const stored = localStorage.getItem('t1_notifications')
    let current: NotificationItem[] = []
    if (stored) {
      try {
        current = JSON.parse(stored)
      } catch (e) {
        // Ignore
      }
    }
    const updated = [newNotif, ...current]
    localStorage.setItem('t1_notifications', JSON.stringify(updated))
    setAllNotifications(updated)
  }, [])

  // Mark a single notification as read
  const markAsRead = useCallback((id: string) => {
    const stored = localStorage.getItem('t1_notifications')
    let current: NotificationItem[] = []
    if (stored) {
      try {
        current = JSON.parse(stored)
      } catch (e) {
        // Ignore
      }
    }
    const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n))
    localStorage.setItem('t1_notifications', JSON.stringify(updated))
    setAllNotifications(updated)
  }, [])

  // Mark all notifications for the active user as read
  const markAllAsRead = useCallback(() => {
    if (!user) return
    const activeUserId = Number(user.role) === 1 ? 'admin' : String(user.user_id)
    const stored = localStorage.getItem('t1_notifications')
    let current: NotificationItem[] = []
    if (stored) {
      try {
        current = JSON.parse(stored)
      } catch (e) {
        // Ignore
      }
    }
    const updated = current.map((n) =>
      String(n.userId) === String(activeUserId) ? { ...n, read: true } : n
    )
    localStorage.setItem('t1_notifications', JSON.stringify(updated))
    setAllNotifications(updated)
  }, [user])

  // Delete a single notification
  const deleteNotification = useCallback((id: string) => {
    const stored = localStorage.getItem('t1_notifications')
    let current: NotificationItem[] = []
    if (stored) {
      try {
        current = JSON.parse(stored)
      } catch (e) {
        // Ignore
      }
    }
    const updated = current.filter((n) => n.id !== id)
    localStorage.setItem('t1_notifications', JSON.stringify(updated))
    setAllNotifications(updated)
  }, [])

  // Clear all notifications for the active user
  const clearAll = useCallback(() => {
    if (!user) return
    const activeUserId = Number(user.role) === 1 ? 'admin' : String(user.user_id)
    const stored = localStorage.getItem('t1_notifications')
    let current: NotificationItem[] = []
    if (stored) {
      try {
        current = JSON.parse(stored)
      } catch (e) {
        // Ignore
      }
    }
    const updated = current.filter((n) => String(n.userId) !== String(activeUserId))
    localStorage.setItem('t1_notifications', JSON.stringify(updated))
    setAllNotifications(updated)
  }, [user])

  // Real-time Event Integration via Socket.io
  useEffect(() => {
    if (!user) return

    // Dynamically derive Backend Server origin from VITE_API_URL
    const apiURL = import.meta.env.VITE_API_URL as string || 'http://localhost:3000'
    const socketURL = apiURL.split('/api')[0]

    // Create the persistent Socket connection
    const socket = io(socketURL, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    })

    // Register into the appropriate real-time room upon connection
    socket.on('connect', () => {
      // eslint-disable-next-line no-console
      console.log('⚡ [SOCKET.IO] Connected to backend server:', socketURL)
      
      if (Number(user.role) === 1) {
        socket.emit('join_room', 'admin')
        // eslint-disable-next-line no-console
        console.log('⚡ [SOCKET.IO] Joined room: admin')
      } else {
        socket.emit('join_room', `user_${user.user_id}`)
        // eslint-disable-next-line no-console
        console.log(`⚡ [SOCKET.IO] Joined room: user_${user.user_id}`)
      }
    })

    // Listen to admin events (new orders created anywhere)
    if (Number(user.role) === 1) {
      socket.on('new_order', (orderData: any) => {
        const orderId = Number(orderData.order_id)
        const buyerName = orderData.user_name || orderData.user_email || 'Customer'
        const amount = parseFloat(orderData.total_amount || '0')
        const method = orderData.payment_method || 'COD'

        addNotification(
          'admin',
          {
            en: method.toLowerCase() === 'momo' ? 'New MoMo Order' : 'New COD Order',
            vi: method.toLowerCase() === 'momo' ? 'Đơn hàng MoMo mới' : 'Đơn hàng COD mới'
          },
          {
            en: `New order #T1-000${orderId} received from ${buyerName} for $${amount.toFixed(2)}.`,
            vi: `Đơn hàng mới #T1-000${orderId} từ ${buyerName} trị giá $${amount.toFixed(2)}.`
          },
          'order_received',
          '/admin/orders'
        )
      })
    }

    // Listen to customer events (status changes updated by admin)
    socket.on('order_status_updated', (data: any) => {
      const orderId = Number(data.order_id)
      const currentStatus = data.status?.toLowerCase()
      const buyerId = Number(user.user_id)

      if (currentStatus === 'shipping') {
        addNotification(
          buyerId,
          { en: 'Order Shipped!', vi: 'Đơn hàng đang giao!' },
          {
            en: `Your order #T1-000${orderId} has been dispatched and is on its way.`,
            vi: `Đơn hàng #T1-000${orderId} của bạn đã được gửi đi và đang trên đường giao đến bạn.`
          },
          'info',
          '/my-page'
        )
      } else if (currentStatus === 'completed') {
        addNotification(
          buyerId,
          { en: 'Order Completed!', vi: 'Đơn hàng hoàn tất!' },
          {
            en: `Your order #T1-000${orderId} has been successfully completed. Thank you!`,
            vi: `Đơn hàng #T1-000${orderId} của bạn đã hoàn thành xuất sắc. Cảm ơn bạn!`
          },
          'success',
          '/my-page'
        )
      } else if (currentStatus === 'cancelled') {
        addNotification(
          buyerId,
          { en: 'Order Cancelled', vi: 'Đơn hàng đã hủy' },
          {
            en: `Your order #T1-000${orderId} has been cancelled.`,
            vi: `Đơn hàng #T1-000${orderId} của bạn đã bị hủy.`
          },
          'info',
          '/my-page'
        )
      } else if (currentStatus === 'paid') {
        addNotification(
          buyerId,
          { en: 'Payment Confirmed!', vi: 'Xác nhận thanh toán!' },
          {
            en: `Your payment for order #T1-000${orderId} has been successfully verified.`,
            vi: `Thanh toán cho đơn hàng #T1-000${orderId} của bạn đã được xác nhận thành công.`
          },
          'success',
          '/my-page'
        )
      }
    })

    socket.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log('⚡ [SOCKET.IO] Disconnected from backend server.')
    })

    return () => {
      socket.disconnect()
    }
  }, [user, addNotification])

  // Bulletproof DB Polling Fallback (Cooperates with Socket.io in real-time across Chrome, Edge, and other devices)
  useEffect(() => {
    if (!user) return

    let isMounted = true
    const intervalTime = 7000 // Poll every 7 seconds

    const pollDatabaseUpdates = async () => {
      try {
        if (Number(user.role) === 1) {
          // Admin: Poll all orders to detect new ones in the database
          const dbOrders = await orderApi.getAllOrders()
          if (!isMounted || !dbOrders) return

          // Read notified order IDs from localStorage to prevent duplicate alerts
          const notifiedStored = localStorage.getItem('t1_notified_orders_admin')
          const isFirstTime = !notifiedStored
          const notifiedSet = new Set<number>(notifiedStored ? JSON.parse(notifiedStored) : [])

          let newOrdersFound = false
          dbOrders.forEach((order: any) => {
            const orderId = Number(order.order_id)
            if (!notifiedSet.has(orderId)) {
              if (!isFirstTime) {
                // Trigger real-time alert for genuine new orders
                const buyerName = order.user_name || order.user_email || 'Customer'
                const amount = parseFloat(order.total_amount || '0')
                const method = order.payment_method || 'COD'
                
                addNotification(
                  'admin',
                  {
                    en: method.toLowerCase() === 'momo' ? 'New MoMo Order' : 'New COD Order',
                    vi: method.toLowerCase() === 'momo' ? 'Đơn hàng MoMo mới' : 'Đơn hàng COD mới'
                  },
                  {
                    en: `New order #T1-000${orderId} received from ${buyerName} for $${amount.toFixed(2)}.`,
                    vi: `Đơn hàng mới #T1-000${orderId} từ ${buyerName} trị giá $${amount.toFixed(2)}.`
                  },
                  'order_received',
                  '/admin/orders'
                )
              }
              notifiedSet.add(orderId)
              newOrdersFound = true
            }
          })

          if (isFirstTime || newOrdersFound) {
            localStorage.setItem('t1_notified_orders_admin', JSON.stringify(Array.from(notifiedSet)))
          }
        } else {
          // Customer: Poll their own orders to catch status updates from Admin
          const buyerId = Number(user.user_id)
          const dbOrders = await orderApi.getOrdersByUserId(buyerId)
          if (!isMounted || !dbOrders) return

          // Read last seen order statuses from localStorage to prevent duplicate alerts
          const lastStatusesStored = localStorage.getItem(`t1_order_statuses_${buyerId}`)
          const isFirstTime = !lastStatusesStored
          const lastStatuses = lastStatusesStored ? JSON.parse(lastStatusesStored) : {}

          let statusesUpdated = false
          dbOrders.forEach((order: any) => {
            const orderId = Number(order.order_id)
            const currentStatus = order.status?.toLowerCase()

            if (!isFirstTime && lastStatuses[orderId] && lastStatuses[orderId] !== currentStatus) {
              // Trigger real-time status change alerts for Customer
              if (currentStatus === 'shipping') {
                addNotification(
                  buyerId,
                  { en: 'Order Shipped!', vi: 'Đơn hàng đang giao!' },
                  {
                    en: `Your order #T1-000${orderId} has been dispatched and is on its way.`,
                    vi: `Đơn hàng #T1-000${orderId} của bạn đã được gửi đi và đang trên đường giao đến bạn.`
                  },
                  'info',
                  '/my-page'
                )
                statusesUpdated = true
              } else if (currentStatus === 'completed') {
                addNotification(
                  buyerId,
                  { en: 'Order Completed!', vi: 'Đơn hàng hoàn tất!' },
                  {
                    en: `Your order #T1-000${orderId} has been successfully completed. Thank you!`,
                    vi: `Đơn hàng #T1-000${orderId} của bạn đã hoàn thành xuất sắc. Cảm ơn bạn!`
                  },
                  'success',
                  '/my-page'
                )
                statusesUpdated = true
              } else if (currentStatus === 'cancelled') {
                addNotification(
                  buyerId,
                  { en: 'Order Cancelled', vi: 'Đơn hàng đã hủy' },
                  {
                    en: `Your order #T1-000${orderId} has been cancelled.`,
                    vi: `Đơn hàng #T1-000${orderId} của bạn đã bị hủy.`
                  },
                  'info',
                  '/my-page'
                )
                statusesUpdated = true
              } else if (currentStatus === 'paid') {
                addNotification(
                  buyerId,
                  { en: 'Payment Confirmed!', vi: 'Xác nhận thanh toán!' },
                  {
                    en: `Your payment for order #T1-000${orderId} has been successfully verified.`,
                    vi: `Thanh toán cho đơn hàng #T1-000${orderId} của bạn đã được xác nhận thành công.`
                  },
                  'success',
                  '/my-page'
                )
                statusesUpdated = true
              }
            }

            if (lastStatuses[orderId] !== currentStatus) {
              lastStatuses[orderId] = currentStatus
              statusesUpdated = true
            }
          })

          if (isFirstTime || statusesUpdated) {
            localStorage.setItem(`t1_order_statuses_${buyerId}`, JSON.stringify(lastStatuses))
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Database live syncing polling error fallback:', err)
      }
    }

    // Initialize immediately then query periodically
    pollDatabaseUpdates()
    const timer = setInterval(pollDatabaseUpdates, intervalTime)

    return () => {
      isMounted = false
      clearInterval(timer)
    }
  }, [user, addNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
