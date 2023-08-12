import { Request, Response, NextFunction } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import createHttpError from 'http-errors'

import environ from '../environ'

const signAccessToken = (userId: string) =>
  new Promise((resolve, reject) => {
    const payload = {}
    const privateKey = environ.JWT_SECRET
    // console.log(userId)
    const options: SignOptions = {
      expiresIn: '2h',
      issuer: 'arnelimperial.com', // web issuer
      audience: userId.toString(),
    }
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        console.error(err.message)
        reject(createHttpError.InternalServerError())
        return
      }
      resolve(token)
    })
  })

const verifyAccessToken = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) return next(createHttpError.Unauthorized())

  const authHeader = req.headers.authorization

  const bearerToken = authHeader.split(' ')

  const token = bearerToken[1]

  jwt.verify(token, environ.JWT_SECRET, async (err, payload) => {
    if (err) {
      const message =
        err.message === 'JsonWebTokenError' ? 'Unauthorized' : err.message
      return next(createHttpError.Unauthorized(message))
    }
    req.payload = payload
    req.access = token
    console.log(payload)
    const currentUser = await User.findByPk(payload.aud)
    if (!currentUser)
      throw createHttpError.Unauthorized('No authenticated user found!')
    req.currentUser = currentUser
    next()
  })
}

export default {
  signAccessToken,
  verifyAccessToken,
}
