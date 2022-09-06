# Discord bot template

This is a template with everything I usually need to create discord bots

- Scalability
- i18n

# Configuration

Copy the `.env.example` to a `.env` file and fill out the variables
`cp .env.example .env`
Or take reference from `.env.example` and pass the variables directly

# The code

Under the `src/` folder, you will find different folders and files

- `events/`: Used to store event handlers, and these should be added in `src/events/index.ts` in the `allEvents` variable
- `interactions/`: Used to store all kind of interaction handlers in their respective folder (`buttons/`, `commands/`, etc)
- `locale/`: Used to store localization files
- `models/`: Used to store DB models
- `services/`: Used to store the classes the bussiness logic
- `structures/`: Used for storing typings and other useful classes that aren't related specifically to the bussiness logic of the bot
- `utils/`: Used to store more general function and classes

# Translations

Translations can be obtained with the `txt` function, which is available in any command, or returned from the `i18n` function when you pass an (interaction)[https://discord.js.org/#/docs/discord.js/stable/class/Interaction] object, this `txt` function will translate the chosen string, and replace all the placeholders with the specified data (the priority order when choosing the language is: `explicitly set by a the settings command` > `guild locale` > `user locale`)

Example from the invite command:

```ts
await txt("COMMAND_INVITE_DESCRIPTION", { INVITE_URL: getBotInviteLink() });
```

The "COMMAND_INVITE_DESCRIPTION" looks like this in the `./src/locales/en_US.json` file:

```json
{
	"COMMAND_INVITE_DESCRIPTION": "Beep boop! Your invite link is ready:\n{INVITE_URL}"
}
```

Missing translations will be taken from the default language (English)

## Loading translations locally

Just set the `I18N_PROVIDER` to `local`, remember to rebuild and restart the bot when you change something in `./src/locale/*`

## Loading translations from redis

This way is specially useful if you wish to update frequently translations without restarting the bot
Rebuild the bot when you get new translations, and load them with `npm i18nToRedis:docker`

# Logging

Logs are printed to `stdout` and `stderr`, and saved to log files under the `./logs` folder, you can change this behaviour by customizing `./src/logger.ts`

# Sharding

## Small bots

Sharding is done automatically inside a single process if you set `DISCORD_BOT_SHARDS` to `auto`.

## Large bots

> Currently, this is not implemented! See [#1](https://github.com/eduardozgz/discord-bot-template/issues/1)

For larger bots, you may want to have multiples shards over different processes across different nodes.
Pass an array of the shards you want to create to `DISCORD_BOT_SHARDS`, and set `DISCORD_BOT_SHARDS_COUNT` to the sum of shards that are going to be created across all the processes. Keep in mind that the bot doesn't spawn any processes for you, it will only take care of syncing the shard connections with other processes using redis locks

# Developing

## Committing

It's necessary to install the development dependencies (run `npm i`) to create commits, when you commit, your code will be automatically formatted using pretty-quick (prettier), you can change the formatting settings in the `prettier` property, located at the `package.json` file

Sometimes git can't recognize binary files correctly and will convert their EOL from CRLF to LF, you can add them manually to `.gitattributes` (this means if you have an .png file and git considers it's a text file, it will corrupt it if you are committing it from windows)

# Running the bot

The easiest way to do it is using [docker](https://www.docker.com/get-started)

After filling out your `.env`, run:

```sh
docker-compose up -d
```

This will build the bot from the source, generate an image of it, and get it running in a container, along with a redis a mongodb container

You can also stop it with `docker-compose down`, or rebuild and start it after an update with `docker-compose up -d --force-recreate --build`

To deploy your commands in discord, you can run this to register them globally in your bot (if `TEST_DEPLOY_INTERACTION_COMMAND_GUILD_ID` is set, it will be only registered in your testing guild, which is faster)

```sh
npm deployInteractions:docker
```

> If `docker-compose` is not working correctly, try to disable docker-compose v2 with `docker-compose disable-v2` and try again
> Currently the DB data is stored in ./storage

You can also use other container runtimes and orchestrators, but remember to have the bot connected to redis and to the mongodb database
