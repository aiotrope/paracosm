import express from 'express'

import { Request as JWTRequest } from 'express-jwt'

const initChecker = async (req: JWTRequest, res: express.Response) => {
  const { auth } = req
  res.status(200).json({ message: `Hello, World! ${auth?.aud}` }) //* or auth?.sub
}

const indexController = {
  initChecker,
}

export default indexController
