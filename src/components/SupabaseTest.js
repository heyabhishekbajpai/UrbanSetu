import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const SupabaseTest = () => {
  const [status, setStatus] = useState('Checking connection...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        // Try to fetch data from a table, or just check the session
        // A simple way to test connection without needing a specific table is to get the session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        console.log('Supabase connection successful:', data);
        setStatus('Connected to Supabase successfully!');
      } catch (err) {
        console.error('Supabase connection error:', err);
        setError(err.message);
        setStatus('Failed to connect to Supabase.');
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="p-4 border rounded shadow-md bg-white dark:bg-gray-800 dark:text-white max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
      <div className={`p-3 rounded ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
        <p className="font-medium">{status}</p>
        {error && <p className="text-sm mt-2">{error}</p>}
      </div>
      <p className="text-sm text-gray-500 mt-4">Check the browser console for detailed logs.</p>
    </div>
  );
};

export default SupabaseTest;
