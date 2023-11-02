import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiRoot } from 'jotai'

import './sass/_index.scss'

const root = ReactDOM.createRoot(document.getElementById('root')!)

const queryClient = new QueryClient()

export const App = lazy(() => import('./App.tsx'))

const Loader = lazy(() => import('./components/Loader.tsx'))

root.render(
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <QueryClientProvider client={queryClient}>
        <JotaiRoot>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </JotaiRoot>
      </QueryClientProvider>
    </Suspense>
  </React.StrictMode>
)
