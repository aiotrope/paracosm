import mongoose, { ConnectOptions } from 'mongoose'

import environ from '../environ'

const mongoConnect = async (): Promise<void> => {
  mongoose.set('strictQuery', false)

  const dbURL = environ.DB_URI //* mongodb://reverieuser:fgerthzutt1230xxxty@mongo_db:27017/reveriedatabase?authSource=admin

  const options = {
    dbName: environ.DB_NAME,
    user: environ.DB_USERNAME,
    pass: environ.DB_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions

  try {
    await mongoose.connect(dbURL, options)

    console.info(`Database connected: ${dbURL}`)
  } catch (err) {
    console.error(`Connection error: ${err}`)
    process.exit(1)
  }
}

export default mongoConnect
