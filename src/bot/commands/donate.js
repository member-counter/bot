const donationUrl = process.env.DONATION_URL;
const DonationModel = require('../../mongooseModels/DonationModel');
const getExchange = require('../utils/getExchange');

const donate = {
    name: "donate",
    variants: ["donate", "donators"],
    allowedTypes: [0, 1],
    requiresAdmin: false,
    run: ({ bot, message, languagePack }) => {
        const { client } = bot;
        const { channel } = message;
        
        getExchange()
            .then((exchange) => {
                DonationModel.find()
                    .then(async donators => {
                        let embed =  { ...languagePack.commands.donate.embed_reply };
                        
                        embed.url = embed.url.replace('{DONATION_URL}', donationUrl);
                        embed.title = embed.title.replace('{DONATION_URL}', donationUrl);
                        embed.fields = [];

                        //filter and sort donations
                        donators = donators
                            .filter(donator => !donator.anonymous)
                            .map(donator => {
                                donator = donator.toObject();
                                if (donator.currency === "EUR") donator.amount_eur = donator.amount;
                                else if (exchange.rates[donator.currency]) donator.amount_eur = donator.amount / exchange.rates[donator.currency];
                                return donator;
                            })
                            .filter(donator => donator.amount_eur)
                            .sort((a, b) => b.amount_eur - a.amount_eur)
                            .slice(0, 10);

                        //donator.user (id) to user tag
                        donators = await Promise.all(
                            donators.map(donator => 
                                client.getRESTUser(donator.user)
                                    .then(user => {
                                        donator.user = user.username + "#" + user.discriminator;
                                        return donator;
                                    })
                                    .catch(() => {
                                        donator.user = "Unknown user"
                                        return donator;
                                    })
                            )   
                        );
                        
                        //put the donations in an embed
                        donators
                            .forEach((donator, i) => {
                                if ((donator.note && (donator.note.length > 1024))) donator.note = donator.note.slice(0, 1020) + "..."; 
                                let field = {};
                                field.name = `**${i+1}.** ${donator.user} - ${donator.amount} ${donator.currency}`;
                                field.value = ( donator.note ) ?  donator.note : languagePack.commands.donate.misc.empty_note;
                                embed.fields = [ ...embed.fields, field ];
                            });

                        client.createMessage(channel.id, { embed }).catch(console.error);
                    })
                    .catch(error => {
                        console.trace(error); 
                        client.createMessage(channel.id, languagePack.common.error_db).catch(console.error);
                    });
            })
            .catch(error => {
                console.log(error);
                client.createMessage(channel.id, languagePack.commands.donate.misc.error_exchange_fetch).catch(console.error);
            });
    }
};

module.exports = [ donate ];