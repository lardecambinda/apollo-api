import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { CustomRequest } from '../@types'

const prisma = new PrismaClient()

export const CategoryController = {
  async store(request: CustomRequest, response: Response) {
    const { name } = request.body.category

    const exists = await prisma.categories.findUnique({ where: { name } })
    if (exists) return response.status(400).json({ error_message: 'Categoria já existe' })

    // Se EDITOR, status PENDING; se ADMIN, status APPROVED
    const status = request.user?.role === 'EDITOR' ? 'PENDING' : 'APPROVED'

    const category = await prisma.categories.create({ 
      data: { 
        name, 
        user_id: request.user!.id,
        status 
      } 
    })

    // Se EDITOR, notificar ADMINs
    if (request.user?.role === 'EDITOR') {
      const admins = await prisma.users.findMany({ where: { role: 'ADMIN' } })
      for (const admin of admins) {
        await prisma.notifications.create({
          data: {
            user_id: admin.id,
            message: `Nova categoria "${name}" aguardando aprovação`,
            post_id: ''
          }
        })
      }
    }

    return response.status(201).json(category)
  },

  async findAll(request: CustomRequest, response: Response) {
    const categories = await prisma.categories.findMany({ 
      orderBy: { name: 'asc' },
      include: { users: { select: { id: true, user_name: true } } }
    })
    return response.status(200).json(categories)
  },

  async update(request: CustomRequest, response: Response) {
    const { id } = request.params
    const { name, status } = request.body.category

    const category = await prisma.categories.findUnique({ where: { id } })
    if (!category) return response.status(404).json({ error_message: 'Categoria não encontrada' })

    // EDITOR só pode editar suas próprias categorias
    if (request.user?.role === 'EDITOR' && category.user_id !== request.user.id) {
      return response.status(403).json({ error_message: 'Você não tem permissão para editar esta categoria' })
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    
    // Apenas ADMIN pode alterar status
    if (request.user?.role === 'ADMIN' && status !== undefined) {
      updateData.status = status
    }

    const updated = await prisma.categories.update({ where: { id }, data: updateData })
    return response.status(200).json(updated)
  },

  async destroy(request: CustomRequest, response: Response) {
    const { id } = request.params

    const category = await prisma.categories.findUnique({ where: { id } })
    if (!category) return response.status(404).json({ error_message: 'Categoria não encontrada' })

    // EDITOR só pode deletar suas próprias categorias
    if (request.user?.role === 'EDITOR' && category.user_id !== request.user.id) {
      return response.status(403).json({ error_message: 'Você não tem permissão para deletar esta categoria' })
    }

    await prisma.categories.delete({ where: { id } })
    return response.status(204).send()
  }
}
