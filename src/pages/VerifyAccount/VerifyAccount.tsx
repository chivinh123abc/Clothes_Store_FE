import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Loader2, ArrowRight, Home } from 'lucide-react'
import { userApi } from '../../apis/userApi'
import Layout from '../../components/layout/Layout'
import { useToast } from '../../contexts/ToastContext'
import { Mail } from 'lucide-react'

const VerifyAccount: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [isResending, setIsResending] = useState(false)
  const { showToast } = useToast()

  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const handleResend = async () => {
    if (!email) return
    setIsResending(true)
    try {
      await userApi.resendVerification(email)
      showToast('Verification email resent! Please check your inbox.', 'success')
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to resend email.', 'error')
    } finally {
      setIsResending(false)
    }
  }

  useEffect(() => {
    const verify = async () => {
      if (!email || !token) {
        setStatus('error')
        setMessage('Invalid verification link.')
        return
      }

      try {
        await userApi.verifyAccount({ email, verify_token: token })
        setStatus('success')
        setMessage('Your account has been successfully verified!')
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || ''
        if (errorMsg === 'User has been activated') {
          setStatus('success')
          setMessage('Your account is already active and ready to use!')
        } else {
          setStatus('error')
          setMessage(errorMsg || 'Verification failed. The link may be expired or invalid.')
        }
      }
    }

    verify()
  }, [email, token])

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#111111] border border-white/5 p-12 text-center relative overflow-hidden"
        >
          {/* Background Gradient Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-t1-red to-transparent opacity-50" />

          {status === 'loading' && (
            <div className="py-10">
              <Loader2 className="w-16 h-16 text-t1-red animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-oswald font-black text-white uppercase italic tracking-wider mb-2">Verifying...</h2>
              <p className="text-gray-500 text-sm font-inter">Please wait while we activate your account.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl font-oswald font-black text-white uppercase italic tracking-wider mb-4">Success!</h2>
              <p className="text-gray-400 text-sm font-inter mb-10 leading-relaxed">
                {message}
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/?login=true')}
                  className="w-full bg-t1-red text-white py-4 font-oswald font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-black flex items-center justify-center gap-2 group shadow-[0_10px_30px_rgba(226,1,45,0.2)]"
                >
                  Go to Login
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-transparent border border-white/10 text-white py-4 font-oswald font-bold text-xs uppercase tracking-[0.2em] transition-all hover:bg-white/5 flex items-center justify-center gap-2"
                >
                  <Home size={16} />
                  Home Page
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="py-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <XCircle className="w-20 h-20 text-t1-red mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl font-oswald font-black text-white uppercase italic tracking-wider mb-4">Failed</h2>
              <p className="text-gray-400 text-sm font-inter mb-10 leading-relaxed">
                {message}
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full bg-white text-black py-4 font-oswald font-black text-sm uppercase tracking-[0.2em] transition-all hover:bg-t1-red hover:text-white flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isResending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Mail size={18} />
                      Resend Verification Email
                    </>
                  )}
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="w-full bg-transparent border border-white/10 text-white py-4 font-oswald font-bold text-xs uppercase tracking-[0.2em] transition-all hover:bg-white/5 flex items-center justify-center gap-2"
                >
                  Register Page
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-transparent border border-white/10 text-white py-4 font-oswald font-bold text-xs uppercase tracking-[0.2em] transition-all hover:bg-white/5 flex items-center justify-center gap-2"
                >
                  <Home size={16} />
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}

export default VerifyAccount
