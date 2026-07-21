import { Router } from "express";
import RegisterController from "../../controller/UserController";
import PasswordResetController from "../../controller/PasswordResetController";
import { adminOnly } from "../../middleware/adminOnly";
import { authMiddleware } from "../../middleware/auth";

const router = Router()

router.post('/user/register', adminOnly, RegisterController.store)
router.get('/user/list', adminOnly, RegisterController.findAll)
router.get('/user/:id', authMiddleware, RegisterController.findOne)
router.patch('/user/:id/toggle', adminOnly, RegisterController.toggle)
router.put('/user/:id', adminOnly, RegisterController.update)
router.delete('/user/:id', adminOnly, RegisterController.destroy)
router.post('/user/:id/reset-password-token', adminOnly, PasswordResetController.generateToken)

export default router
