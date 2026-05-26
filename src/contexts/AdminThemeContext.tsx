import React, { createContext, useContext, useState } from 'react'
import { type ThemeProduct, ThemeFactorySelector } from '../patterns/ThemeFactory'

interface AdminThemeContextType {
  themeMode: 'light' | 'dark';
  theme: ThemeProduct;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined)

export const AdminThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to 'dark' mode as the app is originally dark styled
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('admin_theme_mode') as 'light' | 'dark') || 'dark'
  })

  const toggleTheme = () => {
    setThemeMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('admin_theme_mode', next)
      return next
    })
  }

  // Retrieve the theme product using the Factory Method selector
  const theme = ThemeFactorySelector.getTheme(themeMode)

  return (
    <AdminThemeContext.Provider value={{ themeMode, theme, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  )
}

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext)
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider')
  }
  return context
}
