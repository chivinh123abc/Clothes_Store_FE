import axiosClient from './axiosClient'

export const reviewApi = {
  create: (data: { product_id: number; rating: number; text: string; image_url?: string }) =>
    axiosClient.post('/reviews', data),
  getByProductId: (productId: number) =>
    axiosClient.get(`/reviews/product/${productId}`),
  getAll: () =>
    axiosClient.get('/reviews'),
  update: (id: number, data: { rating: number; text: string; image_url?: string }) =>
    axiosClient.put(`/reviews/${id}`, data),
  delete: (id: number) =>
    axiosClient.delete(`/reviews/${id}`),
  uploadImage: (data: { file: string }) =>
    axiosClient.post('/user/upload-review', data)
}
