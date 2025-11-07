import { ref, watch, onUnmounted } from 'vue'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/types/response'
import debounce from '@/utils/debounce'
import type { PaginationOptions, PaginationResponse } from '@/types/genericTable'

const defaultErrorHandler = (error: AxiosError<ApiResponse<unknown>>) => {
  console.error('Pagination error:', error)
}

export function usePagination<T>(
  fetchFunction: (params: Record<string, unknown>) => Promise<PaginationResponse<T> | T[]>,
  handleError: (error: AxiosError<ApiResponse<T>>) => void = defaultErrorHandler,
  options: PaginationOptions = {},
) {
  const {
    defaultPerPage = 10,
    sortBy = 'created_at',
    sortOrder = 'desc',
    autoLoad = true,
    debounceDelay = 300,
    onError,
  } = options

  const currentPage = ref(1)
  const perPage = ref(defaultPerPage)
  const totalItems = ref(0)
  const items = ref<T[]>([])
  const isLoading = ref(false)
  const lastPage = ref(1)
  const hasError = ref(false)
  const isPaginated = ref(true)
  const from = ref(0)
  const to = ref(0)

  const getBaseParams = () => ({
    page: currentPage.value,
    per_page: perPage.value,
    sort_by: sortBy,
    sort_order: sortOrder,
  })

  const loadPage = debounce(
    async (
      page: number = currentPage.value,
      itemsPerPage: number = perPage.value,
      customParams: Record<string, unknown> = {},
    ): Promise<T[] | undefined> => {
      isLoading.value = true
      hasError.value = false
      try {
        const params = {
          ...getBaseParams(),
          page,
          per_page: itemsPerPage,
          ...customParams,
        }

        const response = await fetchFunction(params)
        if (Array.isArray(response)) {
          isPaginated.value = false
          items.value = response
          totalItems.value = response.length
          currentPage.value = 1
          lastPage.value = 1
        } else {
          isPaginated.value = true
          items.value = response.data
          currentPage.value = response.current_page
          perPage.value = response.per_page
          totalItems.value = response.total
          lastPage.value = response.last_page ?? Math.ceil(response.total / response.per_page)
          from.value = response.from || (response.current_page - 1) * response.per_page + 1
          to.value =
            response.to || Math.min(response.current_page * response.per_page, response.total)
        }

        return items.value as T[]
      } catch (error) {
        hasError.value = true
        handleError(error as AxiosError<ApiResponse<T>>)
        onError?.(error as AxiosError<ApiResponse<T>>)
      } finally {
        isLoading.value = false
      }
    },
    debounceDelay,
  )

  const refresh = () => loadPage(currentPage.value, perPage.value)

  const reset = (customParams: Record<string, unknown> = {}) => {
    currentPage.value = 1
    perPage.value = defaultPerPage
    totalItems.value = 0
    items.value = []
    hasError.value = false
    loadPage.cancel()
    return loadPage(1, defaultPerPage, customParams)
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= lastPage.value) {
      return loadPage(page)
    }
    return Promise.resolve(items.value)
  }
  const nextPage = () => goToPage(currentPage.value + 1)
  const prevPage = () => goToPage(currentPage.value - 1)
  const hasNextPage = () => currentPage.value < lastPage.value
  const hasPrevPage = () => currentPage.value > 1

  watch([currentPage, perPage], () => {
    if (isPaginated.value) loadPage()
  })

  watch(perPage, (newPerPage) => {
    if (isPaginated.value) loadPage(1, newPerPage)
  })

  if (autoLoad) loadPage()

  onUnmounted(() => loadPage.cancel())

  return {
    currentPage,
    perPage,
    totalItems,
    items,
    isLoading,
    lastPage,
    hasError,
    isPaginated,
    loadPage,
    refresh,
    reset,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
  }
}
