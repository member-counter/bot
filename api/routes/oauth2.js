const router = require('express').Router();
const fetch = require('node-fetch');

router.get('/oauth2', async (req, res)=> {
  const accessCode = req.query.code;
  fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${accessCode}&redirect_uri=${encodeURIComponent(process.env.OAUTH2_URL_REDIRECT)}`, {
    method: 'POST',
    headers: { 
      'Authorization': 'Basic ' + Buffer.from(process.env.DISCORD_CLIENT_ID + ":" + process.env.DISCORD_CLIENT_SECRET).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(fetchRes => fetchRes.json())
  .then(parsedFetchRes => res.json(parsedFetchRes));
});

module.exports = router;