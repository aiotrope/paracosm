// import { createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { User, Post } from '../types/types'

// export const store = createStore()

export const jwtAtom = atomWithStorage('jwtAtom', { access: '', refresh: '' })

const postObj: Post = {
  id: '',
  title: '',
  description: '',
  entry: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  slug: '',
  user: {
    id: '',
    username: '',
    email: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    posts: {
      id: '',
      title: '',
      description: '',
      entry: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      slug: '',
    },
  },
}

const userObj: User = {
  id: '',
  username: '',
  email: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  posts: {
    id: '',
    title: '',
    description: '',
    entry: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: '',
    user: {
      id: '',
      username: '',
      email: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
}

export const postsAtom = atomWithStorage('postsAtom', [{ postObj, userObj }])
