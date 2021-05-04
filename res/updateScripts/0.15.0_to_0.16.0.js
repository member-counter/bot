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
		const { guild, counters } = guildSettings;

		for (const id in counters) {
			if (Object.hasOwnProperty.call(counters, id)) {
				counters[id] = counters[id].replace(
					/\{https?:(.+?)\}/gi,
					(wholeMatch, url) => {
						return `{http:${Buffer.from(
							JSON.stringify({ url, parseNumber: true }),
							"utf-8"
						).toString("base64")}}`;
					}
				);

				counters[id] = counters[id].replace(
					/\{https?-string:(.+?)\}/gi,
					(wholeMatch, url) => {
						return `{http:${Buffer.from(
							JSON.stringify({ url }),
							"utf-8"
						).toString("base64")}}`;
					}
				);
			}
		}

		await guildsCollection.findOneAndUpdate(
			{ guild: guild },
			{ $set: guildSettings }
		);

		guildsProcessed++;
		process.stdout.write(
			`\r[${guildsProcessed} of ${guildsCollectionSize}] Documents Processed (Guild settings)`
		);
	}
	process.stdout.write("\n");
	process.exit(0);
})();
