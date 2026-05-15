/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { AuthResponseDto } from '../types/user'
import { userApi } from '../apis/userApi'

export interface AuthContextType {
  user: AuthResponseDto | null
  isLoading: boolean
  // eslint-disable-next-line no-unused-vars
  setUser: (user: AuthResponseDto | null) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<AuthResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Auto-logout timer
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token || token === 'undefined') return

    try {
      // Manual JWT decode to get 'exp'
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))

      const { exp } = JSON.parse(jsonPayload)
      if (!exp) return

      const expireTime = exp * 1000
      const currentTime = Date.now()
      const timeLeft = expireTime - currentTime

      if (timeLeft <= 0) {
        logout()
      } else {
        const timer = setTimeout(() => {
          logout()
          // Optional: redirect or show message
          window.location.href = '/?login=true'
        }, timeLeft)

        return () => clearTimeout(timer)
      }
    } catch (e) {
      // console.error('Invalid token', e)
    }
  }, [user])

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthResponseDto
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserState(parsedUser)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse auth_user', error)
      }
    }
    setIsLoading(false)
  }, [])

  const setUser = (u: AuthResponseDto | null) => {
    if (u) {
      // Merge with existing user data to preserve tokens and other fields if partial update
      const newUser = { ...user, ...u }
      localStorage.setItem('auth_user', JSON.stringify(newUser))

      // Only update access_token if provided (usually during login/register/refresh)
      if (u.access_token) {
        localStorage.setItem('access_token', u.access_token)
      }

      setUserState(newUser)
    } else {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('access_token')
      setUserState(null)
    }
  }

  const logout = async () => {
    try {
      await userApi.logout()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logout API failed', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('auth_user')
      setUserState(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
