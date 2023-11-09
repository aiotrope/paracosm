import axios from 'axios'

import {
  _Signup,
  SignupResponse,
  _Login,
  LoginResponse,
  CreatePost,
  JWTToken,
  Post,
  ObtainRefresh,
} from '../types/types'

const signup = async (input: _Signup) => {
  const { data: response } = await axios.post<SignupResponse>(`/api/signup`, input)

  return response
}

const login = async (input: _Login) => {
  const { data: response } = await axios.post<LoginResponse>(`/api/login`, input)

  return response
}

const getAccessToken = () => {
  const token: JWTToken = JSON.parse(localStorage.getItem('jwtAtom') || '')
  return token?.access
}

const getRefreshToken = () => {
  const token: JWTToken = JSON.parse(localStorage.getItem('jwtAtom') || '')
  return token?.refresh
}

const createPost = async (input: CreatePost) => {
  const access = getAccessToken()
  const option = {
    withCredentials: true,
    headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' },
  }
  const { data: response } = await axios.post(`/api/posts`, input, option)

  return response
}

const getPosts = async () => {
  const { data: response } = await axios.get(`/api/posts`)

  return response
}

const getPost = async (postId: string) => {
  const { data: response } = await axios.get<Post>(`/api/posts/${postId}`)

  return response
}

const getPostSlug = async (slug: string) => {
  const { data: response } = await axios.get(`/api/posts/slug/${slug}`)

  return response
}

const obtainRefresh = async (input: ObtainRefresh) => {
  const { data: response } = await axios.post<LoginResponse>(`/api/refresh`, input)

  return response
}

const httpService = {
  signup,
  login,
  createPost,
  getAccessToken,
  getRefreshToken,
  getPosts,
  getPostSlug,
  getPost,
  obtainRefresh,
}

export default httpService
