import axios from 'axios'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import httpService from './http'

const access = httpService.getAccessToken()

const refresh = httpService.getRefreshToken()

export const notBefore = () => {
  const decoded: JwtPayload = jwtDecode(access)

  if (typeof decoded.nbf === 'number') {
    let nbf = new Date(decoded.nbf)

    if (nbf >= new Date()) {
      console.log('Hello')
    }
  }
}
