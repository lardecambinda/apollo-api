import { Router } from "express";
import PostController from "../../controller/PostController";
import { authMiddleware } from "../../middleware/auth";

const router = Router()

router.get('/post/list', PostController.findAll)
router.post('/post/create', authMiddleware, PostController.store)
router.put('/post/:id', authMiddleware, PostController.update)
router.delete('/post/:id', authMiddleware, PostController.destroy)

export default router
