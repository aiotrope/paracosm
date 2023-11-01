import 'express-async-errors'
import { Request, Response } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import createHttpError from 'http-errors'

import jwtHelpers from '../utils/jwtHelpers'
import { UserModel, User } from '../models/user'
import userService from '../services/user'
import { cacheMethodCalls } from '../utils/cache'

const cachedUserService = cacheMethodCalls(userService, ['create'])

const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await cachedUserService.getUsers()

    return res.status(200).json(users)
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
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
      console.error(err)
      throw createHttpError.UnprocessableEntity(err.message)
    }
  }
}

const signup = async (req: Request, res: Response) => {
  try {
    const result = await cachedUserService.create(req.body)

    return res
      .status(201)
      .json({ message: `${result?.email} user account created`, result })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      throw createHttpError.UnprocessableEntity(err.message)
    }
  }
}

const userController = {
  signup,
  getUsers,
  getById
}

export default userController
