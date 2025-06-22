export interface Statistics {
  title: string
  value: string
  icon: string
}

export interface RecentTransaction {
  id: number
  name: string
  company: string
  type: string
  amount: string
  date: string
  icon: string
}

export interface ScheduledTransfer {
  id: number
  name: string
  date: string
  amount: string
  avatar: string
}
