import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai'

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
