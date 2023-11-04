import 'express-async-errors'
import { Request, Response } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import createHttpError from 'http-errors'

import jwtHelpers from '../utils/jwtHelpers'
import { UserModel, User, PostModel } from '../models'
import { PublicUser } from '../utils/schema'
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

    const user: PublicUser | null = await UserModel.findOne({
      email: result.email,
    })

    // const msg: string = `${user?.email} user account created`

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

    const user: DocumentType<User> | null = await UserModel.findOne({
      email: result.email,
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

    const user: DocumentType<User> | null = await UserModel.findById(userId)

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

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = req.currentUser

  if (user.id !== id)
    return res
      .status(403)
      .json({ error: `Not allowed to delete ${req.currentUser.username}` })

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: `${id} is not valid user id!` })
  }
  try {
    const userToDelete = await cachedUserService.deleteUser(id)

    await PostModel.deleteMany({ user: user.id })

    if (!userToDelete) return res.status(404).json({ error: 'User not found' })

    res.status(204).end()
  } catch (err) {
    if (err instanceof Error) {
      // console.error(err)
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
