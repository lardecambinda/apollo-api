import { Comments, Posts, Users } from '@prisma/client'
import { Request } from 'express';

export interface CustomRequest extends Request {
  params: {
    user_id: string
  }
  body: {
    user: Users,
    post: Posts,
    comment: Comments
  }
}
