import { REST } from "@discordjs/rest";

import config from "../config";

export const discordRest = new REST({ version: "9" }).setToken(
	config.discord.bot.token
);

export default discordRest;
