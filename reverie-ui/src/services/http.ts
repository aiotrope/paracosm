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
  ObtainRefreshResponse,
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

const deletePost = async (postId: string) => {
  const access = getAccessToken()
  const option = {
    withCredentials: true,
    headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' },
  }
  const { data: response } = await axios.delete(`/api/posts/${postId}`, option)

  return response
}

const obtainRefresh = async (input: ObtainRefresh) => {
  const { data: response } = await axios.post<ObtainRefreshResponse>(`/api/refresh`, input)

  return response
}

const createObtainRefresh = async (baseUrl: string, token: string) => {
  const payload = {
    refreshToken: token,
  }

  const options = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  }

  const url = baseUrl

  const response = await fetch(url, options)

  return await response.json()
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
  createObtainRefresh,
  deletePost,
}

export default httpService
