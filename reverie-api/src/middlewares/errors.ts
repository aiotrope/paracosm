import 'express-async-errors'
import { Request, Response, NextFunction } from 'express'
import createHttpError, { HttpError } from 'http-errors'

const endPoint404 = (_req: Request, _res: Response, next: NextFunction) => {
  next(createHttpError(404))
}

const errorHandler = (
  error: HttpError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({
      error: `${error.name}: ${error.message}`,
    })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({ error: error.message })
  }

  if (error.name === 'MongoServerError') {
    return res.status(500).json({ error: error.message })
  }

  if (error.name === 'TypeError') {
    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'JsonWebTokenError') {
    return res
      .status(401)
      .json({ error: 'Missing or incorrect authentication token' })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Auth token expired!' })
  }

  if (error.message === 'Cannot use the email provided') {
    return res.status(409).json({ error: error.message })
  }

  if (error.message === 'Cannot use the username provided') {
    return res.status(409).json({ error: error.message })
  }

  if (error.message === 'Cannot fetch all users!') {
    return res.status(422).json({ error: error.message })
  }

  if (error.message === 'User not found!') {
    return res.status(404).json({ error: error.message })
  }

  if (error.message === 'Incorrect login credentials') {
    return res.status(401).json({ error: error.message })
  }

  if (error.message === 'Cannot use the post title provided') {
    return res.status(409).json({ error: error.message })
  }

  if (error.message === 'Cannot fetch all posts!') {
    return res.status(422).json({ error: error.message })
  }

  if (error.message === 'Post not found!') {
    return res.status(404).json({ error: error.message })
  }

  res.status(error.status || 500)
  res.send({
    error: error.message,
  })

  next(error)
}

const errorMiddleware = { errorHandler, endPoint404 }

export default errorMiddleware
