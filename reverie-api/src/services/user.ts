import 'express-async-errors'
import { HydratedDocument } from 'mongoose'
import createHttpError from 'http-errors'
import { generateErrorMessage } from 'zod-error'
import { sanitize } from 'isomorphic-dompurify'

import UserModel, { IUser } from '../models/user'
import { User, _Signup, _Login, RefreshToken } from '../utils/types'
import jwtHelpers from '../utils/jwtHelpers'

import schema from '../utils/schema'

const create = async (request: _Signup) => {
  const validData = await schema.Signup.spa(request)

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

  const user: HydratedDocument<IUser> = new UserModel({
    email: sanitzedData.email,
    username: sanitzedData.username,
    password: sanitzedData.password,
  })

  await user.save()

  const newUser: User | null = await UserModel.findById(user.id)

  return newUser
}

const getById = async (id: string) => {
  const user = await UserModel.findById(id)
    .select({
      password: 0,
    })
    .populate('posts')
  if (!user) throw Error('User not found!')
  return user
}

const getByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email: email })
    .select({
      password: 0,
    })
    .populate('posts')
  if (!user) throw Error('User not found!')
  return user
}

const getUsers = async () => {
  const users = await UserModel.find({}).populate('posts')
  if (!users) throw Error('Cannot fetch all users!')
  return users
}

const authenticateUser = async (request: _Login) => {
  const validData = await schema.Login.spa(request)

  if (!validData.success) {
    const errorMessage = generateErrorMessage(
      validData.error.issues,

      schema.errorMessageOptions
    )
    throw createHttpError.BadRequest(errorMessage)
  }

  const user = await UserModel.findOne({
    email: validData.data.email,
  })

  const correctPassword =
    user === null ? false : await user.comparePassword(validData.data.password)

  if (!(user && correctPassword)) throw Error('Incorrect login credentials')

  const sanitzedData = {
    email: sanitize(validData.data.email),
    password: sanitize(validData.data.password),
  }

  return sanitzedData
}

const verifyUserRefreshToken = async (request: RefreshToken) => {
  const validData = await schema.RefreshToken.spa(request)

  if (!validData.success) {
    const errorMessage = generateErrorMessage(
      validData.error.issues,
      schema.errorMessageOptions
    )
    throw createHttpError.BadRequest(errorMessage)
  }
  const userId = (await jwtHelpers.verifyRefreshToken(
    validData.data.refreshToken
  )) as string

  return userId
}

const deleteUser = async (id: string) => {
  await UserModel.findByIdAndDelete(id)
}

const userService = {
  create,
  getById,
  getUsers,
  authenticateUser,
  verifyUserRefreshToken,
  deleteUser,
  getByEmail,
}

export default userService
