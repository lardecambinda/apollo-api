import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { CustomRequest } from '../@types'

const prisma = new PrismaClient()

export const NotificationController = {
  async findAll(request: CustomRequest, response: Response) {
    const { user_id } = request.query
    
    const notifications = await prisma.notifications.findMany({
      where: user_id ? { user_id: user_id as string } : {},
      orderBy: { createdAt: 'desc' }
    })
    
    return response.status(200).json(notifications)
  },

  async markAsRead(request: CustomRequest, response: Response) {
    const { id } = request.params

    const notification = await prisma.notifications.update({
      where: { id },
      data: { read: true }
    })

    return response.status(200).json(notification)
  },

  async markAllAsRead(request: CustomRequest, response: Response) {
    const { user_id } = request.body

    await prisma.notifications.updateMany({
      where: { user_id, read: false },
      data: { read: true }
    })

    return response.status(200).json({ message: 'All notifications marked as read' })
  }
}
