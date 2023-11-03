import http from 'http'

import environ from './environ'
import app from './app'
import mongoConnect from './utils/mongoConnect'

const server = http.createServer(app)

const port = environ.PORT

const start = async (): Promise<void> => {
  try {
    await mongoConnect()
    server.listen(port, async () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

void start()
