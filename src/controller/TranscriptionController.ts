import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { CustomRequest } from '../@types'
import multer from 'multer'
import { put, del } from '@vercel/blob'
import { whisperClient, TranscriptionProgress } from '../services/whisperClient'

const prisma = new PrismaClient()

export const upload = multer({ storage: multer.memoryStorage() })

const sseClients = new Map<string, Set<Response>>()

function notifyProgress(transcriptionId: string, data: TranscriptionProgress) {
  const clients = sseClients.get(transcriptionId)
  if (!clients) return
  const payload = `data: ${JSON.stringify(data)}\n\n`
  for (const client of clients) {
    client.write(payload)
  }
}

const transcriptionQueue: string[] = []
let processing = false

async function processQueue() {
  if (processing || transcriptionQueue.length === 0) return
  processing = true

  const id = transcriptionQueue.shift()!
  const transcription = await prisma.transcriptions.findUnique({ where: { id } })

  if (!transcription || transcription.status === 'CANCELLED') {
    processing = false
    processQueue()
    return
  }

  try {
    await prisma.transcriptions.update({
      where: { id },
      data: { status: 'IN_PROGRESS', progress: 0 }
    })
    notifyProgress(id, { status: 'IN_PROGRESS', progress: 0 })

    const result = await whisperClient.transcribe(
      transcription.audioUrl,
      (progress) => {
        prisma.transcriptions.update({
          where: { id },
          data: { progress }
        }).catch(() => {})
        notifyProgress(id, { status: 'IN_PROGRESS', progress })
      }
    )

    await prisma.transcriptions.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        progress: 100,
        text: result.text,
        completedAt: new Date()
      }
    })
    notifyProgress(id, { status: 'COMPLETED', progress: 100, text: result.text })

  } catch (error: any) {
    const transcription = await prisma.transcriptions.findUnique({ where: { id } })
    if (transcription?.status === 'CANCELLED') {
      processing = false
      processQueue()
      return
    }

    if (transcription && transcription.retryCount < 1) {
      await prisma.transcriptions.update({
        where: { id },
        data: { retryCount: { increment: 1 }, progress: 0 }
      })
      transcriptionQueue.unshift(id)
    } else {
      await prisma.transcriptions.update({
        where: { id },
        data: { status: 'ERROR', errorMessage: error.message || 'Transcription failed' }
      })
      notifyProgress(id, { status: 'ERROR', errorMessage: error.message })
    }
  } finally {
    processing = false
    processQueue()
  }
}

const transcriptionSelect = {
  id: true,
  filename: true,
  originalName: true,
  fileSize: true,
  mimeType: true,
  status: true,
  progress: true,
  text: true,
  errorMessage: true,
  retryCount: true,
  audioUrl: true,
  user_id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
  users: { select: { id: true, user_name: true } }
}

