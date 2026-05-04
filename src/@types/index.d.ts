import { Posts, Users } from '@prisma/client'
import { Request } from 'express';

export interface CustomRequest extends Request {
  params: {
    id: string
    user_id: string
  }
  body: {
    user: Users,
    post: Posts,
    category?: any,
    user_id?: string,
  }
  user?: {
    id: string
    role: string
    user_id?: string
  }
  loggedUserId?: string
  loggedUserRole?: string
}
