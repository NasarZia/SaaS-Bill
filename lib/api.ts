import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Unwrap backend format { success, data, message } and handle errors
api.interceptors.response.use(
  (response) => {
    // Backend returns { success, data, message } - unwrap so callers get data directly
    if (response.data && response.data.success === true && response.data.data !== undefined) {
      response.data = response.data.data
    }
    return response
  },
  (error) => {
    // Handle 401 Unauthorized - clear auth and redirect
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    // Backend errors: { success: false, error: { code, message, details } }
    const errMessage = error.response?.data?.error?.message || error.response?.data?.message || error.message
    if (errMessage) {
      useAuthStore.getState().setError(errMessage)
    }

    return Promise.reject(error)
  }
)

export default api

// Export common API methods
export const apiClient = {
  get: (url: string, config?: any) => api.get(url, config),
  post: (url: string, data?: any, config?: any) => api.post(url, data, config),
  put: (url: string, data?: any, config?: any) => api.put(url, data, config),
  patch: (url: string, data?: any, config?: any) => api.patch(url, data, config),
  delete: (url: string, config?: any) => api.delete(url, config),
}
