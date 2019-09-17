const donationUrl = process.env.DONATION_URL;
const DonationModel = require('../../mongooseModels/DonationModel');
const getExchange = require('../../bot/utils/getExchange');

const donate = {
    name: "donate",
    variants: ["{PREFIX}donate", "{PREFIX}donators"],
    allowedTypes: ["text", "dm"],
    indexZero: true,
    enabled: true,
    run: ({ message, guild_settings, translation }) => {
        const { channel } = message;
        getExchange()
            .then((ex) => {
                DonationModel.find()
                    .then(donators => {
                        let embed = Object.create(translation.commands.donate.embed_reply);
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
                                field.value = ( donator.note ) ?  donator.note : translation.commands.donate.misc.empty_note;
                                embed.fields = [ ...embed.fields, field ]
                            })

                        channel.send({embed}).catch(console.error);
                    })
                    .catch(e => channel.send(translation.commands.donate.common.error_db).catch(console.error))
            })
            .catch(e => channel.send(translation.commands.donate.misc.error_exchange_fetch).catch(console.error))
    }
}

module.exports = { donate };