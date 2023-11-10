import React, { lazy } from 'react'
import { useAtomValue } from 'jotai'
import { NavLink } from 'react-router-dom'

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
            <NavLink to={'/'}>
              <strong>Reverie</strong>
            </NavLink>
          </li>
        </ul>
        {jwt.access !== '' ? <AuthTopNav /> : <UnauthTopNav />}
      </nav>
    </div>
  )
}

export default Header
