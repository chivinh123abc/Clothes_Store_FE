import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../../apis/userApi'
import { useAuth } from '../../hooks/useAuth'
import type { RegisterRequestDto } from '../../types/user'

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
    <div className='min-h-screen bg-white flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>
        <h1 className='text-2xl font-bold text-center uppercase tracking-wide mb-8'>
                    Tạo tài khoản
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1 uppercase text-gray-600'>
                            Tên người dùng
            </label>
            <input
              type='text'
              name='username'
              value={form.username}
              onChange={handleChange}
              placeholder='Nhập tên người dùng'
              className='w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-black transition-colors'
            />
            {errors.username && (
              <p className='mt-1 text-xs text-red-500'>{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1 uppercase text-gray-600'>
                            Email
            </label>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder='Nhập email của bạn'
              className='w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-black transition-colors'
            />
            {errors.email && (
              <p className='mt-1 text-xs text-red-500'>{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1 uppercase text-gray-600'>
                            Số điện thoại <span className='text-gray-400 normal-case'>(tuỳ chọn)</span>
            </label>
            <input
              type='tel'
              name='phone_number'
              value={form.phone_number}
              onChange={handleChange}
              placeholder='0901 234 567'
              className='w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-black transition-colors'
            />
            {errors.phone_number && (
              <p className='mt-1 text-xs text-red-500'>{errors.phone_number}</p>
            )}
          </div>

          {/* Password */}
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1 uppercase text-gray-600'>
                            Mật khẩu
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={form.password}
                onChange={handleChange}
                placeholder='Nhập mật khẩu'
                className='w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-black transition-colors pr-10'
              />
              <button
                type='button'
                onClick={() => setShowPassword(v => !v)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors'
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <p className='mt-1 text-xs text-red-500'>{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className='mb-6'>
            <label className='block text-sm font-medium mb-1 uppercase text-gray-600'>
                            Xác nhận mật khẩu
            </label>
            <div className='relative'>
              <input
                type={showConfirm ? 'text' : 'password'}
                name='confirmPassword'
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder='Nhập lại mật khẩu'
                className='w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-black transition-colors pr-10'
              />
              <button
                type='button'
                onClick={() => setShowConfirm(v => !v)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors'
              >
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='mt-1 text-xs text-red-500'>{errors.confirmPassword}</p>
            )}
          </div>

          {/* Server error */}
          {error && (
            <p className='mb-4 text-sm text-red-500 text-center'>{error}</p>
          )}

          {/* Submit */}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-black text-white py-3 rounded-md font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </button>
        </form>

        <div className='mt-5 text-center text-sm text-gray-500'>
                    Đã có tài khoản?{' '}
          <button
            type='button'
            onClick={() => navigate('/')}
            className='text-black font-semibold underline hover:text-gray-700 transition'
          >
                        Đăng nhập
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage