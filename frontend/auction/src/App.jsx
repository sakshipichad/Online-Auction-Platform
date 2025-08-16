import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PostAuction from './pages/PostAuction';
import AuctionDetails from './pages/AuctionDetails';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Watchlist from './pages/WatchList';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import api from './utils/api';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Verify token with backend
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (error) {
      console.error('Login validation failed:', error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <NavbarComponent user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth routes - only accessible when logged out */}
        <Route 
          path="/signin" 
          element={user ? <Navigate to="/dashboard" /> : <SignIn onLogin={handleLogin} />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/dashboard" /> : <SignUp onLogin={handleLogin} />} 
        />

        {/* Protected routes - only accessible when logged in */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/signin" replace />} 
        />
        <Route 
          path="/post-auction" 
          element={user ? <PostAuction /> : <Navigate to="/signin" replace />} 
        />
        <Route 
          path="/auction/:id" 
          element={user ? <AuctionDetails /> : <Navigate to="/signin" replace />} 
        />
        <Route 
          path="/watchlist" 
          element={user ? <Watchlist /> : <Navigate to="/signin" replace />} 
        />
        <Route 
          path="/notifications" 
          element={user ? <Notifications /> : <Navigate to="/signin" replace />} 
        />
        <Route 
          path="/profile" 
          element={user ? <Profile user={user} /> : <Navigate to="/signin" replace />} 
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

