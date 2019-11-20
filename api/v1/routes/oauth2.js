const router = require("express").Router();
const fetch = require("node-fetch");
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const auth = require("../middlewares/auth");
const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_OAUTH2_URL_REDIRECT } = process.env;

router.get("/oauth2", async (req, res) => {
    const accessCode = req.query.code;
    let data = new URLSearchParams();
    data.append("grant_type", "authorization_code");
    data.append("code", accessCode);
    data.append("redirect_uri", DISCORD_OAUTH2_URL_REDIRECT);
    data.append("scope", "identify guilds");

    fetch(`https://discordapp.com/api/oauth2/token?${data}`, {
        method: "POST",
        headers: {
            "Authorization": "Basic " + Buffer.from(DISCORD_CLIENT_ID + ":" + DISCORD_CLIENT_SECRET).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
        .then(discordResponse => discordResponse.json())
        .then(discordResponse => {
            //TODO gen a jwt
        })
        .catch(error => {
          console.error(error);
          res.json({ code: 500, message: "An error has occurred in the authorization process", error: error })
        });
});

router.get("/admin-check", auth, (req, res) => {
    res.json({ code: 0, admin: owners.includes(req.user.id) });
});

module.exports = router;
