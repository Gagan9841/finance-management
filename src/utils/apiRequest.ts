import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { useLoadingStore } from '@/stores/loadingStore'
import router from '@/router'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipGlobalLoading?: boolean
  skipAuth?: boolean
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1' || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const { startLoading } = useLoadingStore()
    const { token } = useAuthStore()

    if (!config.skipGlobalLoading) {
      startLoading()
    }

    if (!config.skipAuth && token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    const { stopLoading } = useLoadingStore()
    stopLoading()
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    const { stopLoading } = useLoadingStore()
    const config = response.config as CustomAxiosRequestConfig

    if (!config.skipGlobalLoading) {
      stopLoading()
    }

    return response
  },
  (error: AxiosError) => {
    const { stopLoading } = useLoadingStore()
    const { logout } = useAuthStore()

    stopLoading()

    if (error.response?.status === 401) {
      logout()
      router.push('/login')
    }

    return Promise.reject(error)
  },
)

export { api }
export type { CustomAxiosRequestConfig }
