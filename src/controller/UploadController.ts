import { Response } from 'express'
import { CustomRequest } from '../@types'
import { saveFile } from '../services/storage'
import multer from 'multer'

export const upload = multer({ storage: multer.memoryStorage() })

export default {
  async uploadFiles(request: CustomRequest & { files?: Express.Multer.File[] }, response: Response) {
    const files = request.files
    if (!files || files.length === 0) {
      return response.status(400).json({ error_message: 'No files provided' })
    }

    const urls: string[] = []

    for (const file of files) {
      const filename = `posts/${Date.now()}-${file.originalname}`
      const fileUrl = await saveFile(filename, file.buffer, file.mimetype)
      urls.push(fileUrl)
    }

    return response.status(200).json({ urls })
  }
}
