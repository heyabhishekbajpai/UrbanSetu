import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const DebugLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('Idle');
    const [logs, setLogs] = useState([]);

    const addLog = (msg) => setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1]} - ${msg}`]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus('Logging in...');
        addLog(`Attempting login for ${email}`);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                addLog(`Error: ${error.message}`);
                setStatus('Error');
            } else {
                addLog(`Success! User ID: ${data.user.id}`);
                addLog(`Metadata: ${JSON.stringify(data.user.user_metadata)}`);
                setStatus('Success');
            }
        } catch (err) {
            addLog(`Exception: ${err.message}`);
            setStatus('Exception');
        }
    };

    const handleDirectFetch = async (e) => {
        e.preventDefault();
        setStatus('Testing Direct Fetch...');
        addLog(`Attempting direct fetch to Supabase Auth API...`);

        try {
            const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
            const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseKey) {
                throw new Error('Missing env vars');
            }

            const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey,
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                addLog(`Fetch Error: ${data.error_description || data.msg || response.statusText}`);
                setStatus('Fetch Error');
            } else {
                addLog(`Fetch Success! Access Token received.`);
                setStatus('Fetch Success');
            }
        } catch (err) {
            addLog(`Fetch Exception: ${err.message}`);
            setStatus('Fetch Exception');
        }
    };

    const clearStorage = () => {
        localStorage.clear();
        addLog('Local storage cleared.');
        window.location.reload();
    };

    return (
        <div className="p-8 max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Debug Login</h2>
            <div className="mb-4 flex gap-2">
                <button onClick={clearStorage} className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">
                    Clear Local Storage
                </button>
            </div>
            <form className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                />
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleLogin} className="w-full p-2 bg-blue-600 text-white rounded">
                        Lib Login
                    </button>
                    <button onClick={handleDirectFetch} className="w-full p-2 bg-green-600 text-white rounded">
                        Direct Fetch
                    </button>
                </div>
            </form>
            <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs font-mono h-48 overflow-auto">
                <p className="font-bold">Status: {status}</p>
                {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
        </div>
    );
};

export default DebugLogin;
