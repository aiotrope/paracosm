import React, { lazy } from 'react'
import { useAtomValue } from 'jotai'

import { jwtAtom } from '../atoms/store'

const AuthTopNav = lazy(() => import('./AuthTopNav'))

const UnauthTopNav = lazy(() => import('./UnauthTopNav'))

const Header: React.FC = () => {
  const jwt = useAtomValue(jwtAtom)

  return (
    <div className="container">
      <nav>
        <ul>
          <li>
            <a href={'/'}>
              <strong>Reverie</strong>
            </a>
          </li>
        </ul>
        {jwt.access !== '' ? <AuthTopNav /> : <UnauthTopNav />}
      </nav>
    </div>
  )
}

export default Header
