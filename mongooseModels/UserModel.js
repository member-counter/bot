const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: { type: String, require: true }
});

module.exports = mongoose.model('users', UserSchema);