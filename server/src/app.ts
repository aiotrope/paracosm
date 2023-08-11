import express, { Application } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import nocache from 'nocache'
import morgan from 'morgan'

import environ from './environ'

import indexRouter from './routes/index'

const app: Application = express()

app.use(cookieParser())

app.use(
  cors({
    origin: [environ.CLIENT_ORIGIN_DEV],
    credentials: true,
    optionsSuccessStatus: 200,
  })
)

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.disable('x-powered-by')

app.use(helmet())

app.use(nocache())

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use('/', indexRouter)

export default app
