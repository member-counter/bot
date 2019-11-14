const UserModel = require("../../mongooseModels/UserModel");

/**
 * @param {String} user_id
 */
module.exports = user_id => {
    UserModel.findOneAndUpdate(
        { user_id },
        { $inc: { total_given_upvotes: 1, available_upvotes_to_spend: 1 } }
    ).catch(console.error)
};
