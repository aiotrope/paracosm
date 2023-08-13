import jwt, { SignOptions } from 'jsonwebtoken'
import createHttpError from 'http-errors'

import environ from '../environ'

const signAccessToken = (userId: string) =>
  new Promise((resolve, reject) => {
    const payload = {}

    const privateKey = Buffer.from(environ.PRIV_KEY, 'base64').toString('ascii')
    // console.log(userId)
    const options = {
      subject: userId,
      issuer: environ.ISS, //* web service api
      expiresIn: environ.EXPIRESIN,
      audience: userId,
      algorithm: 'RS256',
    } as SignOptions

    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        console.error(err.message)
        return reject(createHttpError.InternalServerError())
      }
      resolve(token)
    })
  })

const verifyAccessToken = (token: string) => {
  try {
    const publicKey = Buffer.from(environ.PUB_KEY, 'base64').toString('ascii')

    return jwt.verify(token, publicKey)
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError.Unauthorized()
    }
  }
}

export default {
  signAccessToken,
  verifyAccessToken,
}
