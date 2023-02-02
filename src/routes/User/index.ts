import { Router } from "express";
import RegisterController from "../../controller/UserController";

const router = Router()

router.post('/user/register', RegisterController.store)

export default router