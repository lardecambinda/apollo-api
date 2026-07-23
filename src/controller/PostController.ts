import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { CustomRequest } from '../@types'
import { getRequestUser } from '../middleware/auth'

const prisma = new PrismaClient()

const postSelect = {
  id: true,
  title: true,
  content: true,
  files: true,
  tags: true,
  status: true,
  meeting_date: true,
  user_id: true,
  createdAt: true,
  updatedAt: true,
  users: { select: { id: true, user_name: true } }
}

export default {
  async store(request: CustomRequest, response: Response) {
    const { title, content, files, user_id, tags, status, meeting_date } = request.body.post

    if (!title || !content) return response.status(400).json({
      error_message: 'title and content are required'
    })

    // Se o usuário for EDITOR, definir status como PENDING
    const userRole = request.user?.role
    const postStatus = userRole === 'EDITOR' ? 'PENDING' : (status ?? 'DRAFT')

    const post = await prisma.posts.create({
      data: {
        title,
        content,
        files: files ?? [],
        tags: tags ?? [],
        user_id,
        status: postStatus,
        meeting_date: meeting_date ? new Date(meeting_date) : null,
      }
    })

    // Se for EDITOR, criar notificação para todos os ADMINs
    if (userRole === 'EDITOR') {
      const admins = await prisma.users.findMany({
        where: { role: 'ADMIN' }
      })

      for (const admin of admins) {
        await prisma.notifications.create({
          data: {
            post_id: post.id,
            user_id: admin.id,
            message: `Novo post "${title}" aguardando aprovação`
          }
        })
      }
    }

    return response.status(201).json(post)
  },

  async findAll(request: Request, response: Response) {
    const { month, year, tag, title } = request.query

    const where: any = {}

    if (tag) where.tags = { has: tag as string }
    if (title) where.title = { contains: title as string, mode: 'insensitive' }

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

    // Regra de segurança/filtro no Backend:
    // Por padrão, filtra apenas por PUBLISHED.
    // Apenas ADMIN/EDITOR autenticados podem ver outros status.
    const user = getRequestUser(request)
    const isAdminOrEditor = user && (user.role === 'ADMIN' || user.role === 'EDITOR')

    if (!isAdminOrEditor) {
      where.status = 'PUBLISHED'
    }

    const posts = await prisma.posts.findMany({ where, select: postSelect, orderBy: { createdAt: 'desc' } })
    return response.status(200).json(posts)
  },

  async findOne(request: CustomRequest, response: Response) {
    const { id } = request.params
    const post = await prisma.posts.findUnique({ where: { id }, select: postSelect })
    if (!post) return response.status(404).json({ error_message: 'post not found' })

    // Se o post não estiver publicado e o usuário não for admin/editor, negar acesso
    if (post.status !== 'PUBLISHED') {
      const user = getRequestUser(request)
      const isAdminOrEditor = user && (user.role === 'ADMIN' || user.role === 'EDITOR')

      if (!isAdminOrEditor) {
        return response.status(404).json({ error_message: 'post not found' })
      }
    }

    return response.status(200).json(post)
  },

  async update(request: CustomRequest, response: Response) {
    const { id } = request.params
    const { title, content, files, tags, status, meeting_date } = request.body.post

    const post = await prisma.posts.findUnique({ where: { id } })
    if (!post) return response.status(404).json({ error_message: 'post not found' })

    // EDITOR só pode editar seus próprios posts
    if (request.user?.role === 'EDITOR' && post.user_id !== request.user.id) {
      return response.status(403).json({ error_message: 'Você não tem permissão para editar este post' })
    }

    // EDITOR não pode mudar o status diretamente (apenas ADMIN pode aprovar)
    const updateData: any = {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(files !== undefined && { files }),
      ...(tags !== undefined && { tags }),
      ...(meeting_date !== undefined && { meeting_date: meeting_date ? new Date(meeting_date) : null }),
    }

    // Apenas ADMIN pode alterar o status
    if (request.user?.role === 'ADMIN' && status !== undefined) {
      updateData.status = status
    }

    const updated = await prisma.posts.update({
      where: { id },
      data: updateData
    })

    return response.status(200).json(updated)
  },

  async destroy(request: CustomRequest, response: Response) {
    const { id } = request.params

    const post = await prisma.posts.findUnique({ where: { id } })
    if (!post) return response.status(404).json({ error_message: 'post not found' })

    // EDITOR só pode deletar seus próprios posts
    if (request.user?.role === 'EDITOR' && post.user_id !== request.user.id) {
      return response.status(403).json({ error_message: 'Você não tem permissão para deletar este post' })
    }

    await prisma.posts.delete({ where: { id } })

    return response.status(204).send()
  }
}
