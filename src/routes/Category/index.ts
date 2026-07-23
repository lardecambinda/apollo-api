import { Router } from 'express'
import { CategoryController } from '../../controller/CategoryController'
import { authMiddleware } from '../../middleware/auth'

const router = Router()

router.post('/category', authMiddleware, CategoryController.store)
router.get('/category/list', CategoryController.findAll)
router.put('/category/:id', authMiddleware, CategoryController.update)
router.delete('/category/:id', authMiddleware, CategoryController.destroy)

export { router as categoryRoutes }
