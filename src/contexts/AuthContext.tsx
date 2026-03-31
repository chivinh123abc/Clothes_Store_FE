import React, { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { AuthResponseDto } from '../types/user'

export interface AuthContextType {
  user: AuthResponseDto | null
  setUser: (u: AuthResponseDto | null) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<AuthResponseDto | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthResponseDto
        setUserState(parsedUser)
      } catch (error) {
        console.error('Failed to parse auth_user', error)
      }
    }
  }, [])

  const setUser = (u: AuthResponseDto | null) => {
    if (u) {
      localStorage.setItem('auth_user', JSON.stringify(u))
      localStorage.setItem('access_token', u.accessToken)
      setUserState(u)
    } else {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('access_token')
      setUserState(null)
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('auth_user')
    setUserState(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
