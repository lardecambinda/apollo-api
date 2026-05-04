import { Response, NextFunction } from 'express'
import { CustomRequest } from '../@types'
import { authMiddleware } from './auth'

export function adminOrEditor(request: CustomRequest, response: Response, next: NextFunction) {
  authMiddleware(request, response, () => {
    if (request.user?.role !== 'ADMIN' && request.user?.role !== 'EDITOR') {
      return response.status(403).json({ error_message: 'Forbidden: admin or editor only' })
    }
    return next()
  })
}
