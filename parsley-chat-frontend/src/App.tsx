import { Routes, Route, Navigate } from 'react-router';
import LoginScreen from './components/LoginScreen';
import ChatWindowLayout from './layouts/ChatWindowLayout';

//TODO: go through all the frontend code and add new comments so that navigating the project is easier.

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
