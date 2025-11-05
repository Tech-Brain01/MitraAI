import './App.css';
import Sidebar from './Sidebar.jsx';
import Chatwindow from './Chatwindow.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import LandingPage from './LandingPage.jsx';
import { Mycontext } from './MyContext.jsx';
import { useState, useEffect } from 'react';
import { v1 as uuidv1} from 'uuid';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply , setReply] = useState("");
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxCode, setSandboxCode] = useState('');
  const [sandboxLanguage, setSandboxLanguage] = useState('javascript');
  
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    showSandbox, setShowSandbox,
    sandboxCode, setSandboxCode,
    sandboxLanguage, setSandboxLanguage,
    // Auth values
    isAuthenticated, setIsAuthenticated,
    user, setUser
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <Router>
      <div className="app">
        <Mycontext.Provider value={providerValues}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/chat" replace /> : <LandingPage />
            } />
            
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/chat" replace /> : <Login />
            } />
            
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/chat" replace /> : <Register />
            } />
            
            <Route path="/forgot-password" element={
              isAuthenticated ? <Navigate to="/chat" replace /> : <ForgotPassword />
            } />

            {/* Protected Routes */}
            <Route path="/chat" element={
              isAuthenticated ? (
                <ChatLayout 
                  isMobileMenuOpen={isMobileMenuOpen}
                  toggleMobileMenu={toggleMobileMenu}
                  closeMobileMenu={closeMobileMenu}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } />

            <Route path="/chat/:threadId" element={
              isAuthenticated ? (
                <ChatLayout 
                  isMobileMenuOpen={isMobileMenuOpen}
                  toggleMobileMenu={toggleMobileMenu}
                  closeMobileMenu={closeMobileMenu}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Mycontext.Provider>
        <Analytics />
          <SpeedInsights />
      </div>
    </Router>
  );
}

// Chat Layout Component
function ChatLayout({ isMobileMenuOpen, toggleMobileMenu, closeMobileMenu }) {
  return (
    <>
      {/* Hamburger Menu Button (Mobile Only) */}
      <button className="menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
        <i className={isMobileMenuOpen ? "fa-solid fa-times" : "fa-solid fa-bars"}></i>
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      <Sidebar isMobileOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />
      <Chatwindow />
    </>
  );
}

export default App;
