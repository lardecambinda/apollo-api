import fs from 'fs'
import path from 'path'
import { put, del } from '@vercel/blob'

const UPLOADS_DIR = path.resolve('uploads')

export function isLocalDev(): boolean {
  if (process.env.STORAGE_TYPE === 'local') return true
  if (process.env.STORAGE_TYPE === 'vercel') return false
  return !process.env.VERCEL && process.env.NODE_ENV !== 'production'
}

export async function saveFile(filename: string, buffer: Buffer, mimetype: string): Promise<string> {
  if (isLocalDev()) {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true })
    }
    const safeFilename = filename.replace(/\//g, '_')
    const filePath = path.join(UPLOADS_DIR, safeFilename)
    await fs.promises.writeFile(filePath, buffer)

    const host = process.env.APP_URL || `http://localhost:${process.env.PORT || 3333}`
    return `${host}/uploads/${safeFilename}`
  } else {
    const blob = await put(filename, buffer, {
      access: 'private',
      contentType: mimetype,
    })
    return blob.url
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  if (!fileUrl) return
  if (isLocalDev() || fileUrl.includes('/uploads/')) {
    try {
      const filename = path.basename(fileUrl)
      const filePath = path.join(UPLOADS_DIR, filename)
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath)
      }
    } catch (err) {
      console.error('Failed to delete local file:', err)
    }
  } else {
    try {
      await del(fileUrl)
    } catch (err) {
      console.error('Failed to delete blob file:', err)
    }
  }
}
