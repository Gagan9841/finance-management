import { api } from '@/utils/apiRequest'
import type { Payable } from '@/types/payable'

export const getPayables = async (params: Record<string, unknown>) => {
  const response = await api.get('payables', { params })
  return response.data as Payable[]
}

export const createPayable = async (data: Record<string, unknown>) => {
  const response = await api.post('payables', data)
  return response.data as Payable
}

export const updatePayable = async (id: string, data: Record<string, unknown>) => {
  const response = await api.put(`payables/${id}`, data)
  return response.data as Payable
}

export const deletePayable = async (id: string) => {
  const response = await api.delete(`payables/${id}`)
  return response.data as Payable
}

export const getPayableById = async (id: string) => {
  const response = await api.get(`payables/${id}`)
  return response.data as Payable
}
