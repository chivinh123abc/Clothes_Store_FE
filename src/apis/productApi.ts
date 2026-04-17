import axiosClient from './axiosClient'

import type { Product } from '~/types/product'

const productApi = {
  getAll: () => axiosClient.get<Product[]>('/product'),
  getById: (id: number) => axiosClient.get<Product>(`/product/${id}`),
  create: (data: Partial<Product>) => axiosClient.post<Product>('/product', data),
  update: (id: number, data: Partial<Product>) => axiosClient.put<Product>(`/product/${id}`, data),
  delete: (id: number) => axiosClient.delete<{ message: string }>(`/product/${id}`),
  getByCollectionSlug: (slug: string) => axiosClient.get<Product[]>(`/product/collection/${slug}`)
}

export default productApi
