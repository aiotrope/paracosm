import React from 'react'

const Header: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <a href={'/'}>
            <strong>Reverie</strong>
          </a>
        </li>
      </ul>
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
          <a href={'/'} role="button">
            Login
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Header
