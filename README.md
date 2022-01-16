# Member Counter

[![TOP.GG Badge](https://discordbots.org/api/widget/servers/478567255198662656.svg)](https://discordbots.org/bot/478567255198662656)
[![TOP.GG Badge](https://discord.com/api/guilds/614777317733957632/widget.png?style=shield)](https://discord.gg/g4MfV6N)
[![CodeFactor Badge](https://www.codefactor.io/repository/github/eduardozgz/member-counter-bot/badge)](https://www.codefactor.io/repository/github/eduardozgz/member-counter-bot)
[![Crowdin Translation Project Badge](https://badges.crowdin.net/member-counter-bot/localized.svg)](https://crowdin.com/project/member-counter-bot)

[Add this bot](https://discord.com/oauth2/authorize?client_id=478567255198662656&permissions=269577300&scope=bot%20applications.commands) **|** [Website](https://member-counter.eduardozgz.com/) **|** [Translation Project](https://crowdin.com/project/member-counter-bot) **|** [Documentation](https://docs.member-counter.eduardozgz.com/)

Member Counter is a Discord bot which lets you easily display counts and other dynamic information in a channel name or topic, to get started, [add this bot](https://discord.com/oauth2/authorize?client_id=478567255198662656&permissions=269577300&scope=bot%20applications.commands) to your Discord server and type `mc!setup`, and then read `mc!guide` to learn how to make more cool stuff with the bot.

See also the [documentation](https://docs.member-counter.eduardozgz.com/) to learn about every feature of the bot

# Self-host

Read this guide to setup this bot using docker: https://docs.member-counter.eduardozgz.com/guides/how-to-self-host-member-counter

# Development environment

## Software requirements

- [Git](https://git-scm.com/downloads)
- [NodeJS 16 or higher](https://nodejs.org/en/download/)
- [Docker (and docker-compose)](https://www.docker.com/get-started)

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

In English:
 - To add or edit a string, you must do it in the [./src/lang/en_US.json](./src/lang/en_US.json) file, after that, you may want to run `npm run generateLPTypings` to avoid compilation errors

In other language:
- To add a string: First add it in english in the [./src/lang/en_US.json](./src/lang/en_US.json) file, then commit the file to the `dev` branch and it will be available in the [translation project](https://crowdin.com/project/member-counter-bot) in the next 10 minutes
- To edit a string: You must do it trought the [translation project](https://crowdin.com/project/member-counter-bot), if your language isn't there, contact me and I will add it

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

## Contributors

<a href="https://github.com/eduardozgz/member-counter-bot/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=eduardozgz/member-counter-bot" />
</a>
