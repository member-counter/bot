const router = require('express').Router();

router.all('/ping', (req, res) => {
    res.json({ pong: new Date() })
});

module.exports = router;