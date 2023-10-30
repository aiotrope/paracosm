import { mongoose } from '@typegoose/typegoose'

import environ from '../environ'

const mongoConnect = async (): Promise<void> => {
  mongoose.set('strictQuery', false)

  // for dockerize server app
  // const mongodbUrl = environ.MONGODB_URL

  // uncomment if only need the mongodb image as database without dockerizing the whole app
  // const mongodbDevUrl = environ.MONGODB_DEV_URL

  // for general local dev with Atlas
  const dbUrl = `mongodb://${environ.DB_USERNAME}:${environ.DB_PASSWORD}`

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions

  try {
    await mongoose.connect(dbUrl, options)

    console.info(`Database connected: ${dbUrl}`)
  } catch (err) {
    console.error(`Connection error: ${err}`)
    process.exit(1)
  }
}

export default mongoConnect
