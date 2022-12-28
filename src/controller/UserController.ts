import { Request, Response } from "express";
import connectDB from "../database/db";
import { User } from "../entity/User";

const UserRepository = connectDB.getRepository(User)

export default {
  async index(request: Request, response: Response) {

    const user = await UserRepository.find()

    console.log(user)

    return response.json(user)

  }
} 