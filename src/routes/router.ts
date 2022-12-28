import { Router } from "express";
import Register from "../controller/RegisterController";
import Authentication from "../controller/AuthenticationController";
import AuthMiddleware from "../middlewares/AuthMiddleware";


const router = Router()

router.post('/register', Register.store)
router.post('/auth', Authentication.index)
router.get('/list', AuthMiddleware.authMiddleware, Authentication.index)

export default router