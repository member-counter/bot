const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    user_id: { type: String, require: true },
    // If true, the user will be able to upgrade any server to a premium status, this is obtained by donating
    premium: { type: Boolean, default: false },
    availableServerUpgrades: { type: Number, default: 0 }
});

module.exports = mongoose.model('users', UserSchema);