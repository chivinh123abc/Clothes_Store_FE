/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useAuth } from '~/hooks/useAuth'
import type { Product } from '~/types/product'

interface FavoritesContextType {
  favorites: Product[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (product: Product) => void
  clearFavorites: () => void
  totalFavorites: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const getFavKey = (userId: number) => `favorites_${userId}`

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const loadFromStorage = (userId: number): Product[] => {
    try {
      const stored = localStorage.getItem(getFavKey(userId))
      return stored ? (JSON.parse(stored) as Product[]) : []
    } catch {
      return []
    }
  }

  const [favorites, setFavorites] = useState<Product[]>(() =>
    user ? loadFromStorage(user.user_id) : []
  )

  // Reload favorites from localStorage when user changes (login/logout)
  useEffect(() => {
    if (user) {
      setFavorites(loadFromStorage(user.user_id))
    } else {
      setFavorites([])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id])

  // Persist to localStorage whenever favorites change (and user is logged in)
  useEffect(() => {
    if (user) {
      localStorage.setItem(getFavKey(user.user_id), JSON.stringify(favorites))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites])

  const isFavorite = (id: number) => favorites.some((p) => p.product_id === id)

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) =>
      prev.some((p) => p.product_id === product.product_id)
        ? prev.filter((p) => p.product_id !== product.product_id)
        : [...prev, product]
    )
  }

  const clearFavorites = () => setFavorites([])

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        totalFavorites: favorites.length
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
