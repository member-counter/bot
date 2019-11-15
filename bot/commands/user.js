const UserModel = require("../../mongooseModels/UserModel");

const user = {
    name: "profile",
    variants: ["{PREFIX}me", "{PREFIX}profile"],
    allowedTypes: ["text", "dm"], 
    indexZero: true,
    enabled: true,
    run: ({ message, guild_settings, translation }) => {
        const embed = {
                //TODO
        };
        
        channel.send({ embed }).catch(console.error)
    }
};

module.exports = { profile };