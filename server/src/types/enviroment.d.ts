export {}

declare global {
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
      JWT_SECRET: string
    }
  }
}
