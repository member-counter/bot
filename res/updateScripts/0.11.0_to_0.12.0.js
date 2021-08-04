#!/usr/bin/env node
console.log("Updating from 0.11.0 to 0.12.0...");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const { DB_URI } = process.env;

const newCounters = [
	[/\{minecraft/gi, "{game:minecraft"],
	[/\{source/gi, "{game:css"],
	[/\{gta5-fivem/gi, "{game:fivem"],
	[/\{gtasa-mta/gi, "{game:mtasa"],
	[/\{gtasa-mp/gi, "{game:samp"]
];

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
		const settings = await guildsCursor.next();

		if ("counters" in settings) {
			for (const id of Object.keys(settings.counters)) {
				for (const [oldCounter, newCounter] of newCounters) {
					settings.counters[id] = settings.counters[id].replace(
						oldCounter,
						newCounter
					);
				}
			}
		}

		delete settings._id;
		delete settings.__v;

		await guildsCollection
			.findOneAndUpdate(
				{ guild: settings.guild },
				{ $set: settings },
				{ new: true }
			)
			.catch(console.error);
		guildsProcessed++;
		process.stdout.write(
			`\r[${guildsProcessed} of ${guildsCollectionSize}] Documents Processed (Guild settings)`
		);
	}

	process.stdout.write("\nDone\n");
	process.exit(0);
})();
