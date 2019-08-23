const prefix = process.env.DISCORD_PREFIX;
const donationUrl = process.env.WEBSITE + 'donate'
const DonationModel = require('../../mongooseModels/DonationModel');
const getExchange = require('../../bot/utils/getExchange');

const donate = {
    name: "donate",
    commands: [prefix+"donate", prefix+"donators"],
    allowedTypes: ["text", "dm"],
    indexZero: true,
    enabled: true,
    run: async (client, message, language) => {
        getExchange()
            .then((ex) => {
                DonationModel.find()
                .then(donators => {
                    let embed = language.commands.donate.embed_reply;
                    embed.url = embed.url.replace('{DONATION_URL}', donationUrl);
                    embed.title = embed.title.replace('{DONATION_URL}', donationUrl);
                    embed.fields = []

                    donators
                        .filter(donator => !donator.anonymous)
                        .map(donator => {
                            if (donator.currency === "EUR") donator.amount_eur = donator.amount;
                            else if (ex.rates[donator.currency]) donator.amount_eur = donator.amount / ex.rates[donator.currency];
                            return donator;
                        })
                        .filter(donator => donator.amount_eur)
                        .sort((a, b) => b.amount_eur - a.amount_eur)
                        .slice(0, 19)
                        .forEach((donator, i) => {
                            if ((donator.note && (donator.note.length > 1024))) donator.note = donator.note.slice(0, 1020) + "..."; 
                            let field = {}
                            field.name = `**${i+1}.** ${donator.user} - ${donator.amount} ${donator.currency}`;
                            field.value = ( donator.note ) ?  donator.note : language.commands.donate.misc.empty_note;
                            embed.fields = [ ...embed.fields, field ]
                        })

                    message.channel.send({embed}).catch(console.error);
                })
                .catch(e => message.channel.send(language.commands.donate.misc.error_db).catch(console.error))
            })
            .catch(e => message.channel.send(language.commands.donate.misc.error_exchange_fetch).catch(console.error))
    }
}

module.exports = [ donate ];