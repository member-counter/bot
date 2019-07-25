const mongoose = require('mongoose');

const DonationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: { type: String, require: true },
    note: { type: String },
    public_user: { type: Boolean, default: true },
    public_note: { type: Boolean, default: true },
    public_amount: { type: Boolean, default: true },
    amount: { type: Number, require: true },
    currency: { type: String, require: true },
    date: { type: Date, default: new Date()}
});

module.exports = mongoose.model('donations', DonationSchema);