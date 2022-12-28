import { Router } from "express";
import Register from "../controller/RegisterController";
import Authentication from "../controller/AuthenticationController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import AddressController from "../controller/AddressController";


const router = Router()

router.post('/register', Register.store)
router.post('/auth', Authentication.authentication)
router.get('/user', Authentication.index)

export default router