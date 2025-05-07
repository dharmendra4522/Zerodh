import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Holdings from './components/Holdings';
import Positions from './components/Positions';
import Funds from './components/Funds';
import Apps from './components/Apps';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app">
          <Menu />
          <div className="content">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/holdings" element={
                <ProtectedRoute>
                  <Holdings />
                </ProtectedRoute>
              } />
              <Route path="/positions" element={
                <ProtectedRoute>
                  <Positions />
                </ProtectedRoute>
              } />
              <Route path="/funds" element={
                <ProtectedRoute>
                  <Funds />
                </ProtectedRoute>
              } />
              <Route path="/apps" element={
                <ProtectedRoute>
                  <Apps />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App; 