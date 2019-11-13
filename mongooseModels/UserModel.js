const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: { type: String, require: true },
    premium_status: { type: Number, default: 0 }, //0 === no, 1 === low, 2 === high
});

module.exports = mongoose.model('users', UserSchema);