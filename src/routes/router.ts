import { Router } from "express";
import UserRouter from "./User";
import PostRouter from "./Posts";
import CommentsRouter from "./Comments";
import AuthRouter from "./Auth";
import SearchRouter from "./Search";
import UploadRouter from "./Upload";
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
router.use(UploadRouter)

export default router
