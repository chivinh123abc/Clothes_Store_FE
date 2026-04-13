import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../../apis/userApi'
import { useAuth } from '../../hooks/useAuth'
import type { RegisterRequestDto } from '../../types/user'
import Layout from '../../components/layout/Layout'
import Footer from '../../components/layout/Footer'

interface RegisterForm extends RegisterRequestDto {
    confirmPassword: string
}

type FormErrors = Partial<Record<keyof RegisterForm, string>>

const validate = (form: RegisterForm): FormErrors => {
  const errors: FormErrors = {}

  if (!form.username.trim()) {
    errors.username = 'Vui lòng nhập tên người dùng'
  } else if (form.username.trim().length < 3) {
    errors.username = 'Tên người dùng tối thiểu 3 ký tự'
  }

  if (!form.email) {
    errors.email = 'Vui lòng nhập email'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email không hợp lệ'
  }

  if (!form.password) {
    errors.password = 'Vui lòng nhập mật khẩu'
  } else if (form.password.length < 6) {
    errors.password = 'Mật khẩu tối thiểu 6 ký tự'
  }

  if (form.phone_number && !/^(0|\+84)[3-9]\d{8}$/.test(form.phone_number.replace(/\s/g, ''))) {
    errors.phone_number = 'Số điện thoại không hợp lệ'
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
  }

  return errors
}

const initialForm: RegisterForm = {
  username: '',
  email: '',
  password: '',
  phone_number: '',
  confirmPassword: ''
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const [form, setForm] = useState<RegisterForm>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof RegisterForm]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setIsLoading(true)
    try {
      const { confirmPassword, ...payload } = form
      void confirmPassword
      const res = await userApi.register(payload)
      setUser(res)
      navigate('/')
    } catch (err: unknown) {
      const message =
                (err as { response?: { data?: { message?: string } } })
                  ?.response?.data?.message ?? 'Đăng ký thất bại. Vui lòng thử lại.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout footer={<Footer />}>
      <div className='bg-t1-dark flex items-center justify-center px-4 py-20'>
        <div className='w-full max-w-md bg-[#1a1a1a] p-10 border border-white/5 shadow-2xl'>
          <h1 className='text-4xl font-oswald font-black text-center uppercase tracking-tighter mb-10 text-white italic'>
            Sign Up
          </h1>

          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className='mb-6'>
              <label className='block text-xs font-oswald font-bold mb-2 uppercase text-gray-400 tracking-widest'>
                Username
              </label>
              <input
                type='text'
                name='username'
                value={form.username}
                onChange={handleChange}
                placeholder='Choose your username'
                className='w-full bg-black border border-white/10 rounded-none px-4 py-3 outline-none focus:border-t1-red text-white transition-colors font-inter text-sm'
              />
              {errors.username && (
                <p className='mt-2 text-[10px] text-t1-red font-bold uppercase tracking-widest'>{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className='mb-6'>
              <label className='block text-xs font-oswald font-bold mb-2 uppercase text-gray-400 tracking-widest'>
                Email Address
              </label>
              <input
                type='email'
                name='email'
                value={form.email}
                onChange={handleChange}
                placeholder='Enter your email'
                className='w-full bg-black border border-white/10 rounded-none px-4 py-3 outline-none focus:border-t1-red text-white transition-colors font-inter text-sm'
              />
              {errors.email && (
                <p className='mt-2 text-[10px] text-t1-red font-bold uppercase tracking-widest'>{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className='mb-6'>
              <label className='block text-xs font-oswald font-bold mb-2 uppercase text-gray-400 tracking-widest'>
                Phone Number <span className='text-gray-600 normal-case'>(Optional)</span>
              </label>
              <input
                type='tel'
                name='phone_number'
                value={form.phone_number}
                onChange={handleChange}
                placeholder='09xx xxx xxx'
                className='w-full bg-black border border-white/10 rounded-none px-4 py-3 outline-none focus:border-t1-red text-white transition-colors font-inter text-sm'
              />
              {errors.phone_number && (
                <p className='mt-2 text-[10px] text-t1-red font-bold uppercase tracking-widest'>{errors.phone_number}</p>
              )}
            </div>

            {/* Password */}
            <div className='mb-6'>
              <label className='block text-xs font-oswald font-bold mb-2 uppercase text-gray-400 tracking-widest'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={form.password}
                  onChange={handleChange}
                  placeholder='Create a password'
                  className='w-full bg-black border border-white/10 rounded-none px-4 py-3 outline-none focus:border-t1-red text-white transition-colors font-inter text-sm pr-12'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(v => !v)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-xs'
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
              {errors.password && (
                <p className='mt-2 text-[10px] text-t1-red font-bold uppercase tracking-widest'>{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className='mb-10'>
              <label className='block text-xs font-oswald font-bold mb-2 uppercase text-gray-400 tracking-widest'>
                Confirm Password
              </label>
              <div className='relative'>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name='confirmPassword'
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder='Repeat password'
                  className='w-full bg-black border border-white/10 rounded-none px-4 py-3 outline-none focus:border-t1-red text-white transition-colors font-inter text-sm pr-12'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirm(v => !v)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-xs'
                >
                  {showConfirm ? 'HIDE' : 'SHOW'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='mt-2 text-[10px] text-t1-red font-bold uppercase tracking-widest'>{errors.confirmPassword}</p>
              )}
            </div>

            {/* Server error */}
            {error && (
              <p className='mb-6 text-xs text-t1-red text-center font-bold uppercase tracking-widest'>{error}</p>
            )}

            {/* Submit */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-t1-red text-white py-4 font-oswald font-black uppercase tracking-[0.2em] hover:bg-white hover:text-t1-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(226,1,45,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'
            >
              {isLoading ? 'Processing...' : 'Create Account'}
            </button>
          </form>

          <div className='mt-8 text-center text-xs text-gray-500 font-inter tracking-wider'>
            Already have an account?{' '}
            <button
              type='button'
              onClick={() => navigate('/')}
              className='text-white font-bold underline hover:text-t1-red transition-colors uppercase'
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default RegisterPage