import { Router } from "express";
import PostController from "../../controller/PostController";

const router = Router()

router.post('/post/create', PostController.store)
router.get('/post/list', PostController.findAll)

export default router