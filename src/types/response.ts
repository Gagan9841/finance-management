export interface ApiResponse<T> extends Response {
  message?: string
  data: T
  errors?: { [key: string]: string[] }
}
