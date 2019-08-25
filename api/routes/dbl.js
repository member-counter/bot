const router = require("express").Router();
const dblSecret = process.env.DBL_WH_SECRET;
const officialServer = process.env.DISCORD_OFFICIAL_SERVER_ID;
const rewardRoleId = process.env.DBL_REWARD_ROLE_ID;
const owners = process.env.BOT_OWNERS.split(/,\s?/);

router.post("/dbl", (req, res) => {
    const { authorization } = req.headers;
    const webhook = req.body;
    if (authorization === dblSecret && webhook.type === "upvote" && webhook.bot === process.env.DISCORD_CLIENT_ID) {
        console.log(`[MAIN] [API] User ${webhook.user} upvoted the bot!`);
        req.DiscordShardManager.broadcastEval(`
            if (this.guilds.get("${officialServer})") {
                this.guilds.get("${officialServer}")
                    .members.get("${webhook.user}")
                        .addRole("${rewardRoleId}")
                            .then(() => {
                                console.log("[MAIN] [API] Role given successfully to ${webhook.user}");
                            })
                            .catch((e) => {
                                console.error("[MAIN] [API] Error while trying to give the role to ${webhook.user}");
                            });
            }
        `);
    } else if (authorization === dblSecret && webhook.type === "test" && webhook.bot === process.env.DISCORD_CLIENT_ID) {
        console.log(`[MAIN] [API] DBL webhook test received: ${JSON.stringify(webhook)}`);
        if (owners.includes(webhook.user)) {
            req.DiscordShardManager.broadcastEval(`
            if (this.guilds.get("${officialServer})") {
                this.guilds.get("${officialServer}")
                    .members.get("${webhook.user}")
                        .addRole("${rewardRoleId}")
                            .then(() => {
                                console.log("[MAIN] [API] Role given successfully to ${webhook.user}");
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
