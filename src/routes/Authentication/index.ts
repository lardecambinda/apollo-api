import { Router } from "express";
import AuthenticationController from "../../controller/AuthenticationController";

const router = Router()

router.post('/auth', AuthenticationController.authentication)

export default router