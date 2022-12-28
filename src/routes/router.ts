import { Router } from "express";
import Register from "../controller/RegisterController";
import Authentication from "../controller/AuthenticationController";


const router = Router()

router.post('/register', Register.store)
router.post('/auth', Authentication.index)

export default router