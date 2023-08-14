import 'express-async-errors'
import { Request, Response } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import createHttpError from 'http-errors'

import jwtHelpers from '../utils/jwtHelpers'
import { UserModel, User } from '../models/user'
import userService from '../services/user'

const signup = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body)

    const user = new UserModel({
      email: result.email,
      username: result.username,
      password: result.password,
    })

    await user.save()

    const newUser = await UserModel.findById(user.id).select({
      password: 0,
    })

    return res
      .status(201)
      .json({ message: `${newUser?.email} user account created`, newUser })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      throw createHttpError.UnprocessableEntity(err.message)
    }
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const result = await userService.authenticateUser(req.body)

    const user: DocumentType<User> | null = await UserModel.findOne({
      email: result.email,
    })

    const accessToken = (await jwtHelpers.signAccessToken(user?.id)) as string

    const refreshToken = (await jwtHelpers.signRefreshToken(user?.id)) as string

    const decoded = jwtHelpers.verifyAccessToken(accessToken)

    console.log('accessToken', accessToken)

    console.log('decoded', decoded)

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

const userController = {
  signup,
  login,
}

export default userController
