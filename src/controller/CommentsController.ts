import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { CustomRequest } from '../@types'

const prisma = new PrismaClient()

export default {
  async store(request: CustomRequest, response: Response) {

    const { comment, user_id, post_id } = request.body.comment

    if (!comment || !user_id || !post_id) {
      return response.status(401).json({
        error_message: 'comment, user and post properties are required'
      })
    }

    const user = await prisma.users.findFirst({ where: { id: user_id } })

    if (!user) {
      return response.status(401).json({
        error_message: 'user not exists'
      })
    } else if (!post_id) {
      return response.status(401).json({
        error_message: 'post not exists'
      })
    }

    const createComment = await prisma.comments.create({
      data: {
        comment,
        post_id,
        user_id
      },
      select: {
        user: {
          select: {
            password: false,
            posts: true,
            id: true,
            email: true,
            user_name: true,
            role: true,
          }
        }
      }
    })

    return response.status(201).json(createComment)
  }
}