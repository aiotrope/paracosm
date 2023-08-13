import path from 'path'
import dotenv from 'dotenv'

// manual loading of env variables using global types at types folder without using envalid package
// import this moules as config

dotenv.config({ path: path.resolve(__dirname, '../.env') })

interface ENV {
  NODE_ENV: string | undefined
  PORT: number | undefined
  MONGODB_CONTAINER_PORT: number | undefined
  MONGODB_LOCAL_PORT: number | undefined
  MONGODB_USERNAME: string | undefined
  MONGODB_PASSWORD: string | undefined
  MONGODB_DATABASE_NAME: string | undefined
  CLIENT_ORIGIN_DEV: string | undefined
  MONGODB_URL: string | undefined
  MONGODB_DEV_URL: string | undefined
  MONGODB_ATLAS_URL: string | undefined
  SALTWORKFACTOR: number | undefined
  PUB_KEY: string | undefined
  PRIV_KEY: string | undefined
  EXPIRESIN: string | undefined
  ISS: string | undefined
}

interface Config {
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
}

const setConfig = (): ENV => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_CONTAINER_PORT: process.env.MONGODB_CONTAINER_PORT,
  MONGODB_LOCAL_PORT: process.env.MONGODB_LOCAL_PORT,
  MONGODB_USERNAME: process.env.MONGODB_USERNAME,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
  MONGODB_DATABASE_NAME: process.env.MONGODB_DATABASE_NAME,
  CLIENT_ORIGIN_DEV: process.env.CLIENT_ORIGIN_DEV,
  MONGODB_URL: process.env.MONGODB_URL,
  MONGODB_DEV_URL: process.env.MONGODB_DEV_URL,
  MONGODB_ATLAS_URL: process.env.MONGODB_ATLAS_URL,
  SALTWORKFACTOR: process.env.SALTWORKFACTOR,
  PUB_KEY: process.env.PUB_KEY,
  PRIV_KEY: process.env.PRIV_KEY,
  EXPIRESIN: process.env.EXPIRESIN,
  ISS: process.env.ISS,
})

const getCleanENV = (config: ENV): Config => {
  /* eslint-disable-next-line no-restricted-syntax */
  for (const [key, value] of Object.entries(config))
    if (value === undefined) {
      throw new Error(`Missing key ${key} in .env`)
    }
  /* eslint-enable-next-line no-restricted-syntax */

  return config as Config
}

const config = setConfig()

const cleanEnvs = getCleanENV(config)

export default cleanEnvs
