const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ id }, process.env.JWT_SECRET, (err, token) => {
            if (err) throw reject(err);
            resolve(token);
        });
    });
};

const api = {
    name: "api",
    variants: ["{PREFIX}api"],
    allowedTypes: ["text", "dm"], 
    indexZero: true,
    enabled: true,
    requiresAdmin: false,
    run: async ({ message, guildSettings, languagePack }) => {
        const { channel, author } = message;
        const embed = {
            "color": 14503424,
            "footer": {
                "icon_url": "https://cdn.discordapp.com/avatars/343884247263608832/98ce0df05fc35de2510c045cb469e4f7.png?size=64",
                "text": "by eduardozgz#5695"
            },
            "fields": [
                {
                    "name": "**Docs:**",
                    "value": "[https://eduardozgz.gitbook.io/member-counter/api](https://eduardozgz.gitbook.io/member-counter/api)",
                },
                {
                    "name": "**API token:**",
                    "value": (channel.type !== "dm") ? "Send `mc!api` in a DM channel" : ("||" + await generateToken(author.id).catch(() => "Unknown error, try again") + "||")
                }
            ]
        };

        channel.send({ embed }).catch(console.error);
    }
};

module.exports = { api };