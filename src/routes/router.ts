import { Router } from "express";
import UserRouter from "./User";
import RegisterRouter from "./Register";
import AuthenticationRouter from "./Authentication";


const router = Router()

router.use(UserRouter)
router.use(RegisterRouter)
router.use(AuthenticationRouter)

export default router