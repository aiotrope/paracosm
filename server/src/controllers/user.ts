import 'express-async-errors'
import { Request, Response } from 'express'
import { HydratedDocument } from 'mongoose'
import { DocumentType } from '@typegoose/typegoose'
import createHttpError from 'http-errors'
import { generateErrorMessage } from 'zod-error'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sanitize } from 'isomorphic-dompurify'

import validators from '../utils/validators'
import environ from '../environ'
// import jwt_helpers from '../utils/jwt_helpers'

import { UserModel, User } from '../models/user'

const signup = async (req: Request, res: Response) => {
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
    const saltRounds = 10

    const hashed = await bcrypt.hash(validData.data.confirm, saltRounds)

    const user: HydratedDocument<User> = new UserModel({
      email: sanitize(validData.data.email),
      username: sanitize(validData.data.username),
      hashedPassword: hashed,
    })

    await user.save()

    return res.status(201).json({ message: `${user.email} created`, user })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(422).json({ error: err.message })
    }
  }
}

const login = async (req: Request, res: Response) => {
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

  const correctPassword =
    user === null
      ? false
      : await bcrypt.compare(validData.data.password, user.hashedPassword)

  if (!(user && correctPassword)) throw Error('Incorrect login credentials')

  try {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    }

    const token = jwt.sign(payload, environ.JWT_SECRET, { expiresIn: '2h' })

    const decoded = jwt.verify(token, environ.JWT_SECRET)

    return res.status(200).json({
      message: `${decoded.email} signed-in`,
      access: token,
    })
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ error: err.message })
    }
  }
}

export default {
  signup,
  login,
}
