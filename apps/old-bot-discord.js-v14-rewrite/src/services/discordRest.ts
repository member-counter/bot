import { REST } from "@discordjs/rest";

import config from "../config";

export const apiVersion = "10";
export const discordRest = new REST({ version: apiVersion }).setToken(
	config.discord.bot.token
);

export default discordRest;
