import { Router } from "express";
import CommentsController from "../../controller/CommentsController";

const router = Router()

router.post('/comment/create', CommentsController.store)
router.get('/comment/list', CommentsController.findAll)
router.delete('/comment/:id', CommentsController.destroy)

export default router
