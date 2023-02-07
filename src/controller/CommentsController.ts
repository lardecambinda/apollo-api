import { Users } from './../entity/Users';
import { Request, Response } from "express";
import { Comments } from '../entity/Comments';
import connectDB from '../database/db';

const repository = connectDB.getRepository(Comments)
const userRepository = connectDB.getRepository(Users)

export default {
  async store(request: Request, response: Response) {
    const { comment, user: userId, post: postId } = request.body as Comments

    if (!comment || !userId || !postId) {
      return response.status(401).json({
        error_message: 'comment, user and post properties are required'
      })
    }

    const user = await userRepository.findOneBy({ id: userId })

    console.log(user)

    if (!user) {
      return response.status(401).json({
        error_message: 'user not exists'
      })
    } else if (!postId) {
      return response.status(401).json({
        error_message: 'post not exists'
      })
    }

    const createComment = repository.create({
      comment,
      post: postId,
      user: userId
    })

    const createdComment = await repository.save(createComment)

    return response.status(201).json(createdComment)
  }
}