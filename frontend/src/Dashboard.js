import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('/admin/dashboard', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setMessage(response.data.message);
        })
        .catch(error => {
            console.error('Error fetching dashboard data', error);
            setMessage('You are not authorized to view this page.');
        });
    }, []);

    const goToAdminPanel = () => {
        navigate('/admin-panel');
    };

    return (
        <div className="container">
            <h2>Dashboard</h2>
            <p>{message}</p>
            <button onClick={goToAdminPanel}>Go to Admin Panel</button>
        </div>
    );
}

export default Dashboard;
