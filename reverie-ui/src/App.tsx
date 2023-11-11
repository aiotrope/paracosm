import React, { lazy } from 'react'
import { Toaster } from 'react-hot-toast'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import Container from 'react-bootstrap/Container'

import './sass/_App.scss'

const Header = lazy(() => import('./components/Header.tsx'))
const RouterList = lazy(() => import('./components/RouterList.tsx'))

const App: React.FC = () => {
  return (
    <>
      <Header />
      <main className="my-5">
        <Container style={{ minHeight: '50px' }}>
          <Toaster
            toastOptions={{
              duration: 5000,
            }}
          />
          <RouterList />
        </Container>
      </main>
    </>
  )
}

export default App
