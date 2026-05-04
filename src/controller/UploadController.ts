import { Response } from 'express'
import { CustomRequest } from '../@types'
import { createClient } from '@supabase/supabase-js'
import multer from 'multer'

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
)

export const upload = multer({ storage: multer.memoryStorage() })

export default {
  async uploadFiles(request: CustomRequest & { files?: Express.Multer.File[] }, response: Response) {
    const files = request.files
    if (!files || files.length === 0) {
      return response.status(400).json({ error_message: 'No files provided' })
    }

    const urls: string[] = []

    for (const file of files) {
      const path = `${Date.now()}-${file.originalname}`
      const { error } = await supabase.storage
        .from('posts')
        .upload(path, file.buffer, { contentType: file.mimetype })

      if (error) return response.status(500).json({ error_message: error.message })

      const { data } = supabase.storage.from('posts').getPublicUrl(path)
      urls.push(data.publicUrl)
    }

    return response.status(200).json({ urls })
  }
}
