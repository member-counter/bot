const router = require("express").Router();
const giveUpvoterRole = require("../../../bot/utils/giveUpvoterRole");
const recordUserUpvote = require("../../../bot/utils/recordUserUpvote");

const { BFD_WH_SECRET, DBOATS_WH_SECRET, DBL_WH_SECRET } = process.env;

//https://botsfordiscord.com
router.post("/bot-pages/bfd", (req, res) => {
    const { authorization } = req.headers;
    const webhook = req.body;
    if (authorization === BFD_WH_SECRET && webhook.type === "vote") {
        console.log(`[API] [botsfordiscord.com] User ${webhook.user} upvoted the bot!`);
        giveUpvoterRole(webhook.user, req.discordClient);
        res.status(200);
    } else if (authorization === BFD_WH_SECRET && webhook.type === "test") {
        console.log(`[API] [botsfordiscord.com] Webhook test received: ${JSON.stringify(webhook)}`);
        giveUpvoterRole(webhook.user, req.discordClient);
        recordUserUpvote(webhook.user);
        res.status(200);
    } else res.status(401);
});

//https://discord.boats
router.post("/bot-pages/dboats", (req, res) => {
    const { authorization } = req.headers;
    const webhook = req.body;
    if (authorization === DBOATS_WH_SECRET) {
        console.log(`[API] [DISCORD.BOATS] User ${webhook.user.id} upvoted the bot!`);
        giveUpvoterRole(webhook.user, req.discordClient);
        recordUserUpvote(webhook.user.id);
        res.status(200);
    } else res.status(401);
});

//https://top.gg
router.post("/bot-pages/dbl", (req, res) => {
    const { authorization } = req.headers;
    const webhook = req.body;
    if (authorization === DBL_WH_SECRET && webhook.type === "upvote") {
        console.log(`[API] [TOP.GG] User ${webhook.user} upvoted the bot!`);
        giveUpvoterRole(webhook.user, req.discordClient);
        recordUserUpvote(webhook.user);
        res.status(200);
    } else if (authorization === DBL_WH_SECRET && webhook.type === "test") {
        console.log(`[API] [TOP.GG] Webhook test received: ${JSON.stringify(webhook)}`);
        giveUpvoterRole(webhook.user, req.discordClient);
        recordUserUpvote(webhook.user);
        res.status(200);
    } else res.status(401);
});

module.exports = router;
