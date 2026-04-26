import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default {
  async search(request: Request, response: Response) {
    const { term } = request.params

    if (!term) return response.status(400).json({ error_message: 'term is required' })

    const posts = await prisma.posts.findMany({
      where: {
        OR: [
          { title: { contains: term, mode: 'insensitive' } },
          { content: { contains: term, mode: 'insensitive' } },
          { tags: { has: term } },
        ]
      },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        createdAt: true,
        users: { select: { id: true, user_name: true } }
      }
    })

    return response.status(200).json({ posts })
  }
}
