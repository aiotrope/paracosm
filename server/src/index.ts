import http from 'http'

import config from './config'
import app from './app'

const server = http.createServer(app)

const port = config.PORT

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
