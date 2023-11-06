import 'express-async-errors'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import createHttpError from 'http-errors'
import { Request as JWTRequest } from 'express-jwt'

import jwtHelpers from '../utils/jwtHelpers'
import PostModel from '../models/post'
import UserModel from '../models/user'
import userService from '../services/user'
import { cacheMethodCalls } from '../utils/cache'

const cachedUserService = cacheMethodCalls(userService, [
  'create',
  'authenticateUser',
  'deleteUser',
])

const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await cachedUserService.getUsers()

    return res.status(200).json(users)
  } catch (err) {
    if (err instanceof Error) {
      // onsole.error(err)
      throw createHttpError.UnprocessableEntity(err.message)
    }
  }
}

const getById = async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    const user = await cachedUserService.getById(id)

    return res.status(200).json(user)
  } catch (err) {
    if (err instanceof Error) {
      // console.error(err)
      throw createHttpError.UnprocessableEntity(err.message)
    }
  }
}

const signup = async (req: Request, res: Response) => {
  try {
    const result = await cachedUserService.create(req.body)

    const user = await cachedUserService.getByEmail(result?.email)

    return res
      .status(201)
      .json({ message: `${user?.email} user account created` })
  } catch (err) {
    if (err instanceof Error) {
      // console.error(err)
      throw createHttpError.UnprocessableEntity(err.message)
    }
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const result = await cachedUserService.authenticateUser(req.body)

    const user = await UserModel.findOne({
      email: result?.email,
    })

    const accessToken = (await jwtHelpers.signAccessToken(
      user?.id,
      user?.username,
      user?.email
    )) as string

    const refreshToken = (await jwtHelpers.signRefreshToken(user?.id)) as string

    // const decoded = jwtHelpers.verifyAccessToken(accessToken)

    // console.log('accessToken', accessToken)

    // console.log('decoded', decoded)

    return res.status(200).json({
      message: `${user?.username} signed-in`,
      access: accessToken,
      refresh: refreshToken,
    })
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ error: err.message })
    }
  }
}

const refresh = async (req: Request, res: Response) => {
  try {
    const userId = await userService.verifyUserRefreshToken(req.body)

    const user = await userService.getById(userId)

    const accessToken = await jwtHelpers.signAccessToken(
      userId,
      user?.username,
      user?.email
    )

    const refreshToken = await jwtHelpers.signRefreshToken(userId)

    // console.log('access', accessToken)
    // console.log('refresh', refreshToken)

    return res.status(200).json({
      message: `${user?.username} successfully refresh auth tokens`,
      access: accessToken,
      refresh: refreshToken,
    })
  } catch (err) {
    if (err instanceof Error) {
      // console.error(err)
      throw createHttpError.Unauthorized(err.message)
    }
  }
}

const deleteUser = async (req: JWTRequest, res: Response) => {
  const { id } = req.params

  const user = await userService.getById(req?.auth?.id)

  if (id !== req?.auth?.aud)
    return res
      .status(403)
      .json({ error: `Not allowed to delete ${user?.username}` })

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: `${id} is not valid user id!` })
  }
  try {
    await PostModel.deleteMany({ user: user?.id })
    await cachedUserService.deleteUser(id)

    res.status(204).end()
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError.Unauthorized(err.message)
    }
  }
}

const userController = {
  signup,
  getUsers,
  getById,
  login,
  refresh,
  deleteUser,
}

export default userController
