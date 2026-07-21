import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { CustomRequest } from '../@types'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

async function ensureTableExists() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
        "id" TEXT NOT NULL,
        "token_hash" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "expires_at" TIMESTAMP(3) NOT NULL,
        "used" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
      );
    `)
  } catch (err) {
    console.error('[ensureTableExists error]', err)
  }
}

async function withTableCheck<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error: any) {
    if (error?.code === 'P2021') {
      await ensureTableExists()
      return await fn()
    }
    throw error
  }
}

export default {
  // Admin gera o link/token de redefinição de senha para um usuário
  async generateToken(request: CustomRequest, response: Response) {
    try {
      const { id } = request.params

      const user = await prisma.users.findUnique({ where: { id } })
      if (!user) {
        return response.status(404).json({ error_message: 'Usuário não encontrado' })
      }

      if (!user.active) {
        return response.status(400).json({ error_message: 'Não é possível redefinir a senha de um usuário inativo' })
      }

      const token = uuidv4()
      const token_hash = hashToken(token)
      const expires_at = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos

      await withTableCheck(async () => {
        // Invalida tokens anteriores não utilizados desse usuário
        await prisma.passwordResetTokens.updateMany({
          where: { user_id: id, used: false },
          data: { used: true }
        })

        await prisma.passwordResetTokens.create({
          data: {
            user_id: id,
            token_hash,
            expires_at,
            used: false
          }
        })
      })

      return response.status(201).json({
        token,
        expires_at
      })
    } catch (error: any) {
      console.error('[generateToken error]', error)
      return response.status(500).json({ error_message: 'Erro interno ao gerar token de redefinição' })
    }
  },

  // Público: Valida se o token ainda é válido
  async validateToken(request: Request, response: Response) {
    try {
      const token = request.query.token as string

      if (!token) {
        return response.status(400).json({ valid: false, error_message: 'Token não fornecido' })
      }

      const token_hash = hashToken(token)

      const resetToken = await withTableCheck(async () => {
        return await prisma.passwordResetTokens.findFirst({
          where: { token_hash },
          include: { users: { select: { email: true, user_name: true } } }
        })
      })

      if (!resetToken) {
        return response.status(404).json({ valid: false, error_message: 'Link de redefinição inválido' })
      }

      if (resetToken.used) {
        return response.status(400).json({ valid: false, error_message: 'Este link de redefinição já foi utilizado' })
      }

      if (resetToken.expires_at < new Date()) {
        return response.status(400).json({ valid: false, error_message: 'Este link de redefinição expirou' })
      }

      return response.status(200).json({
        valid: true,
        email: resetToken.users.email,
        user_name: resetToken.users.user_name
      })
    } catch (error: any) {
      console.error('[validateToken error]', error)
      return response.status(500).json({ valid: false, error_message: 'Erro ao validar token' })
    }
  },

  // Público: Define a nova senha usando o token
  async resetPassword(request: Request, response: Response) {
    try {
      const { token, new_password } = request.body

      if (!token || !new_password) {
        return response.status(400).json({ error_message: 'Token e nova senha são obrigatórios' })
      }

      if (typeof new_password !== 'string' || new_password.length < 6) {
        return response.status(400).json({ error_message: 'A senha deve ter no mínimo 6 caracteres' })
      }

      const token_hash = hashToken(token)

      const resetToken = await withTableCheck(async () => {
        return await prisma.passwordResetTokens.findFirst({
          where: { token_hash }
        })
      })

      if (!resetToken || resetToken.used || resetToken.expires_at < new Date()) {
        return response.status(400).json({ error_message: 'Link de redefinição inválido ou expirado' })
      }

      const hashedPassword = await bcrypt.hash(new_password, 10)

      await withTableCheck(async () => {
        await prisma.$transaction([
          prisma.users.update({
            where: { id: resetToken.user_id },
            data: { password: hashedPassword }
          }),
          prisma.passwordResetTokens.update({
            where: { id: resetToken.id },
            data: { used: true }
          })
        ])
      })

      return response.status(200).json({ message: 'Senha alterada com sucesso' })
    } catch (error: any) {
      console.error('[resetPassword error]', error)
      return response.status(500).json({ error_message: 'Erro ao redefinir a senha' })
    }
  }
}
