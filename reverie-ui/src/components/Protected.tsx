import React, { lazy } from 'react'

import { useAtomValue } from 'jotai'

import { jwtAtom, expAtom } from '../atoms/store'

import { useObtainRefresh } from '../hooks/refresh'

const Dashboard = lazy(() => import('./Dashboard'))

const Protected: React.FC = () => {
  const jwt = useAtomValue(jwtAtom)

  const exp = useAtomValue(expAtom)

  if (new Date(exp) <= new Date()) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { mutate } = useObtainRefresh()

    mutate({ refreshToken: jwt.refresh })
  }
  return <Dashboard />
}

export default Protected
