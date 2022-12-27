import { Router } from "express";
import Register from "../controller/RegisterController";


const router = Router()

router.get('/register', Register.save)

export default router