import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const NotFound: React.FC = () => {
  const location = useLocation()
  return (
    <div>
      <h2>HTTP 404</h2>
      <p>
        We don&apos;t have <strong>{location.pathname}</strong> route exist! Please go back to{' '}
        <Link to={'/'}>home page</Link>
      </p>
    </div>
  )
}

export default NotFound
