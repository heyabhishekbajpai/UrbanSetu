import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

// Components
import LandingPage from './components/LandingPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import CitizenDashboard from './components/citizen/CitizenDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import ReportComplaint from './components/citizen/ReportComplaint';
import ComplaintTracking from './components/citizen/ComplaintTracking';
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Citizen Routes */}
              <Route path="/citizen" element={
                <ProtectedRoute userType="citizen">
                  <CitizenDashboard />
                </ProtectedRoute>
              } />
              <Route path="/citizen/report" element={
                <ProtectedRoute userType="citizen">
                  <ReportComplaint />
                </ProtectedRoute>
              } />
              <Route path="/citizen/tracking/:id" element={
                <ProtectedRoute userType="citizen">
                  <ComplaintTracking />
                </ProtectedRoute>
              } />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute userType="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Profile Route */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
            </Routes>
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#48bb78',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#e53e3e',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
