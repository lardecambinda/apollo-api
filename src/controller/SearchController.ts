import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default {
  async search(request: Request, response: Response) {
    const { term } = request.params
    const { month, year, tag } = request.query

    if (!term) return response.status(400).json({ error_message: 'term is required' })

    const where: any = {
      OR: [
        { title: { contains: term, mode: 'insensitive' } },
        { content: { contains: term, mode: 'insensitive' } },
        { tags: { has: term } },
      ]
    }

    if (tag) where.tags = { has: tag as string }

    if (month || year) {
      const m = month ? parseInt(month as string) : undefined
      const y = year ? parseInt(year as string) : new Date().getFullYear()

      if (m) {
        const start = new Date(y, m - 1, 1)
        const end = new Date(y, m, 1)
        where.meeting_date = { gte: start, lt: end }
      } else {
        const start = new Date(y, 0, 1)
        const end = new Date(y + 1, 0, 1)
        where.meeting_date = { gte: start, lt: end }
      }
    }

    const posts = await prisma.posts.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        status: true,
        meeting_date: true,
        createdAt: true,
        users: { select: { id: true, user_name: true } }
      }
    })

    return response.status(200).json({ posts })
  }
}
