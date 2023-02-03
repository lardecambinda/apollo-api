import { Posts } from './../entity/Posts';
import { Request, Response } from "express";
import connectDB from '../database/db';

const repository = connectDB.getRepository(Posts)

export default {
  async store(request: Request, response: Response) {
    const { title, content, files, user } = request.body as Posts

    if (!title || !content) return response.status(401).json({
      error_message: 'title and content properties are required'
    })

    const createPost = repository.create({ title, content, files, user })

    await repository.save(createPost)

    return response.status(201).json(createPost)
  }
}