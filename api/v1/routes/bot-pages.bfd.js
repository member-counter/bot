const router = require("express").Router();
const giveUpvoterRole = require("../../../bot/utils/giveUpvoterRole");
const { BFD_WH_SECRET } = process.env;
const owners = process.env.BOT_OWNERS.split(/,\s?/);

//http://top.gg
router.post("/bot-pages/bfd", (req, res) => {
    const { authorization } = req.headers;
    const webhook = req.body;
    if (authorization === BFD_WH_SECRET && webhook.type === "vote") {
        console.log(`[MAIN] [API] [botsfordiscord.com] User ${webhook.user} upvoted the bot!`);
        giveUpvoterRole(webhook.user, req.DiscordShardManager);
        res.status(200);
    } else if (authorization === BFD_WH_SECRET && webhook.type === "test") {
        console.log(`[MAIN] [API] [botsfordiscord.com] Webhook test received: ${JSON.stringify(webhook)}`);
        giveUpvoterRole(webhook.user, req.DiscordShardManager);
        res.status(200);
    } else res.status(401);
});

module.exports = router;
