import { CustomError } from '@/utils/error'
import type { AxiosResponse, AxiosError } from 'axios'
import { useToast, type Toast } from '@/composables/useToast'
import type { ApiResponse } from '@/types/response'
import { reactive } from 'vue'

export function useResponse<T>() {
  const toast = useToast()
  const customError = reactive(new CustomError())

  /**
   * Determines the toast type based on the HTTP status code.
   */
  const getToastTypeFromStatusCode = (status: number): Toast['type'] => {
    if (status >= 200 && status < 300) {
      return 'success' // Success codes (2xx)
    } else if (status >= 400 && status < 500) {
      return 'internal_error' // Client errors (4xx)
    } else if (status >= 500) {
      return 'server_error' // Server errors (5xx)
    } else {
      return 'info' // Default for other cases (e.g., redirects, etc.)
    }
  }

  /**
   * Handles successful API responses.
   */
  const handleResponse = async (response: AxiosResponse<ApiResponse<T>>) => {
    const status = response.status
    const toastType = getToastTypeFromStatusCode(status)

    customError.clear()
    if (response.data?.message || toastType === 'success') {
      toast.showToast(response, toastType)
    }
    return response
  }

  /**
   * Handles API errors.
   */
  const handleError = (err: AxiosError<ApiResponse<T>>) => {
    const response = err.response

    customError.clear()

    if (response) {
      const status = response.status
      const toastType = getToastTypeFromStatusCode(status)

      if (response.data?.errors) {
        customError.record({ errors: response.data.errors })
        toast.showErrorToast(response.data.errors, response, 2000)
      } else {
        const message = response.data?.message || `Error ${status}: Request failed`
        toast.showToast(message, toastType)
      }
    } else {
      const message = 'Network error. Please check your connection.'
      customError.add('network', message)
      toast.showToast(message, 'server_error')
    }
    throw err
  }

  const clearError = () => {
    customError.clear()
  }

  return {
    handleResponse,
    handleError,
    clearError,
    customError,
  }
}
