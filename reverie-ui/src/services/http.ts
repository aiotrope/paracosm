import axios from 'axios'

import {
  _Signup,
  SignupResponse,
  _Login,
  LoginResponse,
  CreatePost,
  Post,
  ObtainRefresh,
  ObtainRefreshResponse,
} from '../types/types'

const getAccessToken = () => {
  const jwtAtom = localStorage.getItem('jwtAtom')
  let token = jwtAtom ? JSON.parse(jwtAtom) : null
  if (token) return token.access
}

const getRefreshToken = () => {
  const jwtAtom = localStorage.getItem('jwtAtom')
  let token = jwtAtom ? JSON.parse(jwtAtom) : null
  if (token) return token.refresh
}

const http = axios.create({
  headers: {
    Accept: 'application/json',
  },
  timeout: 100000,
})

// Interceptor
http.interceptors.request.use(
  (config) => {
    const token = getAccessToken()

    if (token) {
      config.headers['Authorization'] = 'Bearer ' + `${token}`
    } else {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use((res) => {
  return res
})

const signup = async (input: _Signup) => {
  const { data: response } = await http<SignupResponse>({
    method: 'POST',
    url: '/api/signup',
    data: input,
  })

  return response
}

const login = async (input: _Login) => {
  const { data: response } = await http<LoginResponse>({
    method: 'POST',
    url: '/api/login',
    data: input,
  })

  return response
}

const createPost = async (input: CreatePost) => {
  const { data: response } = await http({ method: 'POST', url: '/api/posts', data: input })

  return response
}

const getPosts = async () => {
  const { data: response } = await http({ method: 'GET', url: '/api/posts' })

  return response
}

const getPost = async (postId: string) => {
  const { data: response } = await http<Post>({ method: 'GET', url: `/api/posts/${postId}` })

  return response
}

const getPostSlug = async (slug: string) => {
  const { data: response } = await http({ method: 'GET', url: `/api/posts/slug/${slug}` })

  return response
}

const deletePost = async (postId: string) => {
  const { data: response } = await http({ method: 'DELETE', url: `/api/posts/${postId}` })

  return response
}

const obtainRefresh = async (input: ObtainRefresh) => {
  const { data: response } = await http<ObtainRefreshResponse>({
    method: 'POST',
    url: `/api/refresh`,
    data: input,
  })

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
  http,
}

export default httpService
