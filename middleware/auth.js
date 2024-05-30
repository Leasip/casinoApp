const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'your_secret_key';

const authenticateJWT = (roles = []) => {
    return async (req, res, next) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access token is missing or invalid' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;

            // Fetch user from the database to get the role
            const user = await User.findById(decoded.id);
            if (!user || (roles.length && !roles.includes(user.role))) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            req.user.role = user.role;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Access token is missing or invalid' });
        }
    };
};

module.exports = authenticateJWT;
