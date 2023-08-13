import path from 'path'
import dotenv from 'dotenv'
import { cleanEnv, port, str, num } from 'envalid'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const environ = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
  }),
  PORT: port({ default: 8080 }),
  MONGODB_CONTAINER_PORT: port(),
  MONGODB_LOCAL_PORT: port({ default: 27017 }),
  MONGODB_USERNAME: str(),
  MONGODB_PASSWORD: str(),
  MONGODB_DATABASE_NAME: str(),
  MONGODB_URL: str(),
  MONGODB_DEV_URL: str(),
  MONGODB_ATLAS_URL: str(),
  CLIENT_ORIGIN_DEV: str(),
  JWT_SECRET: str(),
  SALTWORKFACTOR: num(),
  PUB_KEY: str(),
  PRIV_KEY: str(),
  EXPIRESIN: str(),
  ISS: str(),
})

export default environ
