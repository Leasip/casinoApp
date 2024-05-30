const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    loginKey: { type: String, unique: true }, // Add a login key field
    role: { type: String, required: true, enum: ['admin', 'player'] }
});

module.exports = mongoose.model('User', userSchema);
