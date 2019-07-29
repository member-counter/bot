const router = require('express').Router();
const fetch = require('node-fetch');
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const auth = require('../middlewares/auth');

router.get('/oauth2', async (req, res)=> {
  const accessCode = req.query.code;
  let data = new URLSearchParams();
  data.append('grant_type', 'authorization_code');
  data.append('code', accessCode);
  data.append('redirect_uri', process.env.DISCORD_OAUTH2_URL_REDIRECT);
  data.append('scope', 'identify guilds');

  fetch(`https://discordapp.com/api/oauth2/token?${data}`, {
    method: 'POST',
    headers: { 
      'Authorization': 'Basic ' + Buffer.from(process.env.DISCORD_CLIENT_ID + ":" + process.env.DISCORD_CLIENT_SECRET).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(fetchRes => fetchRes.json())
  .then(parsedFetchRes => res.json(parsedFetchRes));
});

router.get('/admin-check', auth, (req, res)=> {
  res.json({code: 0, admin: owners.includes(req.userId)})
});

module.exports = router;