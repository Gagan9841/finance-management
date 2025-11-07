import { api } from '@/utils/apiRequest'
import type { User } from '@/types/user'

export const getUsers = async (params: Record<string, unknown>) => {
  const response = await api.get('user', { params })
  return response.data as User[]
}
