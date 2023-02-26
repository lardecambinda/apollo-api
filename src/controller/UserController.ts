import { Response } from 'express'
import { PrismaClient, } from '@prisma/client'
import { CustomRequest } from '../@types'

const prisma = new PrismaClient()

export default {
  async store(request: CustomRequest, response: Response) {
    const { email, password, user_name, role } = request.body.user

    if (!email || !user_name || !password || !role) {
      response.status(401).json({ error_message: 'All body properties are required' })
    }

    console.log(email)

    const userExist = await prisma.users.findUnique({ where: { email: email } })

    if (userExist) return response.status(401).json({ error_message: 'email already exists' })

    await prisma.users.create({
      data: {
        email,
        password,
        user_name,
        role,
      },
    })

    const userReturned = await prisma.users.findUnique({
      where: {
        email: email
      },
      select: {
        password: false,
        id: true,
        email: true,
        user_name: true,
        role: true,
      }
    })

    response.status(201).json(userReturned)

  },
  async findAll(request: CustomRequest, response: Response) {
    const users = await prisma.users.findMany({
      select: {
        password: false,
        id: true,
        email: true,
        user_name: true,
        role: true,
      }
    })
    return response.status(200).json(users)
  },
  async findOne(request: CustomRequest, response: Response) {
    const { user_id } = request.params

    const users = await prisma.users.findFirst({
      where: {
        id: user_id
      },
      select: {
        password: false,
        id: true,
        email: true,
        user_name: true,
        role: true,
      }
    })

    return response.status(200).json(users)
  }
}