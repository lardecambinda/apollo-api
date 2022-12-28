import { Request, Response } from "express";
import connectDB from "../database/db";
import { User } from "../entity/User";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const UserRepository = connectDB.getRepository(User)

export default {
  async index(request: Request, response: Response) {
    const { email, password }: User = request.body

    const user = await UserRepository.findOne({ where: { email } })

    if (!user) return response.json({ error: 'User not exists' })

    const usersPassword = await UserRepository
      .createQueryBuilder("user")
      .select("user.email", "email")
      .addSelect("password")
      .getRawOne<User>();

    const passwordIsValid = await bcrypt.compare(password, usersPassword.password)

    if (!passwordIsValid) return response.status(401).json({ error: 'Password is wrong' })

    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' })

    return response.json({ user, token })

  }
}