#!/usr/bin/env node
console.log("Updating from 0.10.0 to 0.11.0...");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const { DB_URI } = process.env;

const oldDefaultDigits = [
	"<a:0G:469275067969306634>",
	"<a:1G:469275169190445056>",
	"<a:2G:469275085451034635>",
	"<a:3G:469275208684011550>",
	"<a:4G:469275195170095124>",
	"<a:5G:469282528088293377>",
	"<a:6G:469275153038049280>",
	"<a:7G:469275104933838858>",
	"<a:8G:469275116988137482>",
	"<a:9G:469275181135691777>"
];
const newDefaultDigits = [
	"<a:0G:701869754616512672>",
	"<a:1G:701869754578894939>",
	"<a:2G:701869754641547324>",
	"<a:3G:701869754717175828>",
	"<a:4G:701869754880753824>",
	"<a:5G:701869754763182080>",
	"<a:6G:701869754641809529>",
	"<a:7G:701869754402734183>",
	"<a:8G:701869754356596869>",
	"<a:9G:701869754687815720>"
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
		const oldSettings = await guildsCursor.next();

		// if it doesn't have guild_id, it's already updated
		if (!oldSettings.guild_id) continue;

		const newSettings = {
			guild: oldSettings.guild_id,
			counters: {}
		};

		if ("premium" in oldSettings) {
			newSettings["premium"] = oldSettings.premium;
		}
		if ("lang" in oldSettings) {
			newSettings["language"] = oldSettings.lang;
		}
		if ("prefix" in oldSettings) {
			newSettings["prefix"] = oldSettings.prefix;
		}
		if ("topicCounterCustomNumbers" in oldSettings) {
			const newDigitsArray = [];
			for (const [i, value] of Object.entries(
				oldSettings.topicCounterCustomNumbers
			)) {
				if (value === oldDefaultDigits[i]) {
					newDigitsArray[i] = newDefaultDigits[i];
				} else {
					newDigitsArray[i] = value;
				}
			}
			newSettings["digits"] = newDigitsArray;
		}

		const oldMainTopic = (
			oldSettings.mainTopicCounter || "Members: {count}"
		).replace(/\{count\}/gi, "{members}");

		if ("topicCounterChannels" in oldSettings)
			Object.entries(oldSettings.topicCounterChannels).forEach(
				([channelId, channelConfig]) => {
					let topic;

					if (channelConfig.topic) {
						topic = channelConfig.topic.replace(/\{count\}/gi, "{members}");
					} else {
						topic = oldMainTopic;
					}

					newSettings.counters[channelId] = topic;
				}
			);

		if ("channelNameCounters" in oldSettings)
			Object.entries(oldSettings.channelNameCounters).forEach(
				([channelId, channelConfig]) => {
					let name = channelConfig.channelName;
					let { type } = channelConfig;

					if (channelConfig.type === "memberswithrole") {
						type += ":" + channelConfig.otherConfig.roles.join(",");
					}

					name = name.replace(/\{count\}/gi, "{" + type + "}");

					newSettings.counters[channelId] = name;
				}
			);

		await guildsCollection.insertOne(newSettings);
		await guildsCollection.findOneAndDelete({ guild_id: oldSettings.guild_id });

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
		const oldUser = await userCursor.next();

		// if it doesn't have user_id, it's already updated
		if (!oldUser.user_id) continue;

		const newUser = {
			user: oldUser.user_id
		};

		if ("availableServerUpgrades" in oldUser) {
			newUser.availableServerUpgrades = oldUser.availableServerUpgrades;
		}

		if ("premium" in oldUser && oldUser.premium) {
			newUser.badges = 0b1;
		}

		await usersCollection.insertOne(newUser);
		await usersCollection.findOneAndDelete({ user_id: oldUser.user_id });

		usersProcessed++;
		process.stdout.write(
			`\r[${usersProcessed} of ${usersCollectionSize}] Documents Processed (User settings)`
		);
	}

	process.stdout.write("\nDone\n");
	process.exit(0);
})();
