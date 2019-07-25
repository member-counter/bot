# member-counter-bot
[![Discord Bots](https://discordbots.org/api/widget/status/478567255198662656.svg)](https://discordbots.org/bot/478567255198662656) [![Discord Bots](https://discordbots.org/api/widget/servers/478567255198662656.svg)](https://discordbots.org/bot/478567255198662656)
# Setup

### Set environment variables or create a .env file

`TOKEN`, `PREFIX`, `STATUS`, `STATUS_TYPE`, `ACTIVITY`, `DEFAULT_LANG`, `DB_URI`, `BOT_OWNERS`, `DBL_TOKEN`

.env file example:

```
NODE_ENV=development
TOKEN=your.bot.token
PREFIX=mc!
STATUS=Online
STATUS_TYPE=PLAYING
ACTIVITY=type mc!help
DEFAULT_LANG=en_US
DB_URI=mongodb+srv://username:password@host/database
PATH_PRIVATE_KEY=./path/tp/cert.key
PATH_PUBLIC_KEY=./path/to/cert.pem
PORT=443
STATIC_DIR=./dev/static/
HOME_WEBSITE=https://localhost/
OAUTH2_URL_REDIRECT=https://localhost/api/oauth2
BOT_OWNERS=481580198416875530
DBL_TOKEN=discordbots.org.token
```

## Install dependencies

```sh
npm install
```

## And start it

```sh
npm start
```
