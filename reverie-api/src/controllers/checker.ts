import express from 'express'
// import environ from '../environ'

import { Request as JWTRequest } from 'express-jwt'

const initChecker = async (req: JWTRequest, res: express.Response) => {
  const { auth } = req
  // res.status(200).json({ message: `Hello, World! ${environ.DB_NAME}` })

  const ab = req.auth?.username
  const cd = req.auth?.email
  res.status(200).json({
    message: `Hello, World! ${auth?.aud} and ${auth?.sub}: ${auth?.exp}: ${auth?.iat}: ${ab}: ${cd}`,
  })
}

const checkerController = {
  initChecker,
}

export default checkerController
