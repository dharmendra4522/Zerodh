import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      console.log("Initial user data from localStorage:", savedUser);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log("Parsed user data:", parsedUser);
        return parsedUser;
      }
      return null;
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      return null;
    }
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          console.log("Fetching user data with token");
          const response = await axios.get('http://localhost:4000/api/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          console.log("User data from API:", response.data);
          
          if (response.data.status) {
            const userData = {
              username: response.data.user?.username || response.data.user?.name,
              name: response.data.user?.name,
              email: response.data.user?.email
            };
            console.log("Setting user data from API:", userData);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Only fetch if we don't have user data
    if (!user) {
      fetchUserData();
    }
  }, [user]);

  // Update localStorage when user data changes
  useEffect(() => {
    if (user) {
      console.log("Updating localStorage with user data:", user);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      console.log("Removing user data from localStorage");
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}; 