const mongoose = require('mongoose');

const CasinoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    alias: { type: String },
    affiliateLink: { type: String, required: true },
    minDeposit: { type: Number, required: true },
    maxDeposit: { type: Number, required: true }
});

module.exports = mongoose.model('Casino', CasinoSchema);
