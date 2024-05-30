import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PlayerLogin() {
    const [personalId, setPersonalId] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/players/login', { personalId });
            localStorage.setItem('token', response.data.token);
            navigate('/player-dashboard');
        } catch (error) {
            console.error('Login error:', error);
            alert('Invalid login key');
        }
    };

    return (
        <div className="container">
            <h2>Player Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Login Key:</label>
                    <input type="text" value={personalId} onChange={(e) => setPersonalId(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default PlayerLogin;
