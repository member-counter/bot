const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: { type: String, require: true },
    voted_dbl: { type: Boolean, default: false }
});

module.exports = mongoose.model('users', UserSchema);