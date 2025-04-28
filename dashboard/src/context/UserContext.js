import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user data...');
        const { data } = await axios.get('http://localhost:4000/api', {
          withCredentials: true
        });
        console.log('User data received:', data);
        if (data.status) {
          setUser(data.user);
          console.log('User set in context:', data.user);
        } else {
          console.log('No user data received:', data);
        }
      } catch (error) {
        console.error('Error fetching user:', error.response?.data || error.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}; 