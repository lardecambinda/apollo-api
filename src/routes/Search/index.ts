import { Router } from "express";
import SearchController from "../../controller/SearchController";

const router = Router()

router.get('/search/:term', SearchController.search)

export default router
