import { cleanEnv, port, str } from 'envalid'

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'test', 'production'],
    }),
    PORT: port(),
    MONGODB_CONTAINER_PORT: port(),
    MONGODB_LOCAL_PORT: port(),
    MONGODB_USERNAME: str(),
    MONGODB_PASSWORD: str(),
    MONGODB_DATABASE_NAME: str(),
    CLIENT_ORIGIN_DEV: str(),
  })
}

export default validateEnv
