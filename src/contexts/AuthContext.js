import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('urbansetu-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('urbansetu-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType) => {
    try {
      setLoading(true);
      
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual user data from API
      const mockUser = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        userType,
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=48bb78&color=fff`,
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem('urbansetu-user', JSON.stringify(mockUser));
      
      toast.success(`Welcome back, ${mockUser.name}!`);
      return { success: true, user: mockUser };
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Simulate API call - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual user data from API
      const mockUser = {
        id: Date.now().toString(),
        ...userData,
        avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=48bb78&color=fff`,
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem('urbansetu-user', JSON.stringify(mockUser));
      
      toast.success(`Welcome to UrbanSetu, ${mockUser.name}!`);
      return { success: true, user: mockUser };
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('urbansetu-user');
    toast.success('Logged out successfully');
  };

  const updateProfile = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('urbansetu-user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
