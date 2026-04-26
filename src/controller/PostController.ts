import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { CustomRequest } from '../@types'

const prisma = new PrismaClient()

export default {
  async store(request: CustomRequest, response: Response) {
    const { title, content, files, user_id } = request.body.post

    if (!title || !content) return response.status(401).json({
      error_message: 'title and content properties are required'
    })

    const createPost = await prisma.posts.create({
      data: { title, content, files, user_id }
    })

    return response.status(201).json(createPost)
  },

  async findAll(request: Request, response: Response) {
    const posts = await prisma.posts.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        files: true,
        tags: true,
        user_id: true,
        createdAt: true,
        updatedAt: true,
        comments: true,
        users: {
          select: { id: true, user_name: true }
        }
      }
    })
    return response.status(200).json(posts)
  },

  async update(request: CustomRequest, response: Response) {
    const { id } = request.params
    const { title, content, files, tags } = request.body.post

    const post = await prisma.posts.findUnique({ where: { id } })
    if (!post) return response.status(404).json({ error_message: 'post not found' })

    const updated = await prisma.posts.update({
      where: { id },
      data: { title, content, files, tags }
    })

    return response.status(200).json(updated)
  },

  async destroy(request: CustomRequest, response: Response) {
    const { id } = request.params

    const post = await prisma.posts.findUnique({ where: { id } })
    if (!post) return response.status(404).json({ error_message: 'post not found' })

    await prisma.comments.deleteMany({ where: { post_id: id } })
    await prisma.posts.delete({ where: { id } })

    return response.status(204).send()
  }
}
