import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import Materials from './pages/Materials';

import { Toaster } from 'react-hot-toast';

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname === '/admin' || location.pathname === '/login';

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            borderRadius: '1rem',
            padding: '1rem 1.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            fontSize: '0.875rem',
            fontWeight: '600',
            border: '1px solid #f3f4f6',
          },
        }}
      />
      {!isAdminPath && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="*" element={<div className="text-center py-20 text-xl">Page Not Found (404)</div>} />
      </Routes>
    </div>
  );
}

export default App;
