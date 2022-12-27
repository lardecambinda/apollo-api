import { Request, Response } from "express";
import connectDB from "../database/db";
import { User } from "../entity/User";

const UserRepository = connectDB.getRepository(User)

export default {
  async save(req: Request, res: Response) {
    const { email, password, firstName, lastName, birthDate, cpf } = req.body

    if (!email || !password || !firstName || !lastName || !birthDate || !cpf) {
      return res.status(404).json({ error: 'Something is wrong with body Request' })
    }

  }
}