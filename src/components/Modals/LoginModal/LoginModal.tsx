import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Lock, Loader2 } from 'lucide-react'
import axios from 'axios'
import { userApi } from '../../../apis/userApi'
import { useAuth } from '../../../hooks/useAuth'
import { useLanguage } from '~/contexts/LanguageContext'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()

  useEffect(() => {
    if (!open) {
      setError('')
      setIsLoading(false)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const res = await userApi.login({ identifier, password })
      setUser(res)
      onClose()
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || t('auth.invalidLogin'))
      } else {
        setError(t('auth.loginFailed'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex justify-center items-center px-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="bg-[#111111] w-full max-w-[420px] rounded-none border border-white/5 shadow-2xl relative z-10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Design accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-t1-red to-transparent opacity-50"></div>

            <div className="p-10 md:p-12">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors duration-300"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-10">
                <span className="text-t1-red font-oswald font-black text-sm tracking-[0.4em] uppercase mb-4 block">{t('auth.welcome')}</span>
                <h2 className="text-4xl font-oswald font-black text-white italic uppercase tracking-tighter">
                  {t('auth.signIn')}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-oswald font-bold mb-2 uppercase text-gray-500 tracking-[0.2em]">
                    {t('auth.email')}
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-t1-red transition-colors">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-none pl-12 pr-4 py-4 outline-none focus:border-t1-red/50 text-white transition-all duration-300 font-inter text-sm placeholder:text-gray-700"
                      placeholder={t('auth.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-oswald font-bold uppercase text-gray-500 tracking-[0.2em]">
                      {t('auth.password')}
                    </label>
                    <button type="button" className="text-[9px] font-inter text-gray-600 hover:text-white uppercase tracking-widest transition-colors">
                      {t('auth.forgot')}
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-t1-red transition-colors">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-none pl-12 pr-4 py-4 outline-none focus:border-t1-red/50 text-white transition-all duration-300 font-inter text-sm placeholder:text-gray-700"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-t1-red text-[10px] font-bold uppercase tracking-widest text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-t1-red text-white h-14 font-oswald font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-black flex items-center justify-center shadow-[0_10px_30px_rgba(226,1,45,0.2)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.2)] disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    t('auth.enterStore')
                  )}
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] text-gray-500 font-inter tracking-[0.1em] uppercase">
                  {t('auth.noAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      navigate('/register')
                    }}
                    className="text-white font-bold hover:text-t1-red transition-colors ml-2"
                  >
                    {t('auth.createOne')}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
