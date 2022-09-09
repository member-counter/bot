#!/usr/bin/env node
console.log("Updating from 0.19.0 to 0.20.0...");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const { DB_URI } = process.env;

(async () => {
	const mongoClient = await MongoClient.connect(DB_URI, {
		useUnifiedTopology: true
	});
	const db = mongoClient.db();

	// Guild Settings
	const guildsCollection = db.collection("guilds");
	const guildsCollectionSize = await guildsCollection.countDocuments();
	const guildsCursor = guildsCollection.find();

	let guildsProcessed = 0;
	while (
		(await guildsCursor.hasNext()) &&
		guildsProcessed < guildsCollectionSize
	) {
		const guildSettings = await guildsCursor.next();

		if ("shortNumber" in guildSettings) {
			guildSettings.shortNumber = guildSettings.shortNumber > -1;
		}

		delete guildSettings._id;
		delete guildSettings.__v;

		await guildsCollection.findOneAndUpdate(
			{ guild: guildSettings.guild },
			{ $set: guildSettings }
		);

		guildsProcessed++;
		process.stdout.write(
			`\r[${guildsProcessed} of ${guildsCollectionSize}] Documents Processed (Guild settings)`
		);
	}
	process.stdout.write("\nDone\n");
	process.exit(0);
})();
