import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || !user) {
      // Use navigate instead of window.location for smoother transition
      navigate('/login', { replace: true });
    }
  }, [token, user, navigate]);

  // Show loading state while checking authentication
  if (!token || !user) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute; 