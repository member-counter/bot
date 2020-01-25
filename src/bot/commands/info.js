const { DONATION_URL, DISCORD_OFFICIAL_SERVER_URL } = process.env;
const BOT_INVITE_URL = require("../utils/generateBotInvitationLink")();

const info = {
    name: "info",
    variants: [
        "info",
        "invite",
        "github",
        "support",
        "bug"
    ],
    allowedTypes: [0, 1],
    requiresAdmin: false,
    run: ({ bot, message, languagePack }) => {
        const { client } = bot;
        const { channel } = message;
        const embed = { ...languagePack.commands.info.embed_reply };
        
        embed.description = embed.description
            .replace("{DONATION_URL}", DONATION_URL)
            .replace("{BOT_SERVER_URL}", DISCORD_OFFICIAL_SERVER_URL)
            .replace("{BOT_INVITE_URL}", BOT_INVITE_URL);

        client.createMessage(channel.id, { embed }).catch(console.error);
    }
};

module.exports = [ info ];