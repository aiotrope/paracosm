import path from 'path'
import dotenv from 'dotenv'
import { cleanEnv, port, str } from 'envalid'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const environ = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
  }),
  PORT: port({ default: 8081 }),
  MONGODB_CONTAINER_PORT: port(),
  MONGODB_LOCAL_PORT: port({ default: 27017 }),
  MONGODB_USERNAME: str(),
  MONGODB_PASSWORD: str(),
  MONGODB_DATABASE_NAME: str(),
  CLIENT_ORIGIN_DEV: str(),
})

export default environ
