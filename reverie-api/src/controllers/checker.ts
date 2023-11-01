import express from 'express'
import environ from '../environ'

const initChecker = async (req: express.Request, res: express.Response) => {
  res.status(200).json({ message: `Hello, World! ${environ.DB_NAME}` })
}

const checkerController = {
  initChecker,
}

export default checkerController
