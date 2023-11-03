import React from 'react'

const UnauthTopNav: React.FC = () => {
  return (
    <ul>
      <li>
        <a href={'/'}>Home</a>
      </li>
      <li>
        <a href={'/about'}>About</a>
      </li>
      <li>
        <a href={'/signup'}>Signup</a>
      </li>
      <li>
        <a href={'/login'} role="button">
          Login
        </a>
      </li>
    </ul>
  )
}

export default UnauthTopNav
