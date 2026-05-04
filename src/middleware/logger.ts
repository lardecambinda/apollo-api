import { Request, Response, NextFunction } from 'express'

export function logger(request: Request, response: Response, next: NextFunction) {
  const start = Date.now()
  const { method, originalUrl, body } = request

  if (Object.keys(body).length) {
    const sanitized = JSON.parse(JSON.stringify(body))
    if (sanitized?.user?.password) sanitized.user.password = '***'
    console.log(`\x1b[36m[REQ BODY]\x1b[0m ${JSON.stringify(sanitized)}`)
  }

  response.on('finish', () => {
    const ms = Date.now() - start
    const status = response.statusCode
    const color = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m'
    console.log(`${color}[${new Date().toISOString()}] ${method} ${originalUrl} ${status} - ${ms}ms\x1b[0m`)
  })

  next()
}

export function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
  console.error(`\x1b[31m[ERROR] ${new Date().toISOString()} ${request.method} ${request.originalUrl}\x1b[0m`)
  console.error(error.stack)
  response.status(500).json({ error_message: 'Internal server error' })
}
