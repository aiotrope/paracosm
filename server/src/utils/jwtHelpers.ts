import jwt, { SignOptions, Secret } from 'jsonwebtoken'
import createHttpError from 'http-errors'

import environ from '../environ'

const signAccessToken = (userId: string) =>
  new Promise((resolve, reject) => {
    const payload = {}
    const privateKey: Secret = environ.JWT_SECRET
    console.log(userId)
    const options = {
      subject: userId,
      issuer: environ.ISS, //* web service api
      expiresIn: environ.EXPIRESIN,
      audience: userId,
      algorithm: 'HS256',
    } as SignOptions

    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        console.error(err.message)
        reject(createHttpError.InternalServerError())
        return
      }
      return resolve(token)
    })
  })

const verifyAccessToken = async (accessToken: string) => {
  try {
    const privateKey: Secret = environ.JWT_SECRET

    return jwt.verify(accessToken, privateKey)
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError.Unauthorized()
    }
  }
}

const signRefreshToken = (userId: string) =>
  new Promise((resolve, reject) => {
    const payload = {}
    const privateKey: Secret = environ.JWT_SECRET_REFRESH
    const options = {
      expiresIn: '30d',
      issuer: environ.ISS,
      audience: userId,
      subject: userId,
    } as SignOptions

    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        console.error(err.message)
        reject(createHttpError.InternalServerError())
      }
      return resolve(token)
    })
  })

const verifyRefreshToken = (refreshToken: string) => {
  try {
    const privateKey: Secret = environ.JWT_SECRET_REFRESH

    return jwt.verify(refreshToken, privateKey)
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError.Unauthorized()
    }
  }
}

export default {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
}
