export interface LoginRequestDto {
  email: string
  password: string
}

export interface RegisterRequestDto {
  username: string
  email: string
  password: string
  phone_number?: string
}

export interface UserResponseDto {
  user_id: number
  username: string
  email: string
  is_active: boolean
  created_at: string
}

export interface AuthResponseDto extends UserResponseDto {
  accessToken: string
  refreshToken: string
}
