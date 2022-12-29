import { Products } from './../entity/Products';
import { Request, Response } from "express";
import connectDB from "../database/db";

const UserRepository = connectDB.getRepository(Products)

export default {
  async store(request: Request, response: Response) {

    const { colors, description, images, name, price, mainImage, size }: Products = request.body

    if (!colors || !description || !images || !name || !price || !mainImage || !size)
      return response.json({ error: 'The all fields of address are required' }).status(401)

    const products = UserRepository.create(request.body)

    await UserRepository.save(products)

    const product = await UserRepository.find()

    return response.json(product).status(200)
  }
} 