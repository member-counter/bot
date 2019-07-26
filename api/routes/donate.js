const router = require('express').Router();

const pp_baseUrl = (process.env.NODE_ENV === 'production') ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com';



module.exports = router;