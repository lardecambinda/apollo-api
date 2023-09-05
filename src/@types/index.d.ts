import { Comments, File, Posts, Role, Users } from '@prisma/client'
import { Request } from 'express';

export interface CustomRequest extends Request {
  params: {
    user_id: string
  }
  body: {
    user: Users,
    post: Posts,
    file: File
    comment: Comments
  },
  loggedUserId: string
  loggedUserRole: string
}
