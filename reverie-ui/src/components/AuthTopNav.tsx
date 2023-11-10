import React from 'react'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-hot-toast'
import { useNavigate, NavLink } from 'react-router-dom'

import { jwtAtom } from '../atoms/store'
import { User } from '../types/types'

const AuthTopNav: React.FC = () => {
  const jwt = useAtomValue(jwtAtom)

  const decoded: User = jwtDecode(jwt?.access)

  const navigate = useNavigate()

  const resetJwt = useResetAtom(jwtAtom)
  const onLogout = () => {
    toast.success(`${decoded?.username} successfully logout`)
    resetJwt()
    localStorage.clear()
    navigate('/login')
  }

  // console.log('DECODE', decoded)
  return (
    <ul>
      <li>
        <NavLink to={'/about'}>About</NavLink>
      </li>
      <li>
        <NavLink to={'/dashboard'}>Dashboard</NavLink>
      </li>
      <li>
        <NavLink to={'/profile'} role="button" className="secondary">
          {decoded.username}
        </NavLink>
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
