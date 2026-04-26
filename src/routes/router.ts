import { Router } from "express";
import UserRouter from "./User";
import PostRouter from "./Posts";
import CommentsRouter from "./Comments";
import AuthRouter from "./Auth";
import SearchRouter from "./Search";
import { authMiddleware } from "../middleware/auth";

const router = Router()

// public
router.use(AuthRouter)
router.use(SearchRouter)
router.use(PostRouter)

// protected
router.use(authMiddleware)
router.use(UserRouter)
router.use(CommentsRouter)

export default router
