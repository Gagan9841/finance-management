export interface User {
  id: number
  email: string
  name: string
  avatar?: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface RegisterUser {
  name: string
  email: string
  password: string
  password_confirmation: string
}
