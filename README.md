# Member Counter

[![TOP.GG Badge](https://discordbots.org/api/widget/servers/478567255198662656.svg)](https://discordbots.org/bot/478567255198662656)
[![TOP.GG Badge](https://discord.com/api/guilds/614777317733957632/widget.png?style=shield)](https://discord.gg/g4MfV6N)
[![CodeFactor Badge](https://www.codefactor.io/repository/github/eduardozgz/member-counter-bot/badge)](https://www.codefactor.io/repository/github/eduardozgz/member-counter-bot)
[![Crowdin Translation Project Badge](https://badges.crowdin.net/member-counter-bot/localized.svg)](https://crowdin.com/project/member-counter-bot)

[Add this bot](https://discord.com/oauth2/authorize?client_id=478567255198662656&permissions=269872209&scope=bot) **|** [Website](https://membercounter.bot/) **|** [Translation Project](https://crowdin.com/project/member-counter-bot) **|** [Documentation](https://docs.membercounter.bot/)

Member Counter is a Discord bot which lets you easily display counts and other dynamic information in a channel name or topic, to get started, [add this bot](https://discord.com/oauth2/authorize?client_id=478567255198662656&permissions=269872209&scope=bot) to your Discord server and type `mc!setup`, and then read `mc!guide` to learn how to make more cool stuff with the bot.

See also the [documentation](https://docs.membercounter.bot/) to learn about every feature of the bot

# Self-host

Read this guide to setup this bot using docker: https://docs.membercounter.bot/guides/how-to-self-host-member-counter

# Development enviorement

## Software requirements

- [Git](https://git-scm.com/downloads)
- [NodeJS 14 or higher](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/get-started)

## Clone the bot and install dependencies

```
git clone -b dev git@github.com:eduardozgz/member-counter-bot.git
cd member-counter-bot
npm install
```

## Create a .env file

Create a .env file from the .env.example file:

```
cp .env.example .env
```

Open `.env` with a text editor and set at least `DISCORD_CLIENT_TOKEN` with your development bot token

Remember that you can't hot-reload this file, you must fully restart the bot to apply new changes

## Starting the bot

```
npm run dev:docker
```

Now you can start editing the code, when you save a file the bot will be reloaded automatically

## Adding/editing text

To add or edit a string, you must do it in the [./src/lang/en_US.json](./src/lang/en_US.json) file, after that, you may want to run `npm run generateLPTypings` to avoid compilation errors

To edit to other language you must do it trought the [translation project](https://crowdin.com/project/member-counter-bot)

## Commiting

### Commit

Stage your changes and add a short and descriptive commit message

### Pre-commit

The following tasks will be run automatically when you create a commit

- Create language pack typings with `npm run generateLPTypings`
- Prettify the code
- Stage the previous changes

### Do a pull request

Now just [create a pull request](https://github.com/eduardozgz/member-counter-bot/pulls) to the `dev` branch, and we will review it as soon as possible

Happy coding!
