import path from 'path'
import dotenv from 'dotenv'
import { cleanEnv, port, str, num } from 'envalid'

dotenv.config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
})

const environ = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
  }),
  PORT: port(),
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
