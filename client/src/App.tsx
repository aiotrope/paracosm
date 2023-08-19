import { ThemeProvider } from '@mui/material'

import NavBar from './components/NavBar'
import { theme } from './styles/theme'
// import './App.css'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <div>
        <h1>Hello</h1>
      </div>
    </ThemeProvider>
  )
}

export default App
