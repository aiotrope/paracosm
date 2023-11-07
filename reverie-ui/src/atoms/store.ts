import { atomWithStorage } from 'jotai/utils'
// import { atom } from 'jotai'
// import { Post } from '../types/types'

// export const store = createStore()

export const jwtAtom = atomWithStorage('jwtAtom', { access: '', refresh: '' })

export const postsAtom = atomWithStorage('postsAtom', [])

// export const slugAtom = atom('')
