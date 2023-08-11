import http from 'http'

import environ from './environ'
import app from './app'
import mongoConnect from './utils/mongoConnect'

const server = http.createServer(app)

const port = environ.PORT

server.listen(port, async () => {
  console.log(`Server is running on port ${port}`)

  await mongoConnect()
})
