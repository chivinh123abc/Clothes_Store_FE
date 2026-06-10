/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react'
import { useAuth } from '~/hooks/useAuth'
import { cartApi } from '~/apis/cartApi'
import { useToast } from '~/contexts/ToastContext'
import { useLanguage } from '~/contexts/LanguageContext'

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  size: string;
  quantity: number;
  originalPrice?: number | null;
}

interface CartContextType {
  items: CartItem[];
  addCartItem: (item: Omit<CartItem, 'quantity'>, quantity?: number, stock?: number) => void;
  removeCartItem: (id: number, size: string) => void;
  incrementQuantity: (id: number, size: string) => void;
  decrementQuantity: (id: number, size: string) => void;
  clearCart: () => void;
  updateCartItemSize: (id: number, oldSize: string, newSize: string, newPrice: number, newOriginalPrice?: number | null, newStock?: number) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()
  const { showToast } = useToast()
  const { language } = useLanguage()

  // Load initial cart from localStorage
  useEffect(() => {
    const localCart = localStorage.getItem('cart_items')
    if (localCart) {
      try {
        setItems(JSON.parse(localCart))
      } catch (e) {
        console.error('Failed to parse local cart items', e)
      }
    }
  }, [])

  // Sync with Database when login state changes
  useEffect(() => {
    const syncDatabaseCart = async () => {
      if (user?.user_id) {
        try {
          const localCartStr = localStorage.getItem('cart_items')
          const localItems: CartItem[] = localCartStr ? JSON.parse(localCartStr) : []

          if (localItems.length > 0) {
            const res = await cartApi.syncCart({ items: localItems })
            const dbItems = res.data || res
            setItems(dbItems)
            localStorage.setItem('cart_items', JSON.stringify(dbItems))
          } else {
            const res = await cartApi.getMyCart()
            const dbItems = res.data || res
            setItems(dbItems)
            localStorage.setItem('cart_items', JSON.stringify(dbItems))
          }
        } catch (err) {
          console.error('Failed to sync or load cart from database', err)
        }
      } else {
        // User logout: clear memory and localStorage
        setItems([])
        localStorage.removeItem('cart_items')
      }
    }

    syncDatabaseCart()
  }, [user])

  const addCartItem = async (product: Omit<CartItem, 'quantity'>, quantityToAdd: number = 1, stock?: number) => {
    const existingItem = items.find(
      (item) => item.id === product.id && item.size === product.size
    )
    const currentQty = existingItem ? existingItem.quantity : 0
    const targetQty = currentQty + quantityToAdd

    if (stock !== undefined && targetQty > stock) {
      showToast(
        language === 'vi'
          ? `Số lượng trong giỏ hàng đạt giới hạn tồn kho (tối đa là ${stock})`
          : `Quantity in cart reached stock limit (maximum is ${stock})`,
        'error'
      )
      
      if (currentQty >= stock) {
        return // Không thay đổi gì cả, thoát ra ngay
      }
      
      // Nếu chưa đạt kịch tồn kho, ta sẽ tăng số lượng lên đúng bằng tồn kho
      const qtyToAddAdjusted = stock - currentQty
      setItems((prevItems) => {
        const nextItems = prevItems.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: stock }
            : item
        )
        localStorage.setItem('cart_items', JSON.stringify(nextItems))
        return nextItems
      })

