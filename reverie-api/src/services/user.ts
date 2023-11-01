import 'express-async-errors'
import { DocumentType } from '@typegoose/typegoose'
import createHttpError from 'http-errors'
import { generateErrorMessage } from 'zod-error'
import { sanitize } from 'isomorphic-dompurify'

import { UserModel, User } from '../models/user'
import jwtHelpers from '../utils/jwtHelpers'

import schema, {
  SignupType,
  LoginType,
  RefreshTokenType,
} from '../utils/schema'

type PublicUser = Omit<User, 'password'>

const create = async (request: Partial<User>) => {
  const validData = await schema.SignupSchema.spa(request)

  if (!validData.success) {
    const errorMessage = generateErrorMessage(
      validData.error.issues,
      schema.errorMessageOptions
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

  const sanitzedData = {
    email: sanitize(validData.data.email),
    username: sanitize(validData.data.username),
    password: validData.data.confirm,
  }

  const user = new UserModel({
    email: sanitzedData.email,
    username: sanitzedData.username,
    password: sanitzedData.password,
  })

  await user.save()

  const newUser: PublicUser | null = await UserModel.findById(user.id)

  return newUser
}

const getById = async (id: string) => {
  const user: PublicUser = await UserModel.findById(id).select({
    password: 0,
  })
if (!user) throw Error('User not found!')
  return user
}

const getUsers = async () => {
  const users: PublicUser[] = await UserModel.find({}, { password: 0 })
  if (!users) throw Error('Cannot fetch all users!')
  return users
}

const userService = {
  create,
  getById,
  getUsers,
}

export default userService
