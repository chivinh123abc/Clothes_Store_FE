import axiosClient from './axiosClient'
import type { LoginRequestDto, RegisterRequestDto, AuthResponseDto, UserResponseDto } from '../types/user'

export const userApi = {
  login: async (data: LoginRequestDto): Promise<AuthResponseDto> => {
    const response = await axiosClient.post<AuthResponseDto>('/user/login', data)
    return response.data
  },
  register: async (data: RegisterRequestDto): Promise<AuthResponseDto> => {
    const response = await axiosClient.post<AuthResponseDto>('/user/register', data)
    return response.data
  },
  info: async (): Promise<UserResponseDto> => {
    const response = await axiosClient.get<UserResponseDto>('/user/info')
    return response.data
  },
  updateProfile: async (data: any): Promise<UserResponseDto> => {
    const response = await axiosClient.put<UserResponseDto>('/user/update', data)
    return response.data
  },
  changePassword: async (password: string): Promise<UserResponseDto> => {
    const response = await axiosClient.put<UserResponseDto>('/user/update', { password })
    return response.data
  },
  logout: async (): Promise<void> => {
    const response = await axiosClient.delete<void>('/user/logout')
    return response.data
  },
  refreshToken: async (): Promise<AuthResponseDto> => {
    const response = await axiosClient.get<AuthResponseDto>('/user/refresh_token')
    return response.data
  },
  // Admin functions
  getUsers: async (): Promise<UserResponseDto[]> => {
    const response = await axiosClient.get<UserResponseDto[]>('/admin/users')
    return response.data
  },
  adminUpdate: async (id: number, data: any): Promise<UserResponseDto> => {
    const response = await axiosClient.put<UserResponseDto>(`/admin/users/${id}`, data)
    return response.data
  },
  adminCreate: async (data: any): Promise<UserResponseDto> => {
    const response = await axiosClient.post<UserResponseDto>('/admin/users', data)
    return response.data
  },
  adminDelete: async (id: number): Promise<{ success: boolean }> => {
    const response = await axiosClient.delete<{ success: boolean }>(`/admin/users/${id}`)
    return response.data
  },
  verifyAccount: async (data: { email: string, verify_token: string }): Promise<any> => {
    const response = await axiosClient.post('/user/verify-account', data)
    return response.data
  },
  resendVerification: async (email: string): Promise<any> => {
    const response = await axiosClient.post('/user/resend-verification', { email })
    return response.data
  }
}
