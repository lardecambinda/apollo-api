import { Router } from "express";
import UserRouter from "./User";

const router = Router()

router.use(UserRouter)

export default router