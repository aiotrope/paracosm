import axios from 'axios'
import { SignupType, User } from '../schema/schema'

const signup = async (input: SignupType) => {
  const { data: newUser } = await axios.post<User>(`/api/signup`, input)

  return newUser
}

const httpService = {
  signup,
}

export default httpService
