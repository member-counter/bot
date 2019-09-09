const router = require("express").Router();
const {
    DISCORD_CLIENT_ID,
    DISCORD_OFFICIAL_SERVER_ID,
    DBL_WH_SECRET,
    DBL_REWARD_ROLE_ID
} = process.env;
const owners = process.env.BOT_OWNERS.split(/,\s?/);

router.post("/dbl", (req, res) => {
    const { authorization } = req.headers;
    const webhook = req.body;
    if (
        authorization === DBL_WH_SECRET &&
        webhook.type === "upvote" &&
        webhook.bot === DISCORD_CLIENT_ID
    ) {
        console.log(`[MAIN] [API] User ${webhook.user} upvoted the bot!`);
        req.DiscordShardManager.broadcastEval(`
            if (this.guilds.get("${DISCORD_OFFICIAL_SERVER_ID}") && this.guilds.get("${DISCORD_OFFICIAL_SERVER_ID}").members.get("${webhook.user}")) {
                this.guilds.get("${DISCORD_OFFICIAL_SERVER_ID}")
                    .members.get("${webhook.user}")
                        .addRole("${DBL_REWARD_ROLE_ID}")
                            .then(() => {
                                console.log("[MAIN] [API] Upvoter Role given successfully to ${webhook.user}");
                            })
                            .catch((e) => {
                                console.error("[MAIN] [API] Error while trying to give the role to ${webhook.user}");
                            });
            }
        `);
    } else if (
        authorization === DBL_WH_SECRET &&
        webhook.type === "test" &&
        webhook.bot === DISCORD_CLIENT_ID
    ) {
        console.log(
            `[MAIN] [API] DBL webhook test received: ${JSON.stringify(webhook)}`
        );
        if (owners.includes(webhook.user)) {
            req.DiscordShardManager.broadcastEval(`
                if (this.guilds.get("${DISCORD_OFFICIAL_SERVER_ID}") && this.guilds.get("${DISCORD_OFFICIAL_SERVER_ID}").members.get("${webhook.user}")) {
                    this.guilds.get("${DISCORD_OFFICIAL_SERVER_ID}")
                        .members.get("${webhook.user}")
                            .addRole("${DBL_REWARD_ROLE_ID}")
                                .then(() => {
                                    console.log("[MAIN] [API] Upvoter Role given successfully to ${webhook.user}");
                                })
                                .catch((e) => {
                                    console.error("[MAIN] [API] Error while trying to give the role to ${webhook.user}");
                                });
                }
            `);
        }
    }
});

module.exports = router;
