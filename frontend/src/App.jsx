import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import GetStartedPage from './pages/GetStartedPage'
import TestFlow from './pages/TestFlow'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/get-started" element={<GetStartedPage />} />
      <Route path="/test-flow" element={<TestFlow />} />
    </Routes>
  )
}

export default App
