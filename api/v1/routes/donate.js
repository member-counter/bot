const router = require("express").Router();
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const DonationModel = require("../../../mongooseModels/DonationModel");
const UserModel = require("../../../mongooseModels/UserModel");
const auth = require("../middlewares/auth");
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const getExchange = require("../../../bot/utils/getExchange");
const payPalbaseUrl = (process.env.NODE_ENV === "production") ? "https://api.paypal.com" : "https://api.sandbox.paypal.com";
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

router.post("/process-donation/:transactionid", auth, (req, res) => {
    fetch(`${payPalbaseUrl}/v2/checkout/orders/${req.params.transactionid}`, {
        headers: {
            Authorization: "Basic " + Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64")
        }
    })
        .then(response => response.json())
        .then(transaction => {
            if (transaction.status === "APPROVED") {
                req.body.user = req.token.id;
                req.body.currency = transaction.purchase_units[0].amount.currency_code;
                req.body.amount = transaction.purchase_units[0].amount.value;
                saveDonation(req, res);
                grantPremium(req.body.user);
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "DB error" });
        });
});

router.post("/gen-donation", auth, (req, res) => {
    if (owners.includes(req.token.id)) {
        saveDonation(req, res);
        grantPremium(req.body.user);
    } else {
        res.status(401).json({ message: "Not authorized" });
    }
});

router.get("/donators", (req, res) => {
    getExchange()
        .then(exchange => {
            DonationModel.find({}, { _id: 0, __v: 0 })
                .then(async donators => {
                    donators = donators
                        .filter(donator => !donator.anonymous)
                        .map(donator => {
                            donator = donator.toObject();
                            if (donator.currency === "EUR") donator.amount_eur = donator.amount;
                            else if (exchange.rates[donator.currency]) donator.amount_eur = donator.amount / exchange.rates[donator.currency];
                            return donator;
                        })
                        .filter(donator => donator.amount_eur)
                        .sort((a, b) => b.amount_eur - a.amount_eur);
                        
                        //get user tags
                        await Promise.all(
                            donators.map(async donator => {
                                if (!donator.user) donator.user = "";
                                donator.user = await req.DiscordShardManager.shards.get(0).eval(`
                                    (async () => {
                                        let user;
                                        try {
                                            user = await this.fetchUser(base64.decode("${base64.encode(donator.user)}")).then(user => ({avatar: user.displayAvatarURL, tag: user.tag}));
                                        } catch (e) {
                                            console.error(e);
                                            user = {avatar: "https://cdn.discordapp.com/embed/avatars/4.png", tag: "Unknown user"};
                                        }
                                        return user;
                                    })();   
                                `);
                                return donator;
                            })
                        );

                    res.json(donators);
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ message: "DB error" });
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error while trying to fetch exchange rates" });
        });
});

module.exports = router;

const saveDonation = (req, res) => {
    new DonationModel({ _id: new mongoose.Types.ObjectId(), ...req.body })
        .save()
        .then(doc => {
            delete doc._id;
            delete doc.__v;
            res.json(doc);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "DB error" });
        });
};

const grantPremium = (user_id) => {
    UserModel.findOneAndUpdate({ user_id }, { premium: true }, { new: true, upsert: true}).catch(console.error);
};