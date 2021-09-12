#!/usr/bin/env node
console.log("Updating from 0.18.6 to 0.18.7...");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const { DB_URI } = process.env;

(async () => {
	const mongoClient = await MongoClient.connect(DB_URI, {
		useUnifiedTopology: true
	});
	const db = mongoClient.db();

	// Guild Count cache
	const guildCountCacheCollection = db.collection("guildcountcaches");
	const guildCountCacheCollectionSize = await guildCountCacheCollection.countDocuments();

	const guildCountCacheCursor = guildCountCacheCollection.find();

	let guildCountCachesProcessed = 0;
	while (
		(await guildCountCacheCursor.hasNext()) &&
		guildCountCachesProcessed < guildCountCacheCollectionSize
	) {
		const cachedCount = await guildCountCacheCursor.next();

		cachedCount.timestamp = new Date(cachedCount.timestamp);

		delete cachedCount._id;
		delete cachedCount.__v;

		await guildCountCacheCollection
			.findOneAndUpdate({ id: cachedCount.id }, { $set: cachedCount })
			.catch(console.error);

		guildCountCachesProcessed++;
		process.stdout.write(
			`\r[${guildCountCachesProcessed} of ${guildCountCacheCollectionSize}] Documents Processed (Guild Count cache)`
		);
	}

	process.stdout.write("\nDone\n");
	process.exit(0);
})();
