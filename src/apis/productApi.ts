import axiosClient from './axiosClient'

import type { Product } from '~/types/product'

export interface Category {
  category_id: number
  category_name: string
  category_slug: string
}

const productApi = {
  getAll: () => axiosClient.get<Product[]>('/products'),
  getById: (id: number) => axiosClient.get<Product>(`/products/${id}`),
  create: (data: Partial<Product>) => axiosClient.post<Product>('/products', data),
  update: (id: number, data: Partial<Product>) => axiosClient.put<Product>(`/products/${id}`, data),
  delete: (id: number) => axiosClient.delete<{ message: string }>(`/products/${id}`),
  getCategories: () => axiosClient.get<Category[]>('/categories')
}

export default productApi
