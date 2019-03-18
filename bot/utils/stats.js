const StatsModel = require('../../mongooseModels/StatsModel');

const sendStats = (name) => {
    StatsModel.findOneAndUpdate({name:name},{$inc:{count:1}}, {upsert: true, useFindAndModify: false}).exec();
}

module.exports = sendStats