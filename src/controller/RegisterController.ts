import { Request, Response } from "express";
import connectDB from "../database/db";
import { User } from "../entity/User";

const UserRepository = connectDB.getRepository(User)

export default {
  async store(request: Request, response: Response) {
    const { email, cpf } = request.body

    const emailExists = await UserRepository.findOne({ where: { email } })
    const cpfExists = await UserRepository.findOne({ where: { cpf } })

    if (emailExists) return response.json({ error: `The name ${emailExists.email} already exists` })
    if (cpfExists) return response.json({ error: `The CPF ${cpfExists.cpf} already exists` })

    const createUser = UserRepository.create(request.body)
    await UserRepository.save(createUser)

    const userWithOutPassword = await UserRepository.findOneBy({ cpf })

    return response.json(userWithOutPassword)

  }
}