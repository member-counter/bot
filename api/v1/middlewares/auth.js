const fetch = require("node-fetch");

module.exports = (req, res, next) => {
    if (req.headers.authorization) {
        fetch(`https://discordapp.com/api/v6/users/@me`, {
            headers: { Authorization: req.headers.authorization }
        })
            .then(response => {
                const { status } = response;
                if (status === 200) {
                    return response.json();
                } else if (status === 401) {
                    res.json({ code: 401, message: "Bad token" });
                } else {
                    res.json({ code: 500, message: "Backend error" });
                }
            })
            .then(user => {
                req.user = user;
                next();
            })
            .catch(error => {
                console.error(error);
                res.json({ code: 500, message: "Backend error" });
            });
    } else {
        res.json({ code: 401, message: "Bad token" });
    }
};
