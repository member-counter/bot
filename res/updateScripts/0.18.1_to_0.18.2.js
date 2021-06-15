#!/usr/bin/env node
console.log("Updating from 0.18.1 to 0.18.2...");
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

		guildsCollection.findOneAndUpdate(
			{ guild: guildSettings.id },
			{ $rename: { guild: "id" } }
		);

		guildsProcessed++;
		process.stdout.write(
			`\r[${guildsProcessed} of ${guildsCollectionSize}] Documents Processed (Guild settings)`
		);
	}
	process.stdout.write("\n");

	// User settings
	const usersCollection = db.collection("users");
	const usersCollectionSize = await usersCollection.countDocuments();
	const userCursor = usersCollection.find();
	let usersProcessed = 0;

	while ((await userCursor.hasNext()) && usersProcessed < usersCollectionSize) {
		const user = await userCursor.next();

		await usersCollection.findOneAndUpdate(
			{ user: user.id },
			{ $rename: { user: "id" } }
		);

		usersProcessed++;
		process.stdout.write(
			`\r[${usersProcessed} of ${usersCollectionSize}] Documents Processed (User settings)`
		);
	}
	process.stdout.write("\nDone\n");
	process.exit(0);
})();
