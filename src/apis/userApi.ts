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
  logout: async (): Promise<void> => {
    const response = await axiosClient.delete<void>('/user/logout')
    return response.data
  },
  refreshToken: async (): Promise<AuthResponseDto> => {
    const response = await axiosClient.get<AuthResponseDto>('/user/refresh_token')
    return response.data
  }
}
