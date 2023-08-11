import express, { Application } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import nocache from 'nocache'
import morgan from 'morgan'

import config from './config'
import validateEnv from './utils/validateEnv'

import indexRouter from './routes/index'

validateEnv()

const app: Application = express()

app.use(cookieParser())

app.use(
  cors({
    origin: [config.CLIENT_ORIGIN_DEV],
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
