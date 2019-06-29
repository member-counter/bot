# member-counter-bot

# Setup

### Set environment variables or create a .env file

`TOKEN`, `PREFIX`, `STATUS`, `STATUS_TYPE`, `ACTIVITY`, `DEFAULT_LANG`, `DB_URI`, `SAVE_LOGS`, `BOT_OWNERS`, `DBL_TOKEN`

.env file example:

```
TOKEN=your.bot.token
PREFIX=mc!
STATUS=Online
STATUS_TYPE=PLAYING
ACTIVITY=type mc!help
DEFAULT_LANG=en_US
DB_URI=mongodb+srv://username:password@host/database
SAVE_LOGS=true
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
