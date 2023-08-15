import 'express-async-errors'
import { DocumentType } from '@typegoose/typegoose'
import createHttpError from 'http-errors'
import { generateErrorMessage } from 'zod-error'
import { sanitize } from 'isomorphic-dompurify'

import jwtHelpers from '../utils/jwtHelpers'

import schema, {
  SignupType,
  LoginType,
  RefreshTokenType,
} from '../utils/schema'

import { UserModel, User } from '../models/user'

const createUser = async (request: SignupType) => {
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

  return sanitzedData
}

const authenticateUser = async (request: LoginType) => {
  const validData = await schema.LoginSchema.spa(request)

  if (!validData.success) {
    const errorMessage = generateErrorMessage(
      validData.error.issues,
      schema.errorMessageOptions
    )
    throw createHttpError.BadRequest(errorMessage)
  }

  const user: DocumentType<User> | null = await UserModel.findOne({
    email: validData.data.email,
  })

  const correctPassword = await user?.comparePassword(validData.data.password)

  if (!correctPassword || !user) throw Error('Incorrect login credentials')

  const sanitzedData = {
    email: sanitize(validData.data.email),
    password: sanitize(validData.data.password),
  }

  return sanitzedData
}

const verifyUserRefreshToken = async (request: RefreshTokenType) => {
  const validData = await schema.RefreshTokenSchema.spa(request)

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

const authenticationService = {
  createUser,
  authenticateUser,
  verifyUserRefreshToken,
}

export default authenticationService

/*
decoded {
  iat: 1691980429,
  exp: 1691984029,
  aud: '64d97bd21792944837ae7272',
  iss: 'http://localhost:8080',
  sub: '64d97bd21792944837ae7272'
}
*/
