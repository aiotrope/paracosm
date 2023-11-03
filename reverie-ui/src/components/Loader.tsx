import React from 'react'
import Spinner from 'react-bootstrap/Spinner'

const Loader: React.FC = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <Spinner animation="grow" role="status">
        <span className="sr-only visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )
}

export default Loader
