import { Router } from "express";
import CommentsController from "../../controller/CommentsController";

const router = Router()

router.post('/comment/create', CommentsController.store)

export default router