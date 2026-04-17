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
      localStorage.setItem('auth_user', JSON.stringify(u))
      localStorage.setItem('access_token', u.access_token)
      setUserState(u)
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
