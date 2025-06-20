import { api } from '@/utils/apiRequest'

export const getDashboardData = async () => {
  const response = await api.get('base/dashboard')
  return response
}
