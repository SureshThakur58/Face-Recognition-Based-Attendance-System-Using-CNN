import './App.css';
import SignInOutContainer from './containers/SignInoutcontainer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Collectdata from './components/Collectdata';
import ForgotPassword from "./components/ForgotPassword";
import ViewAttendance from './components/Viewattendance';
import Exportresult from './components/Exportresult';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Check if JWT token exists

  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignInOutContainer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/cd" element={<ProtectedRoute><Collectdata /></ProtectedRoute>} />
        <Route path="/va" element={<ProtectedRoute><ViewAttendance/></ProtectedRoute>} />
        <Route path="/er" element={<ProtectedRoute><Exportresult/></ProtectedRoute>} />
        

        {/* 404 Page */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
