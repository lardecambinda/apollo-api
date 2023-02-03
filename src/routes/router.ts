import { Router } from "express";
import UserRouter from "./User";
import PostRouter from "./Posts";

const router = Router()

router.use(UserRouter)
router.use(PostRouter)

export default router