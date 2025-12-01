import { Routes, Route, Navigate } from 'react-router';
import LoginScreen from './components/auth/LoginScreen';
import ChatWindowLayout from './layouts/ChatWindowLayout';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/chat" element={<ChatWindowLayout />} />
    </Routes>
  )
}

export default App
