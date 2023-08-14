import { UserModel } from '../models/user'

declare global {
  namespace Express {
    interface Request {
      currentUser: UserModel
      access: string
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
      PORT: number
      MONGODB_CONTAINER_PORT: number
      MONGODB_LOCAL_PORT: number
      MONGODB_USERNAME: string
      MONGODB_PASSWORD: string
      MONGODB_DATABASE_NAME: string
      CLIENT_ORIGIN_DEV: string
      MONGODB_URL: string
      MONGODB_DEV_URL: string
      MONGODB_ATLAS_URL: string
      SALTWORKFACTOR: number
      PUB_KEY: string
      PRIV_KEY: string
      EXPIRESIN: string
      ISS: string
      JWT_SECRET: string
      JWT_SECRET_REFRESH: string
    }
  }
}

export {}
