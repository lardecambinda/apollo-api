import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';

interface ITokenAuthorization {
  id: string,
  role: boolean,
  iat: number,
  exp: number
}

export default {
  async authMiddleware(request: Request, response: Response, next: NextFunction) {
    const { authorization } = request.headers

    if (!authorization) return response.status(401).json({ error: 'Unauthorized' })

    const token = authorization.replace('Bearer', '').trim()

    try {
      const data = jwt.verify(token, 'secret')
      const { id, role } = data as ITokenAuthorization

      request.userId = id
      request.role = role

      console.log(request.role)

      if (request.role) return next()

      return response.status(401).json({ error: 'User not authorized' })

    } catch {
      response.status(401).json({ error: 'Token malformatted' })
    }
  }
}