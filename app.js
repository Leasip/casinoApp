const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const playerRoutes = require('./routes/player'); // Ensure this path is correct

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/admin', adminRoutes);
app.use('/players', playerRoutes); // Ensure this matches the path used in PlayerLogin.js

// Connect to MongoDB
mongoose.connect('mongodb://localhost/casinoApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