export default {
  async uploadAudio(request: CustomRequest & { file?: Express.Multer.File }, response: Response) {
    if (!request.file) {
      return response.status(400).json({ error_message: 'No audio file provided' })
    }

    const { originalname, size, mimetype } = request.file
    const userId = request.user?.id

    if (!userId) {
      return response.status(401).json({ error_message: 'User not authenticated' })
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${originalname}`

    const blob = await put(filename, request.file.buffer, {
      access: 'public',
      contentType: mimetype,
    })

    const transcription = await prisma.transcriptions.create({
      data: {
        filename,
        originalName: originalname,
        fileSize: size,
        mimeType: mimetype,
        audioUrl: blob.url,
        user_id: userId,
        status: 'PENDING'
      },
      select: transcriptionSelect
    })

    transcriptionQueue.push(transcription.id)
    processQueue()

    return response.status(201).json(transcription)
  },

  async findAll(request: CustomRequest, response: Response) {
    const userId = request.user?.id
    if (!userId) {
      return response.status(401).json({ error_message: 'User not authenticated' })
    }

    const transcriptions = await prisma.transcriptions.findMany({
      where: { user_id: userId },
      select: transcriptionSelect,
      orderBy: { createdAt: 'desc' }
    })

    return response.status(200).json(transcriptions)
  },

  async findOne(request: CustomRequest, response: Response) {
    const { id } = request.params
    const userId = request.user?.id

    const transcription = await prisma.transcriptions.findUnique({
      where: { id },
      select: transcriptionSelect
    })

    if (!transcription) {
      return response.status(404).json({ error_message: 'Transcription not found' })
    }

    if (transcription.user_id !== userId && request.user?.role !== 'ADMIN') {
      return response.status(403).json({ error_message: 'Access denied' })
    }

    return response.status(200).json(transcription)
  },

  async progress(request: Request, response: Response) {
    const { id } = request.params

    const transcription = await prisma.transcriptions.findUnique({ where: { id } })
    if (!transcription) {
      return response.status(404).json({ error_message: 'Transcription not found' })
    }

    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    })

    if (transcription.status === 'COMPLETED') {
      response.write(`data: ${JSON.stringify({ status: 'COMPLETED', progress: 100, text: transcription.text })}\n\n`)
      response.end()
      return
    }

    if (transcription.status === 'ERROR') {
      response.write(`data: ${JSON.stringify({ status: 'ERROR', errorMessage: transcription.errorMessage })}\n\n`)
      response.end()
      return
    }

    if (transcription.status === 'CANCELLED') {
      response.write(`data: ${JSON.stringify({ status: 'CANCELLED' })}\n\n`)
      response.end()
      return
    }

    if (!sseClients.has(id)) {
      sseClients.set(id, new Set())
    }
    sseClients.get(id)!.add(response)

    request.on('close', () => {
      sseClients.get(id)?.delete(response)
      if (sseClients.get(id)?.size === 0) {
        sseClients.delete(id)
      }
    })
  },

  async download(request: CustomRequest, response: Response) {
    const { id } = request.params
    const userId = request.user?.id

    const transcription = await prisma.transcriptions.findUnique({ where: { id } })
    if (!transcription) {
      return response.status(404).json({ error_message: 'Transcription not found' })
    }

    if (transcription.user_id !== userId && request.user?.role !== 'ADMIN') {
      return response.status(403).json({ error_message: 'Access denied' })
    }

    if (transcription.status !== 'COMPLETED' || !transcription.text) {
      return response.status(400).json({ error_message: 'Transcription not completed yet' })
    }

    const baseName = transcription.originalName.replace(/\.[^/.]+$/, '')
    response.setHeader('Content-Type', 'text/plain; charset=utf-8')
    response.setHeader('Content-Disposition', `attachment; filename="${baseName}-transcricao.txt"`)
    return response.status(200).send(transcription.text)
  },

  async cancel(request: CustomRequest, response: Response) {
    const { id } = request.params
    const userId = request.user?.id

    const transcription = await prisma.transcriptions.findUnique({ where: { id } })
    if (!transcription) {
      return response.status(404).json({ error_message: 'Transcription not found' })
    }

    if (transcription.user_id !== userId) {
      return response.status(403).json({ error_message: 'Access denied' })
    }

    if (transcription.status !== 'PENDING' && transcription.status !== 'IN_PROGRESS') {
      return response.status(400).json({ error_message: 'Cannot cancel transcription in current status' })
    }

    const updated = await prisma.transcriptions.update({
      where: { id },
      data: { status: 'CANCELLED' },
      select: transcriptionSelect
    })

    notifyProgress(id, { status: 'CANCELLED' })

    return response.status(200).json(updated)
  },

  async destroy(request: CustomRequest, response: Response) {
    const { id } = request.params
    const userId = request.user?.id

    const transcription = await prisma.transcriptions.findUnique({ where: { id } })
    if (!transcription) {
      return response.status(404).json({ error_message: 'Transcription not found' })
    }

    if (transcription.user_id !== userId && request.user?.role !== 'ADMIN') {
      return response.status(403).json({ error_message: 'Access denied' })
    }

    if (transcription.status === 'IN_PROGRESS') {
      return response.status(400).json({ error_message: 'Cannot delete transcription in progress' })
    }

    if (transcription.audioUrl) {
      try {
        await del(transcription.audioUrl)
      } catch {}
    }

    await prisma.transcriptions.delete({ where: { id } })

    return response.status(204).send()
  }
}
