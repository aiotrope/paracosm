import axios from 'axios'
import { SignupType, LoginType, LoginResponse } from '../schema/schema'

const signup = async (input: SignupType) => {
  const { data: newUser } = await axios.post(`/api/signup`, input)

  return newUser
}

const login = async (input: LoginType) => {
  const { data: user } = await axios.post<LoginResponse>(`/api/login`, input)

  return user
}

const httpService = {
  signup,
  login,
}

export default httpService
