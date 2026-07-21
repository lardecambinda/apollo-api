import fs from 'fs'
import FormData from 'form-data'
import axios from 'axios'

export interface TranscriptionProgress {
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ERROR' | 'CANCELLED'
  progress?: number
  text?: string
  errorMessage?: string
}

const WHISPER_SERVER_URL = process.env.WHISPER_SERVER_URL || 'http://localhost:8000'

class WhisperClient {
  async transcribe(
    audioPath: string,
    onProgress?: (progress: number) => void
  ): Promise<{ text: string }> {
    const form = new FormData()
    form.append('file', fs.createReadStream(audioPath))
    form.append('language', 'pt')
    form.append('model', 'small')

    const response = await axios.post(`${WHISPER_SERVER_URL}/transcribe`, form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 0,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 50) / progressEvent.total)
          onProgress(percent)
        }
      },
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const uploadPercent = 50
          const downloadPercent = Math.round((progressEvent.loaded * 50) / progressEvent.total)
          onProgress(uploadPercent + downloadPercent)
        }
      }
    })

    return { text: response.data.text }
  }
}

export const whisperClient = new WhisperClient()
