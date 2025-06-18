import type { ApiResponse } from '@/types/response'
import type { AxiosResponse } from 'axios'
import { toast } from 'vue-sonner'

export interface Toast {
  id: number
  title: string
  description: string
  type: 'success' | 'internal_error' | 'server_error' | 'info'
  errors?: Record<string, string[]>
}

let nextId = 1

export function useToast<T>() {
  /**
   * Formats field-specific errors into a single string.
   */
  const formatErrorMessages = (errors: Record<string, string[]>): string => {
    return Object.entries(errors)
      .map(([field, messages]) => {
        const formattedField = field
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        return `${formattedField}: ${messages.join(', ')}`
      })
      .join('\n')
  }

  /**
   * Gets appropriate title based on toast type and status code
   */
  const getTitleByType = (type: Toast['type'], status?: number): string => {
    if (status) {
      switch (type) {
        case 'success':
          return `Success`
        case 'internal_error':
          return `Client Error - ${status}`
        case 'server_error':
          return `Server Error - ${status}`
        case 'info':
          return `Info (${status})`
        default:
          return 'Information'
      }
    }
    switch (type) {
      case 'success':
        return 'Success'
      case 'internal_error':
        return 'Error Occurred'
      case 'server_error':
        return 'Server Error'
      case 'info':
      default:
        return 'Information'
    }
  }

  /**
   * Creates toast data from a response or string.
   */
  const createToastData = (
    response: AxiosResponse<ApiResponse<T>> | string,
    type: Toast['type'],
  ): Toast => {
    if (typeof response === 'string') {
      return {
        id: nextId++,
        title: getTitleByType(type),
        description: response,
        type,
      }
    }

    const { data, status } = response
    const title = getTitleByType(type, status)
    const description =
      data.message ||
      (type === 'success' ? 'Operation completed successfully' : 'An error occurred')

    return {
      id: nextId++,
      title,
      description,
      type,
      errors: data.errors,
    }
  }

  /**
   * Shows the appropriate toast based on type using vue-sonner methods
   */
  const showToastByType = (
    title: string,
    description: string,
    type: Toast['type'],
    duration: number = 2000,
  ) => {
    const toastOptions = {
      description,
      duration,
    }

    switch (type) {
      case 'success':
        toast.success(title, {
          ...toastOptions,
          style: {
            backgroundColor: 'var(--success)',
            color: 'var(--success-foreground)',
            border: '1px solid var(--success-foreground)',
          },
        })
        break
      case 'internal_error':
      case 'server_error':
        toast.error(title, {
          ...toastOptions,
          style: {
            backgroundColor: 'var(--destructive)',
            color: 'var(--destructive-foreground)',
            border: '1px solid var(--destructive-foreground)',
          },
        })
        break
      case 'info':
      default:
        toast.info(title, {
          ...toastOptions,
          style: {
            backgroundColor: 'var(--info)',
            color: 'var(--info-foreground)',
            border: '1px solid var(--info-foreground)',
          },
        })
        break
    }
  }

  /**
   * Shows a toast message.
   */
  const showToast = (
    response: AxiosResponse<ApiResponse<T>> | string,
    type: Toast['type'] = 'info',
    duration: number = 2000,
  ) => {
    const toastData = createToastData(response, type)
    showToastByType(toastData.title, toastData.description, type, duration)
  }

  /**
   * Shows a toast for field-specific errors.
   * @param errors - The errors object from CustomError.
   * @param response - Optional AxiosResponse to extract title and fallback message.
   * @param duration - Duration of the toast in milliseconds (default: 2000).
   */
  const showErrorToast = (
    errors: Record<string, string[]>,
    response?: AxiosResponse<ApiResponse<T>>,
    duration: number = 2000,
  ) => {
    const formattedErrors = formatErrorMessages(errors)

    const title =
      response?.data?.message ||
      response?.statusText ||
      getTitleByType('internal_error', response?.status)

    const description = formattedErrors || response?.data?.message || 'An error occurred'

    toast.error(title, {
      description,
      duration,
    })
  }

  /**
   * Clears all toasts - vue-sonner provides toast.dismiss() for this
   */
  const clearToasts = () => {
    toast.dismiss()
  }

  return {
    showToast,
    clearToasts,
    showErrorToast,
  }
}
