const router = require('express').Router();

router.all('/ping', (req, res)=> {
    res.send('pong');
});

module.exports = router;