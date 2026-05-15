import axiosClient from './axiosClient'

export const orderApi = {
  getAllOrders: async () => {
    const response = await axiosClient.get('/order/all')
    return response.data
  },
  updateOrderStatus: async (orderId: number, status?: string, payment_status?: string) => {
    const response = await axiosClient.put('/order', { 
      order_id: orderId, 
      status, 
      payment_status 
    })
    return response.data
  },
  deleteOrder: async (orderId: number) => {
    const response = await axiosClient.delete(`/order/${orderId}`)
    return response.data
  },
  getOrderDetails: async (orderId: number) => {
    const response = await axiosClient.get(`/order/${orderId}`)
    return response.data
  }
}
