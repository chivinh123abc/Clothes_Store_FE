import axiosClient from './axiosClient'

export const orderApi = {
  getAllOrders: async () => {
    const response = await axiosClient.get('/order/all')
    return response.data
  },
  getOrdersByUserId: async (userId: number) => {
    const response = await axiosClient.get(`/order/user/${userId}`)
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
  cancelOrder: async (orderId: number) => {
    const response = await axiosClient.put(`/order/cancel/${orderId}`)
    return response.data
  },
  createMoMoPayment: async (orderId: number, amount: number) => {
    const response = await axiosClient.post('/payment/momo/create', {
      order_id: orderId,
      amount: amount
    })
    return response.data
  },
  confirmMoMoPayment: async (orderId: number) => {
    const response = await axiosClient.post('/payment/momo/confirm', {
      order_id: orderId
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
  },
  createOrder: async (orderData: {
    user_id: number;
    total_amount: number;
    payment_method?: string;
    payment_status?: string;
    comment?: string;
  }) => {
    const response = await axiosClient.post('/order', orderData)
    return response.data
  },
  createOrderItem: async (itemData: {
    order_id: number;
    product_item_id: number;
    quantity: number;
  }) => {
    const response = await axiosClient.post('/order_item', itemData)
    return response.data
  }
}
