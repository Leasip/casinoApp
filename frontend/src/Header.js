import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import './Header.css';

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/admin-panel">Admin Panel</Link>
                        </li>
                        <li>
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </nav>
            </header>
            <div className="container">
                <Outlet />
            </div>
        </div>
    );
}

export default Header;
