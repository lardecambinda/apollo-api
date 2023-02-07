import { Router } from "express";
import UserRouter from "./User";
import PostRouter from "./Posts";
import CommentsRouter from "./Comments";

const router = Router()

router.use(UserRouter)
router.use(PostRouter)
router.use(CommentsRouter)

export default router