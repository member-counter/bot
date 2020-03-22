const UserModel = require("../../mongooseModels/UserModel");

const profile = {
    name: "profile",
    variants: ["me", "profile"],
    allowedTypes: [0, 1],
    requiresAdmin: false,
    run: ({ client, message, languagePack }) => {
        const { author, channel } = message;
        const { premium_text } = languagePack.commands.profile;
        
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
                    "description": `${premium_text} ${(userDoc.premium) ? ":white_check_mark: :heart:" : ":x:"}`
                };
                
                client.createMessage(channel.id, { embed }).catch(console.error);
            })
            .catch(console.error);
    }
};

module.exports = [ profile ];