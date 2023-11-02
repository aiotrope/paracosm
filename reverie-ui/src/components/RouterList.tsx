import React, { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./Home'))
const About = lazy(() => import('./About'))
const Signup = lazy(() => import('./Signup'))
const Login = lazy(() => import('./Login'))

const RouterList: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default RouterList
