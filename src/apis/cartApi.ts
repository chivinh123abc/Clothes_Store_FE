import axiosClient from './axiosClient'

export const cartApi = {
  getMyCart: () =>
    axiosClient.get('/cart/my-cart'),
  addItem: (data: { product_id: number; size: string; quantity: number }) =>
    axiosClient.post('/cart/add-item', data),
  updateQuantity: (data: { product_id: number; size: string; quantity: number }) =>
    axiosClient.put('/cart/update-item', data),
  removeItem: (data: { product_id: number; size: string }) =>
    axiosClient.delete('/cart/delete-item', { data }),
  syncCart: (data: { items: any[] }) =>
    axiosClient.post('/cart/sync-cart', data),
  clearCart: () =>
    axiosClient.post('/cart/clear'),
  changeSize: (data: { product_id: number; old_size: string; new_size: string }) =>
    axiosClient.put('/cart/change-size', data)
}
