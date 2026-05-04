import { Router } from "express";
import UserRouter from "./User";
import PostRouter from "./Posts";
import AuthRouter from "./Auth";
import SearchRouter from "./Search";
import UploadRouter from "./Upload";
import { categoryRoutes } from "./Category";
import { notificationRoutes } from "./Notification";
import { authMiddleware } from "../middleware/auth";

const router = Router()

// public
router.use(AuthRouter)
router.use(SearchRouter)
router.use(PostRouter)

// protected
router.use(authMiddleware)
router.use(UserRouter)
router.use(UploadRouter)
router.use(categoryRoutes)
router.use(notificationRoutes)

export default router
