const router = require("express").Router();
const giveUpvoterRole = require("../../../bot/utils/giveUpvoterRole");
const { DBL_WH_SECRET } = process.env;
const owners = process.env.BOT_OWNERS.split(/,\s?/);

router.post("/dbl", (req, res) => {
    const { authorization } = req.headers;
    const webhook = req.body;
    if (authorization === DBL_WH_SECRET && webhook.type === "upvote") {
        console.log(`[MAIN] [API] [TOP.GG] User ${webhook.user} upvoted the bot!`);
        giveUpvoterRole(webhook.user, req.DiscordShardManager);
        res.status(200);
    } else if (authorization === DBL_WH_SECRET && webhook.type === "test") {
        console.log(`[MAIN] [API] [TOP.GG] Webhook test received: ${JSON.stringify(webhook)}`);
        giveUpvoterRole(webhook.user, req.DiscordShardManager);
        res.status(200);
    } else res.status(401);
});

module.exports = router;
