import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Lock, Loader2, Eye, EyeOff, Mail, CheckCircle2, Phone } from 'lucide-react'
import { userApi } from '../../../apis/userApi'
import { useAuth } from '../../../hooks/useAuth'
import { useLanguage } from '~/contexts/LanguageContext'
import { useToast } from '~/contexts/ToastContext'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  defaultView?: 'login' | 'register' | 'forgot'
}

type ModalView = 'login' | 'register' | 'forgot'

interface RegisterForm {
  username: string
  email: string
  password: string
  phone_number: string
  confirmPassword: string
}

export default function LoginModal({ open, onClose, defaultView = 'login' }: LoginModalProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [showResend, setShowResend] = useState(false)
  const [resending, setResending] = useState(false)

  // Forgot password states
  const [view, setView] = useState<ModalView>(defaultView)
  const [forgotEmail, setForgotEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [otpCooldown, setOtpCooldown] = useState(0)
  const [sendingOtp, setSendingOtp] = useState(false)

  // Register states
  const [regForm, setRegForm] = useState<RegisterForm>({
    username: '', email: '', password: '', phone_number: '', confirmPassword: ''
  })
  const [regErrors, setRegErrors] = useState<Partial<Record<keyof RegisterForm, string>>>({})
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showRegConfirm, setShowRegConfirm] = useState(false)
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState(false)

  const { setUser } = useAuth()
  const { t, language } = useLanguage()
  const { showToast } = useToast()

  // Reset all state when modal closes
  useEffect(() => {
    if (!open) {
      setError('')
      setIsLoading(false)
      setShowPassword(false)
      setShowResend(false)
      setView(defaultView)
      setForgotEmail('')
      setForgotSuccess(false)
      setForgotLoading(false)
      setForgotError('')
      setOtpCode('')
      setNewPassword('')
      setConfirmPassword('')
      setOtpCooldown(0)
      setSendingOtp(false)
      setRegForm({ username: '', email: '', password: '', phone_number: '', confirmPassword: '' })
      setRegErrors({})
      setRegLoading(false)
      setRegError('')
      setRegSuccess(false)
    }
  }, [open, defaultView])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (otpCooldown > 0) {
      timer = setTimeout(() => setOtpCooldown(prev => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [otpCooldown])

  // Switch view helper — resets errors
  const switchView = (v: ModalView) => {
    setError('')
    setForgotError('')
    setRegError('')
    setRegErrors({})
    setView(v)
  }

  // ─── LOGIN ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const res = await userApi.login({ identifier, password })
      setUser(res)
      onClose()
    } catch (err: any) {
      const msg = err.response?.data?.message || t('auth.loginFailed')
      setError(msg)
      if (msg.toLowerCase().includes('not active') || msg.toLowerCase().includes('chưa kích hoạt')) {
        setShowResend(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (!identifier) return
    setResending(true)
    try {
      await userApi.resendVerification(identifier)
      setError(t('auth.verificationSent') || 'Verification email sent!')
      setShowResend(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend email')
    } finally {
      setResending(false)
    }
  }

  // ─── REGISTER ────────────────────────────────────────────────────────────────
  const validateReg = (): boolean => {
    const errors: Partial<Record<keyof RegisterForm, string>> = {}
    if (!regForm.username.trim()) {
      errors.username = t('auth.required')
    } else if (regForm.username.trim().length < 8) {
      errors.username = t('auth.minChars', { count: 8 })
    } else if (regForm.username.includes('@')) {
      errors.username = t('auth.usernameInvalid')
    }
    if (!regForm.email) {
      errors.email = t('auth.required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) {
      errors.email = t('auth.invalidEmail')
    }
    if (!regForm.password) {
      errors.password = t('auth.required')
    } else if (regForm.password.length < 6) {
      errors.password = t('auth.minChars', { count: 6 })
    }
    if (regForm.phone_number && !/^(0|\+84)[3-9]\d{8}$/.test(regForm.phone_number.replace(/\s/g, ''))) {
      errors.phone_number = t('auth.invalidPhone')
    }
    if (!regForm.confirmPassword) {
      errors.confirmPassword = t('auth.required')
    } else if (regForm.confirmPassword !== regForm.password) {
      errors.confirmPassword = t('auth.mismatch')
    }
    setRegErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegForm(prev => ({ ...prev, [name]: value }))
    if (regErrors[name as keyof RegisterForm]) {
      setRegErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (regError) setRegError('')
  }

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateReg()) return
    setRegLoading(true)
    setRegError('')
    try {
      const { confirmPassword: _cp, ...payload } = regForm
      void _cp
      const res = await userApi.register(payload) as any
      const msg = res.message || t('auth.registerSuccess') || 'Registration successful!'
      showToast(msg, 'success')
      setRegSuccess(true)
    } catch (err: any) {
      setRegError(err?.response?.data?.message ?? t('auth.registerFailed'))
    } finally {
      setRegLoading(false)
    }
  }

  // ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
  const handleSendOTP = async () => {
    if (!forgotEmail) {
      setForgotError(language === 'vi' ? 'Vui lòng nhập email.' : 'Please enter your email.')
      return
    }
    setSendingOtp(true)
    setForgotError('')
    try {
      await userApi.forgotPassword(forgotEmail)
      setOtpCooldown(60)
      setForgotError(language === 'vi' ? 'Mã OTP đã được gửi đến email của bạn!' : 'OTP code sent to your email!')
    } catch (err: any) {
      setForgotError(err.response?.data?.message || 'Failed to send OTP code')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail || !otpCode || !newPassword || !confirmPassword) {
      setForgotError(language === 'vi' ? 'Vui lòng điền đầy đủ thông tin.' : 'Please fill in all fields.')
      return
    }
    if (newPassword.length < 6) {
      setForgotError(language === 'vi' ? 'Mật khẩu mới phải có ít nhất 6 ký tự.' : 'New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setForgotError(language === 'vi' ? 'Mật khẩu mới không khớp.' : 'New passwords do not match.')
      return
    }
    setForgotLoading(true)
    setForgotError('')
    try {
      await userApi.resetPassword({ email: forgotEmail, token: otpCode, password: newPassword })
      setForgotSuccess(true)
    } catch (err: any) {
      setForgotError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setForgotLoading(false)
    }
  }

  // ─── SHARED FIELD CLASSES ────────────────────────────────────────────────────
  const inputCls = 'w-full bg-black border border-white/10 rounded-none pl-12 pr-4 py-4 outline-none focus:border-t1-red/50 text-white transition-all duration-300 font-inter text-sm placeholder:text-gray-700'
  const labelCls = 'block text-[10px] font-oswald font-bold mb-2 uppercase text-gray-500 tracking-[0.2em]'
  const iconWrapCls = 'absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-t1-red transition-colors'
  const errorCls = 'mt-1 text-[10px] text-t1-red font-bold uppercase tracking-widest'

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 })
  }

  const viewOrder: ModalView[] = ['login', 'register', 'forgot']
  const getDir = (from: ModalView, to: ModalView) =>
    viewOrder.indexOf(to) > viewOrder.indexOf(from) ? 1 : -1

  const [direction, setDirection] = useState(1)
  const handleSwitchView = (to: ModalView) => {
    setDirection(getDir(view, to))
    switchView(to)
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
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-t1-red to-transparent opacity-50" />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors duration-300 z-10"
            >
              <X size={20} />
            </button>

            {/* View container with slide animation */}
            <AnimatePresence mode="wait" custom={direction}>
              {/* ═══════════ LOGIN VIEW ═══════════ */}
              {view === 'login' && (
                <motion.div
                  key="login"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="p-10 md:p-12"
                >
                  <div className="text-center mb-10">
                    <span className="text-t1-red font-oswald font-black text-sm tracking-[0.4em] uppercase mb-4 block">
                      {t('auth.welcome')}
                    </span>
                    <h2 className="text-4xl font-oswald font-black text-white italic uppercase tracking-tighter">
                      {t('auth.signIn')}
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className={labelCls}>{t('auth.email')}</label>
                      <div className="relative group">
                        <div className={iconWrapCls}><User size={16} /></div>
                        <input
                          type="text"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className={inputCls}
                          placeholder={t('auth.emailPlaceholder')}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className={labelCls.replace('mb-2', '')}>{t('auth.password')}</label>
                        <button
                          type="button"
                          onClick={() => handleSwitchView('forgot')}
                          className="text-[9px] font-inter text-gray-600 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          {t('auth.forgot')}
                        </button>
                      </div>
                      <div className="relative group">
                        <div className={iconWrapCls}><Lock size={16} /></div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={inputCls + ' pr-12'}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors duration-300"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="space-y-4">
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-t1-red text-[10px] font-bold uppercase tracking-widest text-center"
                        >
                          {error}
                        </motion.p>
                        {showResend && (
                          <button
                            type="button"
                            onClick={handleResendEmail}
                            disabled={resending}
                            className="w-full text-[9px] font-oswald font-black text-white uppercase tracking-[0.3em] py-2 border border-white/10 hover:border-t1-red hover:text-t1-red transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            {resending ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
                            {t('auth.resendEmail') || 'Resend Verification Email'}
                          </button>
                        )}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-t1-red text-white h-14 font-oswald font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-black flex items-center justify-center shadow-[0_10px_30px_rgba(226,1,45,0.2)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.2)] disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 size={20} className="animate-spin" /> : t('auth.enterStore')}
                    </button>
                  </form>

                  <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-500 font-inter tracking-[0.1em] uppercase">
                      {t('auth.noAccount')}{' '}
                      <button
                        type="button"
                        onClick={() => handleSwitchView('register')}
                        className="text-white font-bold hover:text-t1-red transition-colors ml-2"
                      >
                        {t('auth.createOne')}
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ═══════════ REGISTER VIEW ═══════════ */}
              {view === 'register' && (
                <motion.div
                  key="register"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="p-10 md:p-12"
                >
                  <div className="text-center mb-8">
                    <span className="text-t1-red font-oswald font-black text-sm tracking-[0.4em] uppercase mb-3 block">
                      {language === 'vi' ? 'THAM GIA CÙNG CHÚNG TÔI' : 'JOIN US'}
                    </span>
                    {!regSuccess && (
                      <h2 className="text-3xl font-oswald font-black text-white italic uppercase tracking-tighter">
                        {t('auth.signup')}
                      </h2>
                    )}
                  </div>

                  {regSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                      className="space-y-8 text-center py-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.1, bounce: 0.5 }}
                        className="flex justify-center"
                      >
                        <div className="w-20 h-20 rounded-full bg-t1-red/10 border border-t1-red/30 flex items-center justify-center">
                          <CheckCircle2 size={40} className="text-t1-red" />
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                      >
                        <p className="text-white font-oswald font-black text-xl uppercase tracking-wide">
                          {language === 'vi' ? 'Đăng ký thành công!' : 'Account created!'}
                        </p>
                        <p className="text-gray-400 font-inter text-sm leading-relaxed">
                          {language === 'vi'
                            ? 'Vui lòng kiểm tra email để kích hoạt tài khoản.'
                            : 'Please check your email to activate your account.'}
                        </p>
                      </motion.div>
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        type="button"
                        onClick={() => handleSwitchView('login')}
                        className="w-full bg-t1-red text-white h-14 font-oswald font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-black flex items-center justify-center"
                      >
                        {language === 'vi' ? 'ĐĂNG NHẬP NGAY' : 'SIGN IN NOW'}
                      </motion.button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleRegSubmit} noValidate className="space-y-4">
                      {/* Username */}
                      <div>
                        <label className={labelCls}>{t('auth.username')}</label>
                        <div className="relative group">
                          <div className={iconWrapCls}><User size={16} /></div>
                          <input
                            type="text"
                            name="username"
                            value={regForm.username}
                            onChange={handleRegChange}
                            className={inputCls}
                            placeholder={t('auth.usernamePlaceholder')}
                          />
                        </div>
                        {regErrors.username && <p className={errorCls}>{regErrors.username}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className={labelCls}>{t('auth.email')}</label>
                        <div className="relative group">
                          <div className={iconWrapCls}><Mail size={16} /></div>
                          <input
                            type="email"
                            name="email"
                            value={regForm.email}
                            onChange={handleRegChange}
                            className={inputCls}
                            placeholder={t('auth.emailPlaceholder')}
                          />
                        </div>
                        {regErrors.email && <p className={errorCls}>{regErrors.email}</p>}
                      </div>

                      {/* Phone (optional) */}
                      <div>
                        <label className={labelCls}>
                          {language === 'vi' ? 'SỐ ĐIỆN THOẠI' : 'PHONE'}{' '}
                          <span className="text-gray-600 normal-case font-inter font-normal tracking-normal">(optional)</span>
                        </label>
                        <div className="relative group">
                          <div className={iconWrapCls}><Phone size={16} /></div>
                          <input
                            type="tel"
                            name="phone_number"
                            value={regForm.phone_number}
                            onChange={handleRegChange}
                            className={inputCls}
                            placeholder="09xx xxx xxx"
                          />
                        </div>
                        {regErrors.phone_number && <p className={errorCls}>{regErrors.phone_number}</p>}
                      </div>

                      {/* Password */}
                      <div>
                        <label className={labelCls}>{t('auth.password')}</label>
                        <div className="relative group">
                          <div className={iconWrapCls}><Lock size={16} /></div>
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            name="password"
                            value={regForm.password}
                            onChange={handleRegChange}
                            className={inputCls + ' pr-12'}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(v => !v)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors duration-300"
                          >
                            {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {regErrors.password && <p className={errorCls}>{regErrors.password}</p>}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className={labelCls}>{t('auth.confirmPassword')}</label>
                        <div className="relative group">
                          <div className={iconWrapCls}><Lock size={16} /></div>
                          <input
                            type={showRegConfirm ? 'text' : 'password'}
                            name="confirmPassword"
                            value={regForm.confirmPassword}
                            onChange={handleRegChange}
                            className={inputCls + ' pr-12'}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegConfirm(v => !v)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors duration-300"
                          >
                            {showRegConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {regErrors.confirmPassword && <p className={errorCls}>{regErrors.confirmPassword}</p>}
                      </div>

                      {regError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-t1-red text-[10px] font-bold uppercase tracking-widest text-center"
                        >
                          {regError}
                        </motion.p>
                      )}

                      <button
                        type="submit"
                        disabled={regLoading}
                        className="w-full bg-t1-red text-white h-14 font-oswald font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-black flex items-center justify-center shadow-[0_10px_30px_rgba(226,1,45,0.2)] disabled:opacity-50 mt-2"
                      >
                        {regLoading ? <Loader2 size={20} className="animate-spin" /> : t('auth.createAccount')}
                      </button>
                    </form>
                  )}

                  {!regSuccess && (
                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                      <p className="text-[10px] text-gray-500 font-inter tracking-[0.1em] uppercase">
                        {t('auth.hasAccount')}{' '}
                        <button
                          type="button"
                          onClick={() => handleSwitchView('login')}
                          className="text-white font-bold hover:text-t1-red transition-colors ml-2"
                        >
                          {t('auth.login')}
                        </button>
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══════════ FORGOT PASSWORD VIEW ═══════════ */}
              {view === 'forgot' && (
                <motion.div
                  key="forgot"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="p-10 md:p-12"
                >
                  <div className="text-center mb-8">
                    <span className="text-t1-red font-oswald font-black text-sm tracking-[0.4em] uppercase mb-3 block">
                      {language === 'vi' ? 'KHÔI PHỤC MẬT KHẨU' : 'PASSWORD RECOVERY'}
                    </span>
                    {!forgotSuccess && (
                      <h2 className="text-3xl font-oswald font-black text-white italic uppercase tracking-tighter">
                        {language === 'vi' ? 'QUÊN MẬT KHẨU' : 'FORGOT'}
                      </h2>
                    )}
                  </div>

                  {forgotSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                      className="space-y-8 text-center py-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.1, bounce: 0.5 }}
                        className="flex justify-center"
                      >
                        <div className="w-20 h-20 rounded-full bg-t1-red/10 border border-t1-red/30 flex items-center justify-center">
                          <CheckCircle2 size={40} className="text-t1-red" />
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                      >
                        <p className="text-white font-oswald font-black text-xl uppercase tracking-wide">
                          {language === 'vi' ? 'Thành công!' : 'All done!'}
                        </p>
                        <p className="text-gray-400 font-inter text-sm leading-relaxed">
                          {language === 'vi'
                            ? 'Mật khẩu của bạn đã được cập nhật thành công.'
                            : 'Your password has been successfully updated.'}
                        </p>
                      </motion.div>
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        type="button"
                        onClick={() => {
                          setForgotSuccess(false)
                          setForgotEmail('')
                          setOtpCode('')
                          setNewPassword('')
                          setConfirmPassword('')
                          handleSwitchView('login')
                        }}
                        className="w-full bg-t1-red text-white h-14 font-oswald font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-black flex items-center justify-center"
                      >
                        {language === 'vi' ? 'ĐĂNG NHẬP NGAY' : 'SIGN IN NOW'}
                      </motion.button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleResetSubmit} className="space-y-5">
                      {/* Email */}
                      <div>
                        <label className={labelCls}>{t('auth.email')}</label>
                        <div className="relative group">
                          <div className={iconWrapCls}><User size={16} /></div>
                          <input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className={inputCls}
                            placeholder={t('auth.emailPlaceholder')}
                            required
                          />
                        </div>
                      </div>

                      {/* OTP */}
                      <div>
                        <label className={labelCls}>
                          {language === 'vi' ? 'MÃ OTP (CÓ HIỆU LỰC 5 PHÚT)' : 'OTP CODE (VALID FOR 5 MINS)'}
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1 group">
                            <div className={iconWrapCls}><Lock size={16} /></div>
                            <input
                              type="text"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              className={inputCls}
                              placeholder="6-char OTP"
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleSendOTP}
                            disabled={sendingOtp || otpCooldown > 0}
                            className="bg-transparent border border-t1-red text-t1-red hover:bg-t1-red hover:text-white disabled:border-white/10 disabled:text-gray-500 font-oswald font-bold text-xs uppercase px-4 py-4 transition-all duration-300 min-w-[100px]"
                          >
                            {sendingOtp ? (
                              <Loader2 size={16} className="animate-spin mx-auto" />
                            ) : otpCooldown > 0 ? (
                              `${otpCooldown}s`
                            ) : (
                              language === 'vi' ? 'GỬI OTP' : 'SEND OTP'
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className={labelCls}>{language === 'vi' ? 'MẬT KHẨU MỚI' : 'NEW PASSWORD'}</label>
                        <div className="relative group">
                          <div className={iconWrapCls}><Lock size={16} /></div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={inputCls + ' pr-12'}
                            placeholder="••••••••"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors duration-300"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className={labelCls}>{language === 'vi' ? 'XÁC NHẬN MẬT KHẨU MỚI' : 'CONFIRM NEW PASSWORD'}</label>
                        <div className="relative group">
                          <div className={iconWrapCls}><Lock size={16} /></div>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={inputCls + ' pr-12'}
                            placeholder="••••••••"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors duration-300"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {forgotError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-t1-red text-[10px] font-bold uppercase tracking-widest text-center"
                        >
                          {forgotError}
                        </motion.p>
                      )}

                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="w-full bg-t1-red text-white h-14 font-oswald font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-black flex items-center justify-center shadow-[0_10px_30px_rgba(226,1,45,0.2)] disabled:opacity-50"
                      >
                        {forgotLoading ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          language === 'vi' ? 'CẬP NHẬT MẬT KHẨU' : 'RESET PASSWORD'
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSwitchView('login')}
                        className="w-full bg-transparent border border-white/10 text-white py-4 font-oswald font-bold text-xs uppercase tracking-[0.2em] transition-all hover:bg-white/5 flex items-center justify-center"
                      >
                        {language === 'vi' ? 'QUAY LẠI ĐĂNG NHẬP' : 'BACK TO SIGN IN'}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
