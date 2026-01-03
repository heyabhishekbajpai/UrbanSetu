import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
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
    // Check active session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Set user immediately from session
          setUser({
            ...session.user,
            userType: session.user.user_metadata?.role || 'citizen',
            name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          });

          // Fetch full profile in background
          fetchProfile(session.user).catch(err => console.error('Background profile fetch failed:', err));
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.id);
      if (session?.user) {
        // Don't await fetchProfile here to avoid blocking or race conditions
        // Just set the basic user from session first
        setUser(prev => {
          // Keep existing profile data if we already have it and IDs match
          if (prev?.id === session.user.id) {
            return { ...prev, ...session.user };
          }
          return session.user;
        });

        // Optionally trigger profile fetch in background without blocking
        fetchProfile(session.user).catch(err => console.error('Background profile fetch failed:', err));
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (authUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist (e.g. first google login without trigger), we might need to create it or handle it.
        // For now, we'll just set the auth user with basic metadata
        setUser({
          ...authUser,
          userType: authUser.user_metadata?.role || 'citizen', // Fallback
          name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          phone: authUser.user_metadata?.phone || authUser.phone || '',
        });
      } else {
        setUser({
          ...authUser,
          ...data,
          userType: data.role, // Ensure consistent naming
          name: data.full_name,
          phone: data.phone || authUser.user_metadata?.phone || authUser.phone || '',
        });
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
    // Removed finally { setLoading(false) } to avoid interfering with main loading state
  };

  const login = async (email, password, userType) => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email, 'as', userType);

      let authData = null;
      let authError = null;

      // 1. Try standard Supabase Library Login with a short timeout (5s)
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('TIMEOUT')), 5000)
        );

        const { data, error } = await Promise.race([
          supabase.auth.signInWithPassword({ email, password }),
          timeoutPromise
        ]);

        if (error) throw error;
        authData = data;
      } catch (err) {
        // 2. If Library Login times out or fails, try REST API Fallback
        console.warn('Standard login failed/timed out, attempting REST API fallback...', err.message);

        if (err.message === 'TIMEOUT' || err.message.includes('timeout')) {
          const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
          const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

          const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
            },
            body: JSON.stringify({ email, password }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error_description || result.msg || 'Login failed');
          }

          // Manually set the session in the Supabase client
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: result.access_token,
            refresh_token: result.refresh_token,
          });

          if (sessionError) throw sessionError;
          authData = { user: sessionData.user };
          console.log('REST API Fallback successful');
        } else {
          throw err; // Re-throw if it was a genuine error (e.g. wrong password) not a timeout
        }
      }

      if (!authData?.user) {
        throw new Error('Authentication failed');
      }

      console.log('Auth successful, checking role...');

      // Check role from metadata
      const metadataRole = authData.user.user_metadata?.role;

      if (metadataRole && metadataRole !== userType) {
        console.warn('Role mismatch. Expected:', userType, 'Got:', metadataRole);
        await supabase.auth.signOut();
        throw new Error(`Unauthorized. Please login as ${metadataRole}.`);
      }

      console.log('Login successful');
      toast.success('Logged in successfully!');
      return { success: true, user: authData.user };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (userType) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            // We can pass prompt: 'consent' to force account selection
            access_type: 'offline',
            prompt: 'consent',
          },
          // We can try to pass role in metadata, but it's better to handle post-login
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      // Note: The actual redirect happens here, so code below might not run immediately
      // The onAuthStateChange will catch the session after redirect
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Google login failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithPhone = async (phone) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });

      if (error) throw error;

      toast.success('OTP sent successfully!');
      return { success: true, data };
    } catch (error) {
      console.error('Phone login error:', error);
      toast.error(error.message || 'Failed to send OTP');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (phone, token, userType) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: token,
        type: 'sms',
      });

      if (error) throw error;

      if (data.user) {
        // Update user metadata if needed, or check role
        // For now, we assume if they can verify OTP, they are logged in
        // Ideally we should check/set role here similar to email login

        // If it's a new user, we might want to set the role
        if (!data.user.user_metadata?.role) {
          await supabase.auth.updateUser({
            data: { role: userType }
          });
        }
      }

      toast.success('Phone login successful!');
      return { success: true, user: data.user };
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.message || 'Invalid OTP');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);

      const { email, password, name, phone, userType, department } = userData;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: userType,
            phone: phone, // Storing in metadata as well
            department: department || null,
          },
        },
        phone: phone, // Pass phone explicitly to store in auth.users phone column
      });

      if (error) throw error;

      if (data.user) {
        // If we have a user, we should ensure the profile is created/updated with all details
        // The trigger might have created it, but let's update to be sure about phone/dept
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: email,
            full_name: name,
            role: userType,
            phone: phone,
            department: department || null,
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error updating profile:', profileError);
          // Don't fail the whole registration if profile update fails, but warn
        }
      }

      toast.success('Registration successful! Please check your email for verification.');
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const updateProfile = async (updates) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);

        if (error) throw error;

        // Refresh local user state
        await fetchProfile(user);
        toast.success('Profile updated successfully');
      } catch (error) {
        console.error('Update profile error:', error);
        toast.error('Failed to update profile');
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    loginWithPhone,
    verifyOtp,
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
