import { Router } from "express";
import RegisterController from "../../controller/UserController";

const router = Router()

router.post('/user/register', RegisterController.store)
router.get('/user/list', RegisterController.findAll)

export default router