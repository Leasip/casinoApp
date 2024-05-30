import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PlayerDashboard() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('/players/dashboard', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setMessage(response.data.message);
        })
        .catch(error => {
            console.error('Error fetching player dashboard data', error);
            setMessage('You are not authorized to view this page.');
        });
    }, []);

    return (
        <div className="container">
            <h2>Player Dashboard</h2>
            <p>{message}</p>
        </div>
    );
}

export default PlayerDashboard;
