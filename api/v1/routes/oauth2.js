const router = require("express").Router();
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_OAUTH2_URI_REDIRECT, JWT_SECRET, NODE_ENV } = process.env;

router.get("/oauth2", async (req, res) => {
    const accessCode = req.query.code;
    let data = new URLSearchParams();
    data.append("grant_type", "authorization_code");
    data.append("code", accessCode);
    data.append("redirect_uri", DISCORD_OAUTH2_URI_REDIRECT);
    data.append("scope", "identify");

    fetch(`https://discordapp.com/api/oauth2/token?${data}`, {
        method: "POST",
        headers: {
            "Authorization": "Basic " + Buffer.from(DISCORD_CLIENT_ID + ":" + DISCORD_CLIENT_SECRET).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
        .then(discordResponse => discordResponse.json())
        .then(discordResponse => {
            if (discordResponse.access_token)
                fetch("https://discordapp.com/api/users/@me", {
                    headers: {
                        "Authorization": "Bearer " + discordResponse.access_token
                    }
                })
                    .then(unparsedUser => unparsedUser.json())
                    .then(user => {
                        jwt.sign({ id: user.id }, JWT_SECRET, (err, token) => {
                            if (err) throw err;
                            res.json({ token, discord_token: discordResponse.access_token });
                        });
                    });
            else throw new Error("Discord did not grant an access token");
        })
        .catch(error => {
          res.status(500).json({ message: "An error has occurred in the authorization process", error });
        });
});

if (NODE_ENV === "development") {
    router.get("/debug-token/:userid", async (req, res) => {
        jwt.sign({ id: req.params.userid }, JWT_SECRET, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    });
}

module.exports = router;
