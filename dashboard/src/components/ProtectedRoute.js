import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:4000/api/verify-token', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.data.status) {
          localStorage.removeItem('token');
          setUser(null);
          setIsLoading(false);
          navigate('/login');
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        setUser(null);
        setIsLoading(false);
        navigate('/login');
      }
    };

    verifyToken();
  }, [setUser, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 