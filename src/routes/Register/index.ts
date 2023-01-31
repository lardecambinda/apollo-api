import { Router } from "express";
import Register from "../../controller/RegisterController";


const router = Router()

router.post('/register', Register.store)

export default router