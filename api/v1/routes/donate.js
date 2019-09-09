const router = require('express').Router();
const fetch = require('node-fetch');
const DonationModel = require('../../../mongooseModels/DonationModel');
const mongoose = require('mongoose');
const auth = require('../middlewares/auth');
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const getExchange = require('../../../bot/utils/getExchange');
const pp_baseUrl = (process.env.NODE_ENV === 'production') ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com';

router.post('/process-donation/:transactionid', (req, res) => {
    fetch(`${pp_baseUrl}/v2/checkout/orders/${req.params.transactionid}`, {
            headers: {
                'Authorization' : 'Basic ' + Buffer.from(process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET).toString('base64')
            }
        })
        .then((rawres) => rawres.json())
        .then((ppResponse) => {
            if (ppResponse.status === "APPROVED") {
                req.body.currency = ppResponse.purchase_units[0].amount.currency_code;
                req.body.amount = ppResponse.purchase_units[0].amount.value;
            new DonationModel({_id: new mongoose.Types.ObjectId(), ...req.body})
                .save()
                .then(doc => {
                    delete doc._id;
                    delete doc.__v;
                    res.json(doc)
                })
                .catch(e => res.json({code:500, message:"DB error"}))
            }
        })
        .catch(e => res.json({code:500, message:"DB error"}))
});

router.post('/gen-donation', auth, (req, res) => {
    if (owners.includes(req.userId)) {
        new DonationModel({_id: new mongoose.Types.ObjectId(), ...req.body})
            .save()
            .then(doc => {
                delete doc._id;
                delete doc.__v;
                res.json(doc)
            })
            .catch(e => res.json({code:500, message:"DB error"}));
    } else {
        res.json({code:401, message:"Not authorized"});
    }     
})

router.get('/donators', (req, res) => {
    getExchange()
        .then(exchange => {
            DonationModel.find({}, { _id: 0, __v: 0 })
                .then(donators => {
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
                    res.json(donators);
                })
                .catch(e => res.json({code:500, message:"DB error"}));
        })
        .catch((e) => res.json({code: 500, message: "Error while trying to fetch exchange rates"}))
})

module.exports = router;