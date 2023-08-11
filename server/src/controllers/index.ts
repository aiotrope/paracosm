import { Request, Response } from 'express'

const initChecker = async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello, World!' })
}

export default {
  initChecker,
}