      if (user?.user_id) {
        try {
          await cartApi.addItem({
            product_id: product.id,
            size: product.size,
            quantity: qtyToAddAdjusted
          })
        } catch (err: any) {
          console.error('Failed to add cart item to database', err)
          const errMsg = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng'
          showToast(errMsg, 'error')
          // Đồng bộ lại giỏ hàng từ Database
          try {
            const res = await cartApi.getMyCart()
            const dbItems = res.data || res
            setItems(dbItems)
            localStorage.setItem('cart_items', JSON.stringify(dbItems))
          } catch (syncErr) {
            console.error('Failed to sync cart after error', syncErr)
          }
        }
      }
      return
    }

    // Trường hợp bình thường (không vượt quá hoặc không có thông tin stock)
    setItems((prevItems) => {
      let nextItems
      if (existingItem) {
        nextItems = prevItems.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        )
      } else {
        nextItems = [...prevItems, { ...product, quantity: quantityToAdd }]
      }
      localStorage.setItem('cart_items', JSON.stringify(nextItems))
      return nextItems
    })

    if (user?.user_id) {
      try {
        await cartApi.addItem({
          product_id: product.id,
          size: product.size,
          quantity: quantityToAdd
        })
      } catch (err: any) {
        console.error('Failed to add cart item to database', err)
        const errMsg = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng'
        showToast(errMsg, 'error')
        // Đồng bộ lại giỏ hàng từ Database
        try {
          const res = await cartApi.getMyCart()
          const dbItems = res.data || res
          setItems(dbItems)
          localStorage.setItem('cart_items', JSON.stringify(dbItems))
        } catch (syncErr) {
          console.error('Failed to sync cart after error', syncErr)
        }
      }
    }
  }

  const removeCartItem = async (id: number, size: string) => {
    setItems((prevItems) => {
      const nextItems = prevItems.filter((item) => !(item.id === id && item.size === size))
      localStorage.setItem('cart_items', JSON.stringify(nextItems))
      return nextItems
    })

    if (user?.user_id) {
      try {
        await cartApi.removeItem({ product_id: id, size })
      } catch (err) {
        console.error('Failed to remove cart item from database', err)
      }
    }
  }

  const incrementQuantity = async (id: number, size: string) => {
    const currentItem = items.find((item) => item.id === id && item.size === size)
    if (!currentItem) return

    const newQuantity = currentItem.quantity + 1

    setItems((prevItems) => {
      const nextItems = prevItems.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
      localStorage.setItem('cart_items', JSON.stringify(nextItems))
      return nextItems
    })

    if (user?.user_id) {
      try {
        await cartApi.updateQuantity({
          product_id: id,
          size,
          quantity: newQuantity
        })
      } catch (err) {
        console.error('Failed to increment cart item quantity in database', err)
      }
    }
  }

  const decrementQuantity = async (id: number, size: string) => {
    const currentItem = items.find((item) => item.id === id && item.size === size)
    if (!currentItem) return

    const newQuantity = Math.max(1, currentItem.quantity - 1)

    setItems((prevItems) => {
      const nextItems = prevItems.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
      localStorage.setItem('cart_items', JSON.stringify(nextItems))
      return nextItems
    })

    if (user?.user_id) {
      try {
        await cartApi.updateQuantity({
          product_id: id,
          size,
          quantity: newQuantity
        })
      } catch (err) {
        console.error('Failed to decrement cart item quantity in database', err)
      }
    }
  }

  const clearCart = async () => {
    setItems([])
    localStorage.removeItem('cart_items')

    if (user?.user_id) {
      try {
        await cartApi.clearCart()
      } catch (err) {
        console.error('Failed to clear cart in database', err)
      }
    }
  }

  const updateCartItemSize = async (
    id: number,
    oldSize: string,
    newSize: string,
    newPrice: number,
    newOriginalPrice?: number | null,
    newStock?: number
  ) => {
    const oldItem = items.find((item) => item.id === id && item.size === oldSize)
    if (!oldItem) return

    const duplicateItem = items.find((item) => item.id === id && item.size === newSize)
    const targetQty = duplicateItem ? (duplicateItem.quantity + oldItem.quantity) : oldItem.quantity

    if (newStock !== undefined && targetQty > newStock) {
      showToast(
        language === 'vi'
          ? `Không thể đổi size. Số lượng yêu cầu (${targetQty}) vượt quá tồn kho của size mới (tối đa là ${newStock})`
          : `Cannot change size. Requested quantity (${targetQty}) exceeds stock of new size (maximum is ${newStock})`,
        'error'
      )
      return // Dừng lại ở đây, không cho chuyển size
    }

    setItems((prevItems) => {
      let nextItems
      if (duplicateItem) {
        const duplicateQty = duplicateItem.quantity + oldItem!.quantity
        nextItems = prevItems
          .filter((item) => !(item.id === id && item.size === oldSize))
          .map((item) =>
            item.id === id && item.size === newSize
              ? { ...item, quantity: duplicateQty, price: newPrice, originalPrice: newOriginalPrice }
              : item
          )
      } else {
        nextItems = prevItems.map((item) =>
          item.id === id && item.size === oldSize
            ? { ...item, size: newSize, price: newPrice, originalPrice: newOriginalPrice }
            : item
        )
      }

      localStorage.setItem('cart_items', JSON.stringify(nextItems))
      return nextItems
    })

    if (user?.user_id) {
      try {
        await cartApi.changeSize({
          product_id: id,
          old_size: oldSize,
          new_size: newSize
        })
      } catch (err: any) {
        console.error('Failed to update cart item size in database', err)
        const errMsg = err.response?.data?.message || err.message || 'Không thể thay đổi kích cỡ'
        showToast(errMsg, 'error')
        
        // Đồng bộ lại giỏ hàng từ Database để rollback UI
        try {
          const res = await cartApi.getMyCart()
          const dbItems = res.data || res
          setItems(dbItems)
          localStorage.setItem('cart_items', JSON.stringify(dbItems))
        } catch (syncErr) {
          console.error('Failed to sync cart after error', syncErr)
        }
      }
    }
  }

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const lastIndexA = items.map(item => item.id).lastIndexOf(a.id)
      const lastIndexB = items.map(item => item.id).lastIndexOf(b.id)
      
      if (lastIndexA !== lastIndexB) {
        return lastIndexB - lastIndexA
      }
      
      return items.indexOf(a) - items.indexOf(b)
    })
  }, [items])

  const totalItems = useMemo(() => sortedItems.reduce((sum, item) => sum + item.quantity, 0), [sortedItems])
  const totalPrice = useMemo(() => sortedItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [sortedItems])

  return (
    <CartContext.Provider
      value={{
        items: sortedItems,
        addCartItem,
        removeCartItem,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        updateCartItemSize,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
