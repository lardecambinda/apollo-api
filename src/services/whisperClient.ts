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
    audioUrl: string,
    onProgress?: (progress: number) => void
  ): Promise<{ text: string }> {
    const audioResponse = await axios.get(audioUrl, {
      responseType: 'arraybuffer',
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 30) / progressEvent.total)
          onProgress(percent)
        }
      }
    })

    const contentType = (audioResponse.headers['content-type'] as string) || 'audio/wav'
    const form = new FormData()
    form.append('file', Buffer.from(audioResponse.data), {
      filename: 'audio.wav',
      contentType
    })
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
          const percent = Math.round(30 + (progressEvent.loaded * 60) / progressEvent.total)
          onProgress(percent)
        }
      },
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round(90 + (progressEvent.loaded * 10) / progressEvent.total)
          onProgress(percent)
        }
      }
    })

    return { text: response.data.text }
  }
}

export const whisperClient = new WhisperClient()
