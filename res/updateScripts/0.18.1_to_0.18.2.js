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
	const guildResult = await guildsCollection.updateMany(
		{},
		{ $rename: { guild: "id" } }
	);

	console.log(
		`[${guildResult.modifiedCount} of ${guildsCollectionSize}] Documents Processed (Guild settings)`
	);

	// User settings
	const usersCollection = db.collection("users");
	const usersCollectionSize = await usersCollection.countDocuments();
	const userResult = await usersCollection.updateMany(
		{},
		{ $rename: { user: "id" } }
	);

	console.log(
		`[${userResult.modifiedCount} of ${usersCollectionSize}] Documents Processed (User settings)`
	);

	// Guild Count cache
	const cacheCollection = db.collection("guildcountcaches");
	const cacheCollectionSize = await cacheCollection.countDocuments();
	const cacheResult = await cacheCollection.updateMany(
		{},
		{ $rename: { guild: "id" } }
	);

	console.log(
		`[${cacheResult.modifiedCount} of ${cacheCollectionSize}] Documents Processed (Guild Count cache)`
	);


	process.stdout.write("\nDone\n");
	process.exit(0);
})();
