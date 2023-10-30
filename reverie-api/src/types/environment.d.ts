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
      DB_USERNAME: string
      DB_PASSWORD: string
      DB_NAME: string
      CLIENT_ORIGIN: string
      SALTWORKFACTOR: number
      PUB_KEY: string
      PRIV_KEY: string
      EXPIRESIN: string
      ISS: string
      JWT_SECRET: string
      JWT_SECRET_REFRESH: string
      EXPIRESIN_REFRESH: string
    }
  }
}

export {}
