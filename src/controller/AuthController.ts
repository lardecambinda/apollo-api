import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { CustomRequest } from '../@types'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default {
  async signIn(request: CustomRequest, response: Response) {
    const { email, password } = request.body.user

    if (!email || !password) {
      return response.status(401).json({ error_message: 'email and password are required' })
    }

    const user = await prisma.users.findUnique({ where: { email } })

    if (!user) {
      return response.status(401).json({ error_message: 'Invalid credentials' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return response.status(401).json({ error_message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    )

    const userReturned = {
      id: user.id,
      email: user.email,
      user_name: user.user_name,
      role: user.role,
    }

    return response.status(200).json({ token, userReturned })
  }
}
