require('dotenv').config();
const { MongoClient } = require('mongodb');

const { DB_URI } = process.env;

(async () => {
	const mongoClient = await MongoClient.connect(DB_URI);
	const db = mongoClient.db();

	// Guild Settings
	const guildsCollection = db.collection('guilds');
	const guildsCollectionSize = await guildsCollection.countDocuments();

	const guildsCursor = guildsCollection.find();

	let guildsProcessed = 0;
	while (
		(await guildsCursor.hasNext()) &&
		guildsProcessed < guildsCollectionSize
	) {
		const settings = await guildsCursor.next();

		if ('shortNumber' in settings) {
      if (settings.shortNumber) {
				settings.shortNumber = 1;
			} else {
				settings.shortNumber = -1;
			}
    }
    
    delete settings._id;
    delete settings.__v;

    await guildsCollection
      .findOneAndUpdate(
        { guild: settings.guild },
        { $set: settings },
      )
      .catch(console.error);
		guildsProcessed++;
		process.stdout.write(
			`\r[${guildsProcessed} of ${guildsCollectionSize}] Documents Processed (Guild settings)`,
		);
	}

	process.stdout.write('\n');
	process.exit(0);
})();
