import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { CustomRequest } from '../@types'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const userSelect = {
  password: false,
  id: true,
  email: true,
  user_name: true,
  role: true,
  active: true,
}

export default {
  async store(request: CustomRequest, response: Response) {
    const { email, password, user_name, role } = request.body.user

    if (!email || !user_name || !password || !role) {
      return response.status(401).json({ error_message: 'All body properties are required' })
    }

    const userExist = await prisma.users.findUnique({ where: { email } })
    if (userExist) return response.status(401).json({ error_message: 'email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.users.create({
      data: { email, password: hashedPassword, user_name, role }
    })

    const userReturned = await prisma.users.findUnique({
      where: { email },
      select: userSelect
    })

    return response.status(201).json(userReturned)
  },

  async findAll(request: CustomRequest, response: Response) {
    const users = await prisma.users.findMany({ select: userSelect })
    return response.status(200).json(users)
  },

  async findOne(request: CustomRequest, response: Response) {
    const { id } = request.params

    // EDITOR só pode ver seus próprios dados
    if (request.user?.role === 'EDITOR' && request.user.id !== id) {
      return response.status(403).json({ error_message: 'Você não tem permissão para ver este usuário' })
    }

    const user = await prisma.users.findFirst({
      where: { id },
      select: userSelect
    })

    return response.status(200).json(user)
  },

  async update(request: CustomRequest, response: Response) {
    const { id } = request.params
    const { email, user_name, password, role } = request.body.user

    const user = await prisma.users.findUnique({ where: { id } })
    if (!user) return response.status(404).json({ error_message: 'user not found' })

    const data: any = { email, user_name, role }
    if (password) data.password = await bcrypt.hash(password, 10)

    const updated = await prisma.users.update({
      where: { id },
      data,
      select: userSelect
    })

    return response.status(200).json(updated)
  },

  async destroy(request: CustomRequest, response: Response) {
    const { id } = request.params

    const user = await prisma.users.findUnique({ where: { id } })
    if (!user) return response.status(404).json({ error_message: 'user not found' })

    await prisma.posts.deleteMany({ where: { user_id: id } })
    await prisma.users.delete({ where: { id } })

    return response.status(204).send()
  },

  async toggle(request: CustomRequest, response: Response) {
    const { id } = request.params

    const user = await prisma.users.findUnique({ where: { id } })
    if (!user) return response.status(404).json({ error_message: 'user not found' })

    const updated = await prisma.users.update({
      where: { id },
      data: { active: !user.active },
      select: userSelect
    })

    return response.status(200).json(updated)
  }
}
