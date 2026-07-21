import { Router } from "express";
import AuthController from "../../controller/AuthController";
import PasswordResetController from "../../controller/PasswordResetController";

const router = Router()

router.post('/auth', AuthController.signIn)
router.get('/auth/validate-reset-token', PasswordResetController.validateToken)
router.post('/auth/reset-password', PasswordResetController.resetPassword)

export default router
