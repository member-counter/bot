const router = require('express').Router();
const fs = require('fs');
const path = require('path');

fs.readdirSync(path.join(__dirname, 'routes')).forEach((file) => {
    router.use(require(path.join(__dirname, 'routes', file)));
});

module.exports = router;