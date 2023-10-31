import path from 'path'
import dotenv from 'dotenv'
import { cleanEnv, port, str, num } from 'envalid'

dotenv.config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
})

/* const NODE_ENV = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 8080
const DB_URI = process.env.DB_URI || 'mongodb://mongo_db:27017'
const DB_USERNAME = process.env.DB_USERNAME || ''
const DB_PASSWORD = process.env.DB_PASSWORD || ''
const DB_NAME = process.env.DB_NAME || ''
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || ''
const SALTWORKFACTOR = process.env.SALTWORKFACTOR || 12
const PUB_KEY = process.env.PUB_KEY || ''
const PRIV_KEY = process.env.PRIV_KEY || ''
const EXPIRESIN = process.env.EXPIRESIN || ''
const EXPIRESIN_REFRESH = process.env.EXPIRESIN_REFRESH || ''
const ISS = process.env.ISS || ''
const JWT_SECRET = process.env.JWT_SECRET || ''
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH || ''

const environ = {
  NODE_ENV,
  PORT,
  DB_URI,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  CLIENT_ORIGIN,
  SALTWORKFACTOR,
  PUB_KEY,
  PRIV_KEY,
  EXPIRESIN,
  EXPIRESIN_REFRESH,
  ISS,
  JWT_SECRET,
  JWT_SECRET_REFRESH,
} */

const environ = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
  }),
  PORT: port({ default: 8080 }),
  DB_URI: str(),
  DB_USERNAME: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),
  CLIENT_ORIGIN: str(),
  SALTWORKFACTOR: num(),
  PUB_KEY: str(),
  PRIV_KEY: str(),
  EXPIRESIN: str(),
  EXPIRESIN_REFRESH: str(),
  ISS: str(),
  JWT_SECRET: str(),
  JWT_SECRET_REFRESH: str(),
})
export default environ
