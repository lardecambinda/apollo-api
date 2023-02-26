import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { CustomRequest } from '../@types'

const prisma = new PrismaClient()

export default {
  async store(request: CustomRequest, response: Response) {

    const { comment, users_id, posts_id } = request.body.comment

    if (!comment || !users_id || !posts_id) {
      return response.status(401).json({
        error_message: 'comment, user and post properties are required'
      })
    }

    const user = await prisma.users.findFirst({ where: { id: users_id } })

    if (!user) {
      return response.status(401).json({
        error_message: 'user not exists'
      })
    } else if (!posts_id) {
      return response.status(401).json({
        error_message: 'post not exists'
      })
    }

    const createComment = await prisma.comments.create({
      data: {
        comment,
        posts_id,
        users_id
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