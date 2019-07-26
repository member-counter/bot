# member-counter-bot
[![Discord Bots](https://discordbots.org/api/widget/status/478567255198662656.svg)](https://discordbots.org/bot/478567255198662656) [![Discord Bots](https://discordbots.org/api/widget/servers/478567255198662656.svg)](https://discordbots.org/bot/478567255198662656)
# Setup

### Set environment variables or create a .env file

.env file example:

```
NODE_ENV=development

DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_TOKEN=
DISCORD_PREFIX=mc!
DISCORD_DEFAULT_LANG=en_US
DISCORD_OAUTH2_URL_REDIRECT=https://localhost/api/oauth2
BOT_OWNERS=343884247263608832
DBL_TOKEN=

DB_URI=

HOME_WEBSITE=https://localhost/
STATIC_DIR=./dev/static/
PATH_PRIVATE_KEY=./dev/cert.key
PATH_PUBLIC_KEY=./dev/cert.pem
PORT=443

PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
```

## Install dependencies

```sh
npm install
```

## And start it

```sh
npm start
```
