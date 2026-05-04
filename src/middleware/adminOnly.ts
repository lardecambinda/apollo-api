import { Response, NextFunction } from 'express'
import { CustomRequest } from '../@types'
import { authMiddleware } from './auth'

export function adminOnly(request: CustomRequest, response: Response, next: NextFunction) {
  // Primeiro verifica autenticação
  authMiddleware(request, response, () => {
    // Depois verifica se é admin
    if (request.user?.role !== 'ADMIN') {
      return response.status(403).json({ error_message: 'Forbidden: admin only' })
    }
    return next()
  })
}
