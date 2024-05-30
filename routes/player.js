const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticateJWT = require('../middleware/auth');

const JWT_SECRET = 'your_secret_key';

// Player login route
router.post('/login', async (req, res) => {
    const { personalId } = req.body;

    try {
        console.log('Login attempt with key:', personalId); // Log login attempts
        const user = await User.findOne({ loginKey: personalId, role: 'player' });
        if (!user) {
            console.error('Invalid login key:', personalId); // Log invalid login attempts
            return res.status(401).json({ message: 'Invalid login key' });
        }

        // Compare the hashed password with the default password
        const isPasswordValid = await bcrypt.compare('default_password', user.password);
        if (!isPasswordValid) {
            console.error('Password mismatch for login key:', personalId); // Log password mismatches
            return res.status(401).json({ message: 'Invalid login key' });
        }

        console.log('Login successful for key:', personalId); // Log successful logins
        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Protected route example for the player dashboard
router.get('/dashboard', authenticateJWT(['player']), (req, res) => {
    res.json({ message: 'Welcome to the player dashboard!' });
});

module.exports = router;
