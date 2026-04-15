/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { en } from '../locales/en'
import { vi } from '../locales/vi'

type Language = 'en' | 'vi'

interface LanguageContextType {
  language: Language
  setLanguage(lang: Language): void // eslint-disable-line no-unused-vars
  t(path: string, params?: Record<string, string | number>): string // eslint-disable-line no-unused-vars
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, any> = { en, vi }

/**
 * Provides language state and translation helper to the application.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.')
    let result: any = translations[language]

    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key]
      } else {
        // eslint-disable-next-line no-console
        console.warn(`Translation key not found: ${path}`)
        return path
      }
    }

    if (typeof result === 'string' && params) {
      let localized = result
      Object.entries(params).forEach(([key, value]) => {
        localized = localized.replace(`{${key}}`, String(value))
      })
      return localized
    }

    return typeof result === 'string' ? result : path
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Hook to access translation and language state.
 */
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
