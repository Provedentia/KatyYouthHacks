import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import GetStartedPage from './pages/GetStartedPage'
import TestFlow from './pages/TestFlow'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import UserProfile from './pages/UserProfile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<GetStartedPage />} />
      <Route path="/test-flow" element={<TestFlow />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/user-profile" element={<UserProfile />} />
    </Routes>
  )
}

export default App
