/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addCartItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeCartItem: (id: string, size: string) => void;
  incrementQuantity: (id: string, size: string) => void;
  decrementQuantity: (id: string, size: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addCartItem = (product: Omit<CartItem, 'quantity'>, quantityToAdd: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.size === product.size
      )
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        )
      }
      return [...prevItems, { ...product, quantity: quantityToAdd }]
    })
  }

  const removeCartItem = (id: string, size: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.size === size))
    )
  }

  const incrementQuantity = (id: string, size: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decrementQuantity = (id: string, size: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])

  return (
    <CartContext.Provider
      value={{
        items,
        addCartItem,
        removeCartItem,
        incrementQuantity,
        decrementQuantity,
        clearCart,
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
