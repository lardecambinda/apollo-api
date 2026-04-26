import { Router } from "express";
import RegisterController from "../../controller/UserController";

const router = Router()

router.post('/user/register', RegisterController.store)
router.get('/user/list', RegisterController.findAll)
router.get('/user/:id', RegisterController.findOne)
router.put('/user/:id', RegisterController.update)
router.delete('/user/:id', RegisterController.destroy)

export default router
