# member-counter-bot
[![Discord Bots](https://discordbots.org/api/widget/status/478567255198662656.svg)](https://discordbots.org/bot/478567255198662656) [![Discord Bots](https://discordbots.org/api/widget/servers/478567255198662656.svg)](https://discordbots.org/bot/478567255198662656)
[![CodeFactor](https://www.codefactor.io/repository/github/eduardozgz/member-counter-bot/badge)](https://www.codefactor.io/repository/github/eduardozgz/member-counter-bot)
[![Discord server](https://discordapp.com/api/guilds/614777317733957632/widget.png?style=shield)](https://discord.gg/g4MfV6N)

# Setup
If you have any problem during the proccess, join in [this discord server](https://discord.gg/g4MfV6N) and feel free to ask in the support channel

You must have already a bot account created in the [Discord Developer Portal](https://discordapp.com/developers/applications/)

## Recommendations:
    - Have patience
    - Be familiarized with the CLI (cmd.exe, bash)
    - Use linux if you wanna host this bot 24/7

## 1. Get a [mongoDB](https://www.mongodb.com/) database and install [node.js](https://nodejs.org/en/)

You can downlaod and install the [mongoDB community server](https://www.mongodb.com/download-center/community) for free or rent a [mongoDB Alas](https://www.mongodb.com/download-center/cloud) instance (there is also some free plans) I strongly recommend to install mongoDB in your machine due to a easier and faster access.

## 2. Set environment variables
> :warning: **Never share a .env file**: It contains sensitive data

> :information_source: Here is a quick look to the [.env.fullexample](https://github.com/eduardozgz/member-counter-bot/blob/master/.env.fullexample) and [.env.minexample](https://github.com/eduardozgz/member-counter-bot/blob/master/.env.minexample)

> :information_source: If you are using a service like heroku you can take advice of the available environment variables in the `.env.fullexample` or `.env.minexample`

> :information_source: Enable the developers mode in your discord client **User settings > Appearance > Advanced > Developer Mode**

- #### For inexperienced users - the minimal configuration
    Copy and paste the `.env.minexample` file and rename it to `.env` and open it with a text editor. Below I will explain what does each varaible.

    - `DISCORD_TOKEN` Paste here your bot's token, and remember to keep it secret!
    - `DB_URI` If you installed mongodb, this varaible should be set to `mongodb://127.0.0.1:27017/memberCounter`.
    - `DISCORD_DEFAULT_LANG` There is 3 available languages: English (en_US), Spanish (es_ES) and Portuguese (pt_BR).
    - `DISCORD_PREFIX` feel free to change its value to your favorite bot prefix, but be careful to don't use the same as other bots
    - `BOT_OWNERS` Right click your username in the discord client and press "Copy ID" and paste it here, you can add as many users as you want separated by a comma (`,`). Any user added here will have always full access to the bot's commands without any restriction.
    - `TIME_BETWEEN_USER_STATUS_UPDATE` (Minutes) This value will change the frequency of some counter updates.


- #### For developers
    If you are going to add features to the bot copy the content of `.env.fullexample` to a `.env` file and fill the empty variables. There might be some confusing variables, so I recommend you to check out the code.


## 3. Installing dependencies
```sh
npm install
```

## 4. Check that it works

1. Start it in your terminal with '``npm start``' or '``node index.js``'
2. Add the bot to your server (you can generate a link in the [Discord Developer Portal](https://discordapp.com/developers/applications/))
3. Testing the bot: (remember to replace `mc!` with your custom prefix)
    - Send `mc!help`
    - Send `mc!newChannelNameCounter members`
    - Send `mc!seeSettings`
    - Send `mc!status`
  
    If you were able to run the commands succesfully without any DB error, congrats, the bot wroks.

4. Keep it running unitl you close it or be a pro and jump to the #5 step.


## 5. Keep it running, forever.

### Linux (with systemd):
1. cd to the bot folder
2. Check that `index.js` has execution permissions for you (and try it by running the bot directly in ther terminal with `./index.js`)
3. Edit the `res/member-counter-bot.service` file, change the path of `ExecStart` and `WorkingDirectory` to the real one and change the `User` and `Group` values to yours.
4. Copy this file to `/etc/systemd/system`
```sh
sudo cp res/member-counter-bot.service /etc/systemd/system
```
5. Enable the service and start it 
```sh
sudo systemctl enable member-counter-bot.service && sudo systemctl start member-counter-bot.service
```
6. Check the logs with `journalctl`
```sh
sudo journalctl -u member-counter-bot.service
```
7. Repeat the steps of 4.3
8. 


# REST API
//TODO