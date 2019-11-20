const fetch = require("node-fetch");

module.exports = (req, res, next) => {
    if (req.headers.authorization) {
        //TODO check if the token has a valid signature
    } else {
        res.json({ code: 401, message: "Bad token" });
    }
};
