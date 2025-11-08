export interface Payable {
  id: number
  name: string
  description: string
  notes?: string
  priority?: number
  type?: string
  account_id?: string
  status: number
  created_by?: number
  updated_by?: number
  created_at?: string
  updated_at?: string
}
