const router = require("express").Router();
const giveUpvoterRole = require("../../../bot/utils/giveUpvoterRole");
const { DBOATS_WH_SECRET } = process.env;

//https://discord.boats
router.post("/bot-pages/dboats", (req, res) => {
    const { authorization } = req.headers;
    const webhook = req.body;
    if (authorization === DBOATS_WH_SECRET) {
        console.log(`[MAIN] [API] [DISCORD.BOATS] User ${webhook.user.id} upvoted the bot!`);
        giveUpvoterRole(webhook.user.id, req.DiscordShardManager);
        res.status(200);
    } else res.status(401);
});

module.exports = router;
