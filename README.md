# Member Counter

[Add this bot](https://membercounter.app/invite) **|** [Website](https://membercounter.app/) **|** [Translation Project](https://tolgee.membercounter.app) **|** [Documentation](https://docs.membercounter.app/)

Member Counter is a Discord bot which lets you easily display counts and other dynamic information in a channel name or topic, to get started, [add this bot](https://membercounter.app/invite) to your Discord server and run `/setup server`

# Self-host

Read this guide to setup this bot using docker: https://docs.membercounter.app/readme/custom-bot/self-hosting-the-bot

# Development environment

## Software requirements

- [Git](https://git-scm.com/downloads)
- [NodeJS 20](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/get-started)

## Clone the bot and install dependencies

```
git clone -b dev git@github.com:member-counter/bot.git member-counter-bot
cd member-counter-bot
corepack enable
pnpm install
```

## Configure the app

Open `.env` with a text editor

- Set `COOKIE_SECRET` to something secure with at least 32 characters (or just add one more character for development purposes)
- Set `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` and `DISCORD_BOT_INSTANCE_TOKEN` with your development bot credentials
- Update `DISCORD_OAUTH2_REDIRECT_URI` as needed in the `.env` file and at the [Discord developer portal](https://discord.com/developers/applications) (**OAuth2 redirect URL**)
- Set `DATABASE_URL` to `mongodb://localhost:27017/memberCounter?replicaSet=rs0&directConnection=true`
  Save this file as `.env`
- Set `REDIS_URL` to `redis://localhost:6379`
- Set `NODE_ENV` to `development`

Remember that you can't hot-reload this file, you must fully restart the app to apply new changes

## Starting the bot and website

```
npm run dev:docker:up
npm run dev
```

Now you can start editing the code, when you save a file the app will be reloaded automatically

### Do a pull request

Now just [create a pull request](https://github.com/eduardozgz/member-counter-bot/pulls) to the `dev` branch, and we will review it as soon as possible

Happy coding!
