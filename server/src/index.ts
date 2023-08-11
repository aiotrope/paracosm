import http from 'http'

// import config from './config'
import environ from './environ'
import app from './app'

const server = http.createServer(app)

const port = environ.PORT

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
