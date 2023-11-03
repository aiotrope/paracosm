// import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const jwtAtom = atomWithStorage('jwtAtom', { access: '', refresh: '' })
