import { Request, Response } from "express";

export default {
  async save(req: Request, res: Response) {
    res.status(200).json({ success: 'Ola' })
  }
}