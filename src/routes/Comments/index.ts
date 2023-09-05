import { Router } from "express";
import CommentsController from "../../controller/CommentsController";
import middleware from "../../middlewares/authMiddleware";

const router = Router()

router.post('/comment/create', middleware.auth, CommentsController.store)
router.post('/comment/list', middleware.auth, CommentsController.store)

export default router