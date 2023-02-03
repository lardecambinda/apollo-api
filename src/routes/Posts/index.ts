import { Router } from "express";
import PostController from "../../controller/PostController";

const router = Router()

router.post('/post/create', PostController.store)

export default router