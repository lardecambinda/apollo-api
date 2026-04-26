import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { CustomRequest } from '../@types'

const prisma = new PrismaClient()

export default {
  async store(request: CustomRequest, response: Response) {
    const { comment, user_id, post_id } = request.body.comment

    if (!comment || !user_id || !post_id) {
      return response.status(401).json({
        error_message: 'comment, user_id and post_id are required'
      })
    }

    const user = await prisma.users.findFirst({ where: { id: user_id } })
    if (!user) return response.status(401).json({ error_message: 'user not found' })

    const createComment = await prisma.comments.create({
      data: { comment, post_id, user_id },
      select: {
        id: true,
        comment: true,
        post_id: true,
        user: {
          select: { id: true, email: true, user_name: true, role: true }
        }
      }
    })

    return response.status(201).json(createComment)
  },

  async findAll(request: Request, response: Response) {
    const comments = await prisma.comments.findMany({
      select: {
        id: true,
        comment: true,
        post_id: true,
        user: {
          select: { id: true, user_name: true }
        }
      }
    })
    return response.status(200).json(comments)
  },

  async destroy(request: CustomRequest, response: Response) {
    const { id } = request.params

    const comment = await prisma.comments.findUnique({ where: { id } })
    if (!comment) return response.status(404).json({ error_message: 'comment not found' })

    await prisma.comments.delete({ where: { id } })

    return response.status(204).send()
  }
}
