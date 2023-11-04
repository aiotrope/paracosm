import express, { Application } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'

import environ from './environ'
import errorMiddleware from './middlewares/errors'

import ckeckerRouter from './routes/checker'
import userRouter from './routes/user'
import postRouter from './routes/post'

const app: Application = express()

app.use(cookieParser())

app.use(
  cors({
    origin: [environ.CLIENT_ORIGIN],
    credentials: true,
    optionsSuccessStatus: 200,
  })
)

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.disable('x-powered-by')

app.use(mongoSanitize())

app.use(helmet())

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use('/', ckeckerRouter)

app.use('/', userRouter)

app.use('/posts', postRouter)

app.use(errorMiddleware.endPoint404)

app.use(errorMiddleware.errorHandler)

export default app
