import { Response, NextFunction } from 'express'
import { CustomRequest } from '../@types'
import jwt from 'jsonwebtoken'

export function authMiddleware(request: CustomRequest, response: Response, next: NextFunction) {
  let token: string | undefined

  const authHeader = request.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  } else if (typeof request.query.token === 'string' && request.query.token.length > 0) {
    token = request.query.token
  }

  if (!token) {
    return response.status(401).json({ error_message: 'Token not provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    request.user = decoded as { id: string; role: string }
    return next()
  } catch {
    return response.status(401).json({ error_message: 'Invalid or expired token' })
  }
}
