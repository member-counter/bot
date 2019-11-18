const router = require("express").Router();
const Discord = require("discord.js");
const fetch = require("node-fetch");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const TrackModel = require("../../../mongooseModels/TrackModel");

//TODO
//I should use streams
router.get("/guilds/:id/member-count-history", auth, isAdmin, (req, res) => {
    TrackModel.findOneAndUpdate({ guild_id: req.params.id }, {}, { upsert: true })
        .then(result => {
            res.json({ code: 0, count_history: result.count_history });
        })
        .catch(error => {
            console.error(error);
            res.json({ code: 500, message: "DB error" });
        });
});

module.exports = router;