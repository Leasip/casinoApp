import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [personalId, setPersonalId] = useState('');
    const navigate = useNavigate();

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/admin/login', { username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Admin login error:', error);
            alert('Invalid admin credentials');
        }
    };

    const handlePlayerLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/players/login', { personalId });
            localStorage.setItem('token', response.data.token);
            navigate('/player-dashboard');
        } catch (error) {
            console.error('Player login error:', error);
            alert('Invalid login key');
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <div className="login-forms">
                <div className="login-form">
                    <h3>Admin Login</h3>
                    <form onSubmit={handleAdminLogin}>
                        <div>
                            <label>Username:</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>
                <div className="login-form">
                    <h3>Player Login</h3>
                    <form onSubmit={handlePlayerLogin}>
                        <div>
                            <label>Login Key:</label>
                            <input type="text" value={personalId} onChange={(e) => setPersonalId(e.target.value)} required />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
