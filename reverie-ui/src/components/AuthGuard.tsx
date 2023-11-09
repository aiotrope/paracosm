/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useAtomValue } from 'jotai'
import { Navigate } from 'react-router-dom'

import { jwtAtom } from '../atoms/store'
import Dashboard from './Dashboard'

const AuthGuard: React.FC = () => {
  const jwt = useAtomValue(jwtAtom)

  const authenticated = jwt.access !== '' && jwt.refresh !== '' ? true : false

  return authenticated ? <Dashboard /> : <Navigate to={'/login'} />
}

export default AuthGuard
