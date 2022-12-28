import { Address } from './../entity/Address';
import { Request, Response } from "express";
import connectDB from "../database/db";

const UserRepository = connectDB.getRepository(Address)

export default {
  async store(request: Request, response: Response) {
    const { zipCode, complement, number, street }: Address = request.body

    if (!zipCode || !complement || !number || !street) {
      response.status(401).json({ error: "Erro" })
    }

    const address = UserRepository.create({
      zipCode,
      complement,
      number,
      street,
    })

    const createdAddress = UserRepository.save(address)

    return response.status(200).json(createdAddress)
  }
}