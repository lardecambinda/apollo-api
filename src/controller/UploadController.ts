import { Response } from 'express'
import { CustomRequest } from '../@types'
import { supabase } from '../services/supabaseClient'
import multer from 'multer'

export const upload = multer({ storage: multer.memoryStorage() })

export default {
  async uploadFiles(request: CustomRequest & { files?: Express.Multer.File[] }, response: Response) {
    const files = request.files
    if (!files || files.length === 0) {
      return response.status(400).json({ error_message: 'No files provided' })
    }

    const urls: string[] = []

    try {
      for (const file of files) {
        const filename = `${Date.now()}-${file.originalname}`
        const { error } = await supabase.storage
          .from('posts')
          .upload(filename, file.buffer, {
            contentType: file.mimetype,
            upsert: true
          })

        if (error) {
          throw error
        }

        const { data } = supabase.storage
          .from('posts')
          .getPublicUrl(filename)

        urls.push(data.publicUrl)
      }

      return response.status(200).json({ urls })
    } catch (err: any) {
      console.error('[UploadController error]', err)
      return response.status(500).json({ error_message: err.message || 'Error uploading files' })
    }
  }
}
