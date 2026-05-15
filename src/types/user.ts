export interface LoginRequestDto {
  identifier: string
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
  role: number
  is_active: boolean
  avatar?: string | null
  phone_number?: string | null
  created_at: string
  status: number
  address?: string | null
  display_name?: string | null
  full_name?: string | null
}

export interface AuthResponseDto extends UserResponseDto {
  access_token: string
  refresh_token: string
}
