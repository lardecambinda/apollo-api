import FormData from 'form-data'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

export interface TranscriptionProgress {
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ERROR' | 'CANCELLED'
  progress?: number
  text?: string
  errorMessage?: string
}

const getWhisperServerUrl = () => process.env.WHISPER_SERVER_URL || 'http://10.0.0.107:8000'

class WhisperClient {
  async transcribe(
    audioUrl: string,
    onProgress?: (progress: number) => void
  ): Promise<{ text: string }> {
    let audioBuffer: Buffer
    let contentType = 'audio/wav'

    if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://')) {
      const audioResponse = await axios.get(audioUrl, {
        responseType: 'arraybuffer',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percent = Math.round((progressEvent.loaded * 30) / progressEvent.total)
            onProgress(percent)
          }
        }
      })
      audioBuffer = Buffer.from(audioResponse.data)
      contentType = (audioResponse.headers['content-type'] as string) || 'audio/wav'
    } else {
      const localPath = path.isAbsolute(audioUrl) ? audioUrl : path.resolve(audioUrl)
      audioBuffer = await fs.promises.readFile(localPath)
      if (onProgress) onProgress(30)
    }

    const form = new FormData()
    form.append('file', audioBuffer, {
      filename: 'audio.wav',
      contentType
    })
    form.append('language', 'pt')
    form.append('model', 'small')

    const whisperUrl = getWhisperServerUrl()
    const response = await axios.post(`${whisperUrl}/transcribe`, form, {
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
