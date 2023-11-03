import React from 'react'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-hot-toast'

import { User } from '../schema/schema'

import { jwtAtom } from '../atoms/user'

type PublicUser = Omit<User, 'password'>

const AuthTopNav: React.FC = () => {
  const jwt = useAtomValue(jwtAtom)

  const decoded: PublicUser = jwtDecode(jwt?.access)

  const resetJwt = useResetAtom(jwtAtom)
  const onLogout = () => {
    resetJwt()
    toast.success(`${decoded?.username} successfully logout`)
  }

  // console.log('DECODE', decoded)
  return (
    <ul>
      <li>
        <a href={'/'}>Home</a>
      </li>
      <li>
        <a href={'/about'}>About</a>
      </li>
      <li>
        <a href={'/'}>Dashboard</a>
      </li>
      <li>
        <button onClick={onLogout}>Logout</button>
      </li>
    </ul>
  )
}

export default AuthTopNav
