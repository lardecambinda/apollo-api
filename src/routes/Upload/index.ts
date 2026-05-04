import { Router } from "express"
import UploadController, { upload } from "../../controller/UploadController"
import { authMiddleware } from "../../middleware/auth"

const router = Router()

router.post('/post/upload', authMiddleware, upload.array('files', 10), UploadController.uploadFiles)

export default router
