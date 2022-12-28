import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';

export default {
  async authMiddleware(request: Request, response: Response, next: NextFunction) {
    const { authorization } = request.headers

    if (!authorization) return response.status(401).json({ error: 'Unauthorized' })

    const token = authorization.replace('Bearer', '').trim()

    try {
      const data = jwt.verify(token, 'secret')
      console.log(data)
    } catch {
      response.status(401).json({ error: 'Token malformatted' })
    }
  }
}