import mongoose, { ConnectOptions } from 'mongoose'

import environ from '../environ'

const mongoConnect = async () => {
  mongoose.set('strictQuery', false)

  // const mongodbUrl = environ.MONGODB_URL

  const mongodbDevUrl = environ.MONGODB_DEV_URL

  const options: ConnectOptions = {
    dbName: environ.MONGODB_DATABASE_NAME,
    user: environ.MONGODB_USERNAME,
    pass: environ.MONGODB_PASSWORD,
  }

  try {
    await mongoose.connect(mongodbDevUrl, options)

    console.info(`Database connected: ${mongodbDevUrl}`)
  } catch (err) {
    console.error(`Connection error: ${err}`)
    process.exit(1)
  }
}

export default mongoConnect
