import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { CustomRequest } from '../@types'

const prisma = new PrismaClient()

export default {
  async store(request: CustomRequest, response: Response) {
    const { title, content, user_id } = request.body.post

    if (!title || !content) return response.status(401).json({
      error_message: 'title and content properties are required'
    })

    // const createPost = repository.create({ title, content, files, user })

    const userExists = await prisma.users.findUnique({ where: { id: user_id }})

    if(!userExists) return response.status(404).json({ error_message: "User Doesn't exists"})

    const createPost = await prisma.posts.create({
      data: {
        title, content, user_id
      }
    })

    return response.status(201).json(createPost)
  },
  async findAll(_: any, response: Response) {
    const posts = await prisma.posts.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        files: true,
        user_id: true,
        comments: true,
        users: {
          select: {
            id: true,
            user_name: true
          }
        }
      }
    })
    return response.status(200).json(posts)
  }
}