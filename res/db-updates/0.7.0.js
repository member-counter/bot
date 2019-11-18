//remember to do a buckup before you run this
//npm install mongodb --global
const mongodb = require("mongodb");

const url = "";
const dbname = ""; //no, the url is not enough, set the db name here

let errorcount = 0;

const client = new mongodb.MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(async err => {
    let db = client.db(dbname);
    let GuildsCollection = db.collection("guilds");
    let TracksCollection = db.collection("tracks");

    TracksCollection.updateMany( {}, { $rename: { "count_history": "member_count_history" } } ).catch(console.error);


    //Guild

    GuildsCollection.updateMany( {}, { $rename: { "topic": "mainTopicCounter", "custom_numbers": "topicCounterCustomNumbers" } } ).catch(console.error);

    const allGuildsDocs = await GuildsCollection.find().toArray();

    allGuildsDocs.forEach(guild => {
        try {
            //enabled_channels and unique_topics to topicCounterChannels

            guild.topicCounterChannels = {}
            
            if (guild.enabled_channels) 
                guild.enabled_channels.forEach(channel_id => {
                    guild.topicCounterChannels[channel_id] = {}
                });

            if (guild.enabled_channels && guild.unique_topics)
                Object.entries(guild.unique_topics).forEach(it => {
                    let channel_id = it[0];
                    let topic = it[1];
                    guild.topicCounterChannels[channel_id] = { topic }
                });


            //channelNameCounter and channelNameCounter_types to channelNameCounters

            guild.channelNameCounters = {}

            if (guild.channelNameCounter)
                Object.entries(guild.channelNameCounter).forEach(it => {
                    let channel_id = it[0];
                    let channelName = it[1];
                    guild.channelNameCounters[channel_id] = { channelName, type: "members" }
                });

            if (guild.channelNameCounter && guild.channelNameCounter_types)
                Object.entries(guild.channelNameCounter_types).forEach(it => {
                    let channel_id = it[0];
                    let data = it[1];
                    guild.channelNameCounters[channel_id].type = data;
                });

            GuildsCollection.findOneAndUpdate({ guild_id: guild.guild_id }, {
                $set: {
                    channelNameCounters: guild.channelNameCounters,
                    topicCounterChannels: guild.topicCounterChannels
                },

                $unset: {
                    enabled_channels: "",
                    unique_topics: "",
                    channelNameCounter: "",
                    channelNameCounter_types: ""
                }
            })

        } catch (e) {console.error(e);}
    });

    client.close();
});