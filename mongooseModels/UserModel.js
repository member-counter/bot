const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    user_id: { type: String, require: true },
    //premium relationed stuff
    premium: { type: Boolean, default: false }, //If true, the user will be able to upgrade any server to a high premium status, this is obtained by donating
    total_given_upvotes: { type: Number, default: 0 },
    available_upvotes_to_spend: { type: Number, default: 0 }
});

module.exports = mongoose.model('users', UserSchema);