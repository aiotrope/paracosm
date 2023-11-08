import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai'
// import { Post } from '../types/types'

// export const store = createStore()

/* interface UserObj {
  id: string
  email: string
  posts: string[]
}

interface InitPostObj {
  id: string
  title: string
  description: ''
  entry: string
  createdAt: Date
  updatedAt: Date
}

interface PostObj extends InitPostObj {
  user: UserObj
} */

export const jwtAtom = atomWithStorage('jwtAtom', { access: '', refresh: '' })

export const postsAtom = atomWithStorage('postsAtom', [
  {
    id: '',
    title: '',
    description: '',
    entry: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { id: '', email: '', posts: [''] },
    slug: '',
  },
])

export const postAtom = atom({
  id: '',
  title: '',
  description: '',
  entry: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  user: { id: '', email: '', posts: [''] },
  slug: '',
})
