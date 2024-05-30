import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
    const [casinos, setCasinos] = useState([]);
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [affiliateLink, setAffiliateLink] = useState('');
    const [minDeposit, setMinDeposit] = useState('');
    const [maxDeposit, setMaxDeposit] = useState('');
    const [username, setUsername] = useState(''); // For adding an admin user
    const [password, setPassword] = useState(''); // For adding an admin user
    const [players, setPlayers] = useState([]); // For managing players
    const [playerName, setPlayerName] = useState(''); // For adding a player name
    const [editingCasino, setEditingCasino] = useState(null);

    useEffect(() => {
        fetchCasinos();
        fetchPlayers();
    }, []);

    const fetchCasinos = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/admin/casinos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCasinos(response.data);
        } catch (error) {
            console.error('Error fetching casinos', error);
        }
    };

    const fetchPlayers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/admin/players', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlayers(response.data);
        } catch (error) {
            console.error('Error fetching players', error);
        }
    };

    const handleAddCasino = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (editingCasino) {
                // Update existing casino
                await axios.put(`/admin/casinos/${editingCasino._id}`, { name, alias, affiliateLink, minDeposit, maxDeposit }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Add new casino
                await axios.post('/admin/casinos', { name, alias, affiliateLink, minDeposit, maxDeposit }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchCasinos();
            resetForm();
        } catch (error) {
            console.error('Error adding/updating casino', error);
        }
    };

    const handleAddAdminUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('/admin/users', { username, password, role: 'admin' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsername('');
            setPassword('');
            alert('Admin user added successfully');
        } catch (error) {
            console.error('Error adding admin user', error);
        }
    };

    const handleAddPlayer = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('/admin/players', { name: playerName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPlayers();
            alert(`Player added successfully. Name: ${response.data.name}, Personal ID: ${response.data.personalId}`);
            setPlayerName('');
        } catch (error) {
            console.error('Error adding player', error);
        }
    };

    const handleEditCasino = (casino) => {
        setName(casino.name);
        setAlias(casino.alias || '');
        setAffiliateLink(casino.affiliateLink);
        setMinDeposit(casino.minDeposit);
        setMaxDeposit(casino.maxDeposit);
        setEditingCasino(casino);
    };

    const handleDeleteCasino = async (casinoId) => {
        const confirmed = window.confirm('Are you sure you want to delete this casino?');
        if (!confirmed) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/admin/casinos/${casinoId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCasinos();
        } catch (error) {
            console.error('Error deleting casino', error);
        }
    };

    const resetForm = () => {
        setName('');
        setAlias('');
        setAffiliateLink('');
        setMinDeposit('');
        setMaxDeposit('');
        setEditingCasino(null);
    };

    return (
        <div className="container">
            <h2>Admin Panel</h2>
            <form onSubmit={handleAddCasino}>
                <div>
                    <label>Casino Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Alias:</label>
                    <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} />
                </div>
                <div>
                    <label>Affiliate Link:</label>
                    <input type="url" value={affiliateLink} onChange={(e) => setAffiliateLink(e.target.value)} required />
                </div>
                <div>
                    <label>Min Deposit:</label>
                    <input type="number" value={minDeposit} onChange={(e) => setMinDeposit(e.target.value)} required />
                </div>
                <div>
                    <label>Max Deposit:</label>
                    <input type="number" value={maxDeposit} onChange={(e) => setMaxDeposit(e.target.value)} required />
                </div>
                <button type="submit">{editingCasino ? 'Update Casino' : 'Add Casino'}</button>
                {editingCasino && <button type="button" onClick={resetForm}>Cancel</button>}
            </form>

            <h3>Existing Casinos</h3>
            <ul>
                {casinos.map((casino) => (
                    <li key={casino._id}>
                        {casino.name} {casino.alias && `(${casino.alias})`} - 
                        <a href={casino.affiliateLink} target="_blank" rel="noopener noreferrer">link</a> 
                        <span>({casino.affiliateLink})</span>
                        <span>Min: {casino.minDeposit}, Max: {casino.maxDeposit}</span>
                        <button onClick={() => handleEditCasino(casino)}>Edit</button>
                        <button onClick={() => handleDeleteCasino(casino._id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h2>Add Admin User</h2>
            <form onSubmit={handleAddAdminUser}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Add Admin User</button>
            </form>

            <h2>Manage Players</h2>
            <div>
                <label>Player Name:</label>
                <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
            </div>
            <button onClick={handleAddPlayer}>Add Player</button>
            <ul>
                {players.map(player => (
                    <li key={player._id}>
                        {player.name} (Login Key: {player.loginKey})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminPanel;
