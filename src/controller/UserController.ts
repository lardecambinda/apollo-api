import { Request, response, Response } from "express";
import { Users } from "../entity/Users";
import connectDB from "../database/db";

const repository = connectDB.getRepository(Users)

export default {
  async store(request: Request, response: Response) {
    const { email, firstName, password, role } = request.body as Users;

    if (!email || !firstName || !password || !role) {
      response.status(401).json({ error_message: 'All body properties are required' })
    }

    const userExist = await repository.findOne({ where: { email: email } })

    console.log(userExist)

    if (userExist) return response.status(401).json({ error_message: 'email already exists' })

    const createdUser = repository.create({
      email,
      firstName,
      password,
      role
    })
    await repository.save(createdUser)

    const userReturned = await repository.findOne({ where: { email: email } })

    response.status(201).json(userReturned)
  },
  async findAll(request: Request, response: Response) {
    const users = await repository.find()
    console.log(users)
    return response.status(200).json(users)
  },
  async findOne(request: Request, response: Response) {
    const users = await repository.find()
    console.log(users)
    return response.status(200).json(users)
  }
}