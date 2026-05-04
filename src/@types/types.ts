export interface ICategory {
  id: string
  name: string
  user_id: string
  status: string
  createdAt: Date
}

export interface INotification {
  id: string
  post_id: string
  user_id: string
  message: string
  read: boolean
  createdAt: Date
}
