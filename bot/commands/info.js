const { DONATION_URL, DISCORD_OFFICIAL_SERVER_URL } = process.env;
const BOT_INVITE_URL = require("../utils/generateBotInvitationLink")();

const info = {
    name: "info",
    variants: [
        "{PREFIX}info",
        "{PREFIX}invite",
        "{PREFIX}github",
        "{PREFIX}support",
        "{PREFIX}bug"
    ],
    allowedTypes: ["text", "dm"],
    indexZero: true,
    enabled: true,
    requiresAdmin: false,
    run: ({ message, languagePack }) => {
        const embed = Object.create(languagePack.commands.info.embed_reply);
        embed.description = embed.description
            .replace("{DONATION_URL}", DONATION_URL)
            .replace("{BOT_SERVER_URL}", DISCORD_OFFICIAL_SERVER_URL)
            .replace("{BOT_INVITE_URL}", BOT_INVITE_URL);
        message.channel.send({ embed }).catch(console.error);
    }
};

module.exports = { info };
