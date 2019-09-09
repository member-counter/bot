const fetch = require('node-fetch');

module.exports = (req, res, next) => {
    if (req.headers.authorization) {
        fetch(`https://discordapp.com/api/v6/users/@me`, { headers: { 'Authorization' : req.headers.authorization } })
        .then(r => {
            if (r.status === 200) return r.json();
            else if (r.status === 401) res.json({code:401, message:"Bad token"});
            else res.json({code:500, message:"Backend error"}) 
        })
        .then(r => {
            req.userId = r.id;
            next();
        })
        .catch(() => {
            res.json({code:500, message:"Backend error"})
        });
    } else {
        res.json({code:401, message:"Bad token"});
    }
}