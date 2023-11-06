import React from 'react'

const Loader: React.FC = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <p aria-busy="true"></p>
      <span className="sr-only visually-hidden">Loading...</span>
    </div>
  )
}

export default Loader
