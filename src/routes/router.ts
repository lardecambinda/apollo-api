import { Router } from "express";
import Register from "../controller/RegisterController";
import Authentication from "../controller/AuthenticationController";
import UserController from "../controller/UserController";


const router = Router()

//Registration
router.post('/register', Register.store)
//Authentication
router.post('/auth', Authentication.authentication)
//Return Users
router.get('/user', UserController.index)

export default router