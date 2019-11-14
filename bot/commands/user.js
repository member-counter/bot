const UserModel = require("../../mongooseModels/UserModel");

const user = {
    name: "example",
    variants: ["{PREFIX}me", "{PREFIX}profile"],
    allowedTypes: ["text", "dm"], 
    indexZero: true,
    enabled: false,
    run: ({ message, guild_settings, translation }) => {
        //TODO
        const embed = {

        };
        
        channel.send({ embed }).catch(console.error)
    }
};

module.exports = { user };