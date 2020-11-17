// TODO
// check blocked guilds every 1h
	setInterval(() => {
		GuildModel.find({ blocked: true }, { id: 1 }).then((blockedGuilds) => {
			blockedGuilds.forEach((blockedGuild) => {
				client.guilds.get(blockedGuild.id)?.leave().catch(console.error);
			});
		});
	}, 1 * 60 * 60 * 1000);