import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import GetStartedPage from './pages/GetStartedPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/get-started" element={<GetStartedPage />} />
    </Routes>
  )
}

export default App
