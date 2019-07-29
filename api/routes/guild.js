const router = require('express').Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const GuildModel = require('../../mongooseModels/GuildModel');
const TrackModel = require('../../mongooseModels/TrackModel');

router.get('/guild/:id', auth, isAdmin, (req, res)  => {
    GuildModel.findOne({ guild_id: req.params.id }, { _id: 0, __v: 0 })
    .then(guild => res.json(guild))
    .catch(e => res.json({code:500, message:"Backend error"}))
});

router.patch('/guild/:id', auth, isAdmin, (req, res)  => {
    delete req.body.__v;
    delete req.body._id;
    GuildModel.findOneAndUpdate({ guild_id: req.params.id }, { ...req.body }, {upsert: true})
    .then((result)=>{
        res.json({code: 0, message: "Updated sucessfully"})
    })
    .catch(e => res.json({code:500, message:"Backend error"}))
});

router.get('/guild/:id/chart', auth, isAdmin, (req, res)  => {
    TrackModel.findOneAndUpdate({ guild_id: req.params.id }, { }, {upsert: true})
    .then((result)=>{
        res.json({code: 0, chart: result.count_history});
    })
    .catch(e => res.json({code:500, message:"Backend error"}))
});

module.exports = router;