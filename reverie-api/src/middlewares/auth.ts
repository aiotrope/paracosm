import { Request, Response, NextFunction } from 'express'
import createHttpError from 'http-errors'

import { UserModel } from '../models'
import jwtHelpers from '../utils/jwtHelpers'

export const tokenExtractor = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.access = authorization.substring(7)
  } else {
    next(createHttpError(401))
  }
  next()
}

export const userExtractor = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { access } = req

  const decoded = jwtHelpers.verifyAccessToken(access) as any

  const user = await UserModel.findById(decoded?.id)

  if (!decoded) {
    next(createHttpError(401))
  }

  req.currentUser = user

  next()
}

const authMiddleware = {
  tokenExtractor,
  userExtractor,
}

export default authMiddleware
