import { Router } from 'express'
import TranscriptionController, { upload } from '../../controller/TranscriptionController'
import { authMiddleware } from '../../middleware/auth'

const router = Router()

router.post('/transcription/upload-token', authMiddleware, TranscriptionController.handleUploadToken)
router.post('/transcription/create', authMiddleware, TranscriptionController.create)
router.post('/transcription/upload', authMiddleware, upload.single('audio'), TranscriptionController.uploadAudio)
router.get('/transcription/list', authMiddleware, TranscriptionController.findAll)
router.get('/transcription/:id', authMiddleware, TranscriptionController.findOne)
router.get('/transcription/:id/progress', TranscriptionController.progress)
router.get('/transcription/:id/download', authMiddleware, TranscriptionController.download)
router.delete('/transcription/:id/cancel', authMiddleware, TranscriptionController.cancel)
router.delete('/transcription/:id', authMiddleware, TranscriptionController.destroy)

export default router
