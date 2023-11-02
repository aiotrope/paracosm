import React, { lazy } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

const Header = lazy(() => import('./components/Header.tsx'))
const RouterList = lazy(() => import('./components/RouterList.tsx'))

const App: React.FC = () => {
  return (
    <div className="container">
      <Header />
      <main>
        <ToastContainer theme="colored" />
        <RouterList />
      </main>
    </div>
  )
}

export default App
