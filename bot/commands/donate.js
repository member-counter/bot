const donationUrl = process.env.DONATION_URL;
const DonationModel = require('../../mongooseModels/DonationModel');
const getExchange = require('../../bot/utils/getExchange');

const donate = {
    name: "donate",
    variants: ["{PREFIX}donate", "{PREFIX}donators"],
    allowedTypes: ["text", "dm"],
    indexZero: true,
    enabled: true,
    requiresAdmin: false,
    run: ({ message, translation }) => {
        const { channel, client } = message;
        getExchange()
            .then((ex) => {
                DonationModel.find()
                    .then(async donators => {
                        let embed = Object.create(translation.commands.donate.embed_reply);
                        embed.url = embed.url.replace('{DONATION_URL}', donationUrl);
                        embed.title = embed.title.replace('{DONATION_URL}', donationUrl);
                        embed.fields = [];

                        //filter and sort donations
                        donators
                            .filter(donator => !donator.anonymous)
                            .map(donator => {
                                donator = donator.toObject();
                                if (donator.currency === "EUR") donator.amount_eur = donator.amount;
                                else if (ex.rates[donator.currency]) donator.amount_eur = donator.amount / ex.rates[donator.currency];
                                return donator;
                            })
                            .filter(donator => donator.amount_eur)
                            .sort((a, b) => b.amount_eur - a.amount_eur)
                            .slice(0, 19);

                        //donator.user (id) to user tag
                        await Promise.all(
                            donators.map(async donator => {
                                try {
                                    donator.user = (await client.fetchUser(donator.user)).tag;
                                } catch (e) {
                                    console.error(e);
                                    donator.user = "Unknown user";
                                }
                                return donator;
                            })
                        );
                        
                        //put the donations in an embed
                        donators
                            .forEach((donator, i) => {
                                if ((donator.note && (donator.note.length > 1024))) donator.note = donator.note.slice(0, 1020) + "..."; 
                                let field = {};
                                field.name = `**${i+1}.** ${donator.user} - ${donator.amount} ${donator.currency}`;
                                field.value = ( donator.note ) ?  donator.note : translation.commands.donate.misc.empty_note;
                                embed.fields = [ ...embed.fields, field ];
                            });

                        channel.send({embed}).catch(console.error);
                    })
                    .catch(error => {
                        console.log(error);
                        channel.send(translation.commands.donate.common.error_db).catch(console.error);
                    });
            })
            .catch(error => {
                console.log(error);
                channel.send(translation.commands.donate.misc.error_exchange_fetch).catch(console.error);
            });
    }
};

module.exports = { donate };