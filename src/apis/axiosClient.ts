import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL as string

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

let isRefreshing = false
// eslint-disable-next-line no-unused-vars
let refreshSubscribers: ((token: string) => void)[] = []

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

// eslint-disable-next-line no-unused-vars
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')

    // QUAN TRỌNG: Kiểm tra token !== 'undefined' vì nếu trước đó có lỗi logic lưu nhầm chuỗi "undefined" vào localStorage,
    // thì axiosClient sẽ gửi `Authorization: Bearer undefined` lên server, gây lỗi 401 hoặc lỗi giải mã JWT
    if (token && token !== 'undefined') {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  (response) => {
    // eslint-disable-next-line no-console
    console.log(`✅ Connection with BE success from FE! Request: ${response.config.url}`)
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 410 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            resolve(axiosClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await axios.get(`${baseURL}/user/refresh_token`, {
          withCredentials: true
        })

        const newToken = res.data.access_token
        localStorage.setItem('access_token', newToken)

        isRefreshing = false
        onRefreshed(newToken)

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        return axiosClient(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        refreshSubscribers = []
        localStorage.removeItem('auth_user')
        localStorage.removeItem('access_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default axiosClient
