import { Router } from "express";
import UserRouter from "./User";
import ProductRouter from "./Product";
import RegisterRouter from "./Register";
import AuthenticationRouter from "./Authentication";


const router = Router()

router.use(UserRouter)
router.use(ProductRouter)
router.use(RegisterRouter)
router.use(AuthenticationRouter)

export default router