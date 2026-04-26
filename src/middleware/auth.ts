import { Response, NextFunction } from 'express'
import { CustomRequest } from '../@types'
import jwt from 'jsonwebtoken'

export function authMiddleware(request: CustomRequest, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ error_message: 'Token not provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    request.user = decoded as { id: string; role: string }
    return next()
  } catch {
    return response.status(401).json({ error_message: 'Invalid or expired token' })
  }
}
