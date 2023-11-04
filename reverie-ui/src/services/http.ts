import axios from 'axios'

import { Signup, SignupResponse, Login, LoginResponse } from '../types/types'

const signup = async (input: Signup) => {
  const { data: response } = await axios.post<SignupResponse>(`/api/signup`, input)

  return response
}

const login = async (input: Login) => {
  const { data: response } = await axios.post<LoginResponse>(`/api/login`, input)

  return response
}

const httpService = {
  signup,
  login,
}

export default httpService
