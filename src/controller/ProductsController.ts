import { Products } from './../entity/Products';
import { Request, Response } from "express";
import connectDB from "../database/db";

const UserRepository = connectDB.getRepository(Products)

export default {
  async store(request: Request, response: Response) {

    const user = await UserRepository.find()

    return response.json(user)

  }
} 