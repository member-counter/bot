const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
    jwt.verify(req.headers.authorization, JWT_SECRET, (err, decoded) => {
        if (err) res.status(401).json({ message: "Bad token" });
        else {
            req.token = decoded;
            next();
        }
    });
};
