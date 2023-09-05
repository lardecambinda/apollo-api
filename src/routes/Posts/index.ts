import { Router } from "express";
import PostController from "../../controller/PostController";
import middleware from "../../middlewares/authMiddleware";

const router = Router()

router.post('/post/create', middleware.auth,PostController.store)
router.get('/post/list', PostController.findAll)

export default router