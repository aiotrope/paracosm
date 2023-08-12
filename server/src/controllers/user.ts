import 'express-async-errors'
import { Request, Response } from 'express'
import { HydratedDocument } from 'mongoose'
import createHttpError from 'http-errors'
import { generateErrorMessage } from 'zod-error'
import bcrypt from 'bcrypt'
import { sanitize } from 'isomorphic-dompurify'

import validators from '../utils/validators'

import { UserModel, UserClass } from '../models/user'

const signup = async (req: Request, res: Response) => {
  const foundUserEmail = await UserModel.findOne({ email: req.body.email })

  const foundUserName = await UserModel.findOne({ username: req.body.username })

  const validData = validators.signupSchema.safeParse(req.body)

  if (!validData.success) {
    const errorMessage = generateErrorMessage(
      validData.error.issues,
      validators.errorMessageOptions
    )
    throw createHttpError.BadRequest(errorMessage)
  }

  if (foundUserEmail) throw Error('Cannot use the email provided')

  if (foundUserName) throw Error('Cannot use the username provided')

  try {
    const saltRounds = 10

    const hashed = await bcrypt.hash(validData.data.confirm, saltRounds)

    const user: HydratedDocument<UserClass> = new UserModel({
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

export default {
  signup,
}
