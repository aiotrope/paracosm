import React from 'react'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-hot-toast'

import { jwtAtom } from '../atoms/user'

const AuthTopNav: React.FC = () => {
  const jwt = useAtomValue(jwtAtom)

  const decoded: User = jwtDecode(jwt?.access)

  const resetJwt = useResetAtom(jwtAtom)
  const onLogout = () => {
    resetJwt()
    toast.success(`${decoded?.username} successfully logout`)
  }

  // console.log('DECODE', decoded)
  return (
    <ul>
      <li>
        <a href={'/about'}>About</a>
      </li>
      <li>
        <a href={'/dashboard'}>Dashboard</a>
      </li>
      <li>
        <button className="secondary">{decoded.username}</button>
      </li>
      <li>
        <button onClick={onLogout} className="outline">
          Logout
        </button>
      </li>
    </ul>
  )
}

export default AuthTopNav
