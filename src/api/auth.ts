import { api } from '@/utils/apiRequest'
import type { RegisterUser, User } from '@/types/user'
import { useResponse } from '@/composables/useResponse'

export const register = async (data: RegisterUser) => {
  const { handleResponse } = useResponse<RegisterUser>()
  const response = await api.post('auth/register', data)
  return handleResponse(response)
}

export const login = async (data: User) => {
  const { handleResponse } = useResponse<User>()
  const response = await api.post('auth/login', data)
  return handleResponse(response)
}
