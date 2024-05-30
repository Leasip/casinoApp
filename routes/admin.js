const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Casino = require('../models/Casino');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/auth');

const JWT_SECRET = 'your_secret_key';

// Function to generate a random personal ID
const generatePersonalId = () => {
    return 'player-' + Math.random().toString(36).substr(2, 9);
};

// Admin login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, role: 'admin' });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin dashboard route
router.get('/dashboard', authenticateJWT(['admin']), (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard!' });
});

// Fetch all casinos
router.get('/casinos', authenticateJWT(['admin']), async (req, res) => {
    try {
        const casinos = await Casino.find();
        res.json(casinos);
    } catch (error) {
        console.error('Error fetching casinos:', error);
        res.status(500).json({ message: 'Error fetching casinos' });
    }
});

// Add a new casino
router.post('/casinos', authenticateJWT(['admin']), async (req, res) => {
    const { name, alias, affiliateLink, minDeposit, maxDeposit } = req.body;
    const newCasino = new Casino({ name, alias, affiliateLink, minDeposit, maxDeposit });

    try {
        await newCasino.save();
        res.json({ message: 'Casino added successfully' });
    } catch (error) {
        console.error('Error adding casino:', error);
        res.status(500).json({ message: 'Error adding casino' });
    }
});

// Update an existing casino
router.put('/casinos/:id', authenticateJWT(['admin']), async (req, res) => {
    const { name, alias, affiliateLink, minDeposit, maxDeposit } = req.body;
    const casinoId = req.params.id;

    try {
        const casino = await Casino.findByIdAndUpdate(casinoId, { name, alias, affiliateLink, minDeposit, maxDeposit }, { new: true });
        if (!casino) {
            return res.status(404).json({ message: 'Casino not found' });
        }
        res.json({ message: 'Casino updated successfully' });
    } catch (error) {
        console.error('Error updating casino:', error);
        res.status(500).json({ message: 'Error updating casino' });
    }
});

// Delete an existing casino
router.delete('/casinos/:id', authenticateJWT(['admin']), async (req, res) => {
    const casinoId = req.params.id;

    try {
        const casino = await Casino.findByIdAndDelete(casinoId);
        if (!casino) {
            return res.status(404).json({ message: 'Casino not found' });
        }
        res.json({ message: 'Casino deleted successfully' });
    } catch (error) {
        console.error('Error deleting casino:', error);
        res.status(500).json({ message: 'Error deleting casino' });
    }
});

// Add a new user
router.post('/users', authenticateJWT(['admin']), async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        res.json({ message: 'User added successfully' });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Error adding user' });
    }
});

// Add a new player
router.post('/players', authenticateJWT(['admin']), async (req, res) => {
    const { name } = req.body;
    const personalId = generatePersonalId();
    const hashedPassword = await bcrypt.hash('default_password', 10); // Set a default password
    const newUser = new User({ username: personalId, password: hashedPassword, name, loginKey: personalId, role: 'player' });

    try {
        await newUser.save();
        console.log('Player created:', newUser); // Log the created player for debugging
        res.json({ message: 'Player added successfully', personalId, name: newUser.name });
    } catch (error) {
        console.error('Error adding player:', error); // Improved logging
        res.status(500).json({ message: 'Error adding player' });
    }
});

// Fetch all players
router.get('/players', authenticateJWT(['admin']), async (req, res) => {
    try {
        const players = await User.find({ role: 'player' });
        res.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ message: 'Error fetching players' });
    }
});

module.exports = router;
