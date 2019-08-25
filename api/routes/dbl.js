const router = require("express").Router();
const dblSecret = process.env.DBL_WH_SECRET;
const officalServer = process.env.DISCORD_OFFICIAL_SERVER_ID;
const rewardRoleId = process.env.DBL_REWARD_ROLE_ID;

router.get("/dbl", (req, res) => {
    const { authorization } = req.headers;
    const webhook = req.body;
    if (authorization === dblSecret && webhook.type === "upvote" && webhook.bot === process.env.DISCORD_CLIENT_ID) {
        req.DiscordShardManager.broadcastEval(`this.guilds.get(${officalServer}).members.get(${webhook.user}).addRole(${rewardRoleId})`);
    }
});

module.exports = router;
