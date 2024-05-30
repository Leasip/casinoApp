import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import PlayerDashboard from './PlayerDashboard';
import AdminPanel from './AdminPanel';
import Header from './Header';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Header />}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="admin-panel" element={<AdminPanel />} />
                            <Route path="player-dashboard" element={<PlayerDashboard />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
