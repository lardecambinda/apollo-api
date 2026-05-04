import { Router } from 'express'
import { NotificationController } from '../../controller/NotificationController'

const router = Router()

router.get('/notifications', NotificationController.findAll)
router.patch('/notifications/:id/read', NotificationController.markAsRead)
router.post('/notifications/read-all', NotificationController.markAllAsRead)

export { router as notificationRoutes }
