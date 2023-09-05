import { NextFunction, Response } from 'express'
import { PrismaClient, Users, } from '@prisma/client'
import { verify } from 'jsonwebtoken'

import { CustomRequest } from '../@types'

export interface ILogged {
  id: string,
  role: "ADMIN" | "USER"
  iat?: number,
  exp?: number,
}

export default {
  async auth(request: CustomRequest, response: Response, next: NextFunction) {
    const { authorization } = request.headers

    if(!authorization) return response.status(401).json({ error_message: "User not Authorized sss" })

    const token = authorization.replace('Bearer', '').trim()

    try {
      const data = verify(token, 'secret') as ILogged;
      request.loggedUserId = data.id
      request.loggedUserRole = data.role
      
      return next()

    } catch (error: any){
        return response.status(401).json({ error_message: "User not Authorized"+error  })
    }
  }
   
}