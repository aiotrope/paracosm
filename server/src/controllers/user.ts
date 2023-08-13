import 'express-async-errors'
import { Request, Response } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import { HydratedDocument } from 'mongoose'
import createHttpError from 'http-errors'
import { generateErrorMessage } from 'zod-error'
// import bcrypt from 'bcrypt'
// import { Jwt } from 'jsonwebtoken'
import { sanitize } from 'isomorphic-dompurify'
// import { omit } from 'lodash'

import validators from '../utils/validators'
// import environ from '../environ'
import jwtHelpers from '../utils/jwtHelpers'

import { UserModel, User } from '../models/user'

export const signup = async (req: Request, res: Response) => {
  const validData = await validators.signupSchema.spa(req.body)

  if (!validData.success) {
    const errorMessage = generateErrorMessage(
      validData.error.issues,
      validators.errorMessageOptions
    )
    throw createHttpError.BadRequest(errorMessage)
  }

  const foundUserEmail = await UserModel.findOne({
    email: validData.data.email,
  })

  const foundUserName = await UserModel.findOne({
    username: validData.data.username,
  })

  if (foundUserEmail) throw Error('Cannot use the email provided')

  if (foundUserName) throw Error('Cannot use the username provided')

  try {
    const user: HydratedDocument<User> = new UserModel({
      email: sanitize(validData.data.email),
      username: sanitize(validData.data.username),
      password: validData.data.confirm,
    })

    await user.save()

    const findNewUser = await UserModel.findById(user.id).select({
      password: 0,
    })

    return res
      .status(201)
      .json({ message: `${user.email} created`, findNewUser })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(422).json({ error: err.message })
    }
  }
}

export const login = async (req: Request, res: Response) => {
  const validData = await validators.loginSchema.spa(req.body)

  if (!validData.success) {
    const errorMessage = generateErrorMessage(
      validData.error.issues,
      validators.errorMessageOptions
    )
    throw createHttpError.BadRequest(errorMessage)
  }

  const user: DocumentType<User> | null = await UserModel.findOne({
    email: validData.data.email,
  })

  const correctPassword = await user?.comparePassword(validData.data.password)

  if (!correctPassword || !user) throw Error('Incorrect login credentials')

  try {
    // const accessToken = (await jwtHelpers.signAccessToken(user.id)) as any

    const accessToken = (await jwtHelpers.signAccessToken(user.id)) as string

    const decoded = jwtHelpers.verifyAccessToken(accessToken)

    return res.status(200).json({
      message: `${decoded} signed-in`,
      access: accessToken,
    })
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ error: err.message })
    }
  }
}
