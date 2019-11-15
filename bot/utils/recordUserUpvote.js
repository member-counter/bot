const UserModel = require("../../mongooseModels/UserModel");

/**
 * @param {String} user_id
 */
module.exports = user_id => {
    UserModel.findOneAndUpdate(
        { user_id },
        { $inc: { total_given_upvotes: 1, available_points: 1 } },
        { upsert: true }
    ).catch(console.error)
};
