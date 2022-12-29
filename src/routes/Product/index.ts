import { Router } from "express";
import Product from "../../controller/ProductsController";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import AuthMiddlewareAdminUser from "../../middlewares/AuthMiddlewareAdminUser";


const router = Router()

router.post('/create/product', AuthMiddleware.authMiddleware, AuthMiddlewareAdminUser.authMiddleware, Product.store)

export default router