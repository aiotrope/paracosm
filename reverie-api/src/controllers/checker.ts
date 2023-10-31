import express from 'express'

// import { Request as JWTRequest } from 'express-jwt'

const initChecker = async (req: express.Request, res: express.Response) => {
  // const { auth } = req
  res.status(200).json({ message: `Hello, World!` }) //* or auth?.sub
}

const checkerController = {
  initChecker,
}

export default checkerController
