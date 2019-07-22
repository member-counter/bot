const prefix = process.env.PREFIX;

const command = {
    name: "donate",
    commands: [prefix+"donate"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
        //Yes, I need to code a dynamic list
        const embed = {
            "title": "Enjoying my bot? Donate me! Any amount will be welcome, and your name will also be listed here: https://www.paypal.me/eduardozgz",
            "description": "You can specify in the note if you want to be listed here, and also show or not your discord tag and amount.",
            "url": "https://www.paypal.me/eduardozgz",
            "color": 14503424,
            "footer": {
              "icon_url": "https://cdn.discordapp.com/attachments/441295855153315840/464917386563289118/enlarge.png",
              "text": "by eduardozgz#5695"
            },
            "thumbnail": {
              "url": "https://cdn.discordapp.com/avatars/478567255198662656/e28bfde9b086e9821c31408c2b21304d.png?size=128"
            },
            "fields": [
              {
                "name": "1. Neiara#0001 - $25 USD",
                "value": "Thanks for creating the bot, Enjoy!"
              },
              {
                "name": "2. Nothing yet, you could be here!",
                "value": "Here goes your note"
              },
              {
                "name": "3. Nothing yet, you could be here!",
                "value": "Here goes your note"
              }
            ]
          } 
        message.channel.send({ embed }).catch(console.error);
    }
}

module.exports = command;