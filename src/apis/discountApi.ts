import axiosClient from './axiosClient'

export interface Discount {
  discount_id: number
  name: string
  discount_percent: number
  created_at: string
  updated_at: string
}

const discountApi = {
  getAll: () => axiosClient.get<Discount[]>('/discount'),
  getById: (id: number) => axiosClient.get<Discount>(`/discount/${id}`),
  create: (data: Partial<Discount>) => axiosClient.post<Discount>('/discount', data),
  update: (id: number, data: Partial<Discount>) => axiosClient.put<Discount>(`/discount/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/discount/${id}`)
}

export default discountApi
