import jwt, { SignOptions, Secret } from 'jsonwebtoken'
import createHttpError from 'http-errors'

import environ from '../environ'

const signAccessToken = (userId: string, username: unknown, email: unknown) =>
  new Promise((resolve, reject) => {
    const payload = {
      id: userId,
      username: username,
      email: email,
    }
    const privateKey: Secret = environ.JWT_SECRET
    // console.log(userId)
    const options = {
      subject: userId,
      issuer: environ.ISS, //* web service api
      expiresIn: environ.EXPIRESIN,
      audience: userId,
      algorithm: 'HS256',
    } as SignOptions

    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        // console.error(err.message)
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
      expiresIn: environ.EXPIRESIN_REFRESH,
      issuer: environ.ISS,
      audience: userId,
      subject: userId,
    } as SignOptions

    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        // console.error(err.message)
        reject(createHttpError.InternalServerError())
      }
      return resolve(token)
    })
  })

const verifyRefreshToken = (refreshToken: string) =>
  new Promise((resolve, reject) => {
    const privateKey: Secret = environ.JWT_SECRET_REFRESH
    jwt.verify(refreshToken, privateKey, (err, payload: any) => {
      if (err) return reject(createHttpError.Unauthorized())

      const userId = payload?.aud //* as audience

      return resolve(userId)
    })
  })

export default {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
}
