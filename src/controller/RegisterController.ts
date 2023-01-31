import { Request, Response } from "express";
import connectDB from "../database/db";
import { User } from "../entity/User";

const UserRepository = connectDB.getRepository(User)

export default {
  async store(request: Request, response: Response) {
    const user: User = request.body

    const emailExists = await UserRepository.findOne({ where: { email: user.email } })
    const cpfExists = await UserRepository.findOne({ where: { cpf: user.cpf } })

    if (!user.address.complement || !user.address.number || !user.address.street || !user.address.zipCode)
      return response.json({ error: 'The all fields of address are required' })
    if (emailExists)
      return response.json({ error: `The name ${user.email} already exists` })
    if (cpfExists)
      return response.json({ error: `The CPF ${user.cpf} already exists` })

    // if (user.role === true) return response.json({ error: `Only admin users can create or pass user to elevate acesse` })

    const createUser = UserRepository.create(request.body)
    await UserRepository.save(createUser)

    return response.json(user)

  }
}