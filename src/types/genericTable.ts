import type { AxiosError } from 'axios'
import type { ApiResponse } from './response'

export interface PaginationResponse<T> {
  data: T[]
  current_page: number
  total: number
  per_page: number
  last_page?: number
  from?: number
  to?: number
  [key: string]: any
}

export interface PaginationOptions {
  defaultPerPage?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  autoLoad?: boolean
  debounceDelay?: number
  onError?: (error: AxiosError<ApiResponse<unknown>>) => void
}
