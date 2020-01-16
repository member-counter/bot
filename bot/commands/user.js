const UserModel = require("../../mongooseModels/UserModel");

const profile = {
    name: "profile",
    variants: ["me", "profile"],
    allowedTypes: ["text", "dm"],
    requiresAdmin: false,
    run: ({ message, languagePack }) => {
        const { author, channel } = message;
        const { premium_text, total_given_upvotes_text, available_points_text } = languagePack.commands.profile;
        
        UserModel.findOneAndUpdate(
            { user_id: author.id },
            { }, 
            { new: true, upsert: true }
        )
            .then(userDoc => {
                const embed = {
                    "title": author.username + "#" + author.discriminator,
                    "thumbnail": {
                        "url": author.avatarURL
                    },
                    "color": 14503424,
                    "description": `${premium_text} ${(userDoc.premium) ? ":white_check_mark: :heart:" : ":x:"}\n${total_given_upvotes_text} ${userDoc.total_given_upvotes}\n${available_points_text} ${userDoc.available_points}`
                };
                
                channel.send({ embed }).catch(console.error);
            })
            .catch(console.error);
    }
};

module.exports = { profile };