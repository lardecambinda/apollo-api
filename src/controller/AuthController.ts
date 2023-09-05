import { Response } from "express";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { CustomRequest } from "../@types";

const prisma = new PrismaClient();

export default {
  async authenticate(request: CustomRequest, response: Response) {
    const { email, password } = request.body.user;

    if (!email || !password) {
      return response
        .status(401)
        .json({ error_message: "All body properties are required" });
    }

    const user = await prisma.users.findUnique({ where: { email: email } });

    if (!user)
      return response
        .status(401)
        .json({ error_message: "User dose not exists" });

    const passwordIsValid = await compare(password, user.password);

    if (!passwordIsValid)
      return response
        .status(401)
        .json({ error_message: "User not Authorized, password is incorrect" });

    const token = sign({ id: user.id, role: user.role }, "secret", {
      expiresIn: "1d",
    });

    const userReturned = await prisma.users.findUnique({
      where: {
        email: email,
      },
      select: {
        password: false,
        id: true,
        email: false,
        user_name: true,
        role: true,
      },
    });

    return response.status(200).json({
      userReturned,
      token,
    });
  },
};
