import Eris, { PrivateChannel, TextChannel } from "eris";
import LanguagePack from "../typings/LanguagePack";
import embedBase from "./embedBase";
import { v4 as uuid } from "uuid";

const commandErrorHandler = async (
	channel: Eris.TextableChannel,
	languagePack: LanguagePack,
	error: any
): Promise<void> => {
	const { errorDb, errorDiscordAPI, errorUnknown } = languagePack.common;
	const errorText = languagePack.common.error;

	const errorEmbed = embedBase({
		title: errorText,
		description: "",
		color: 16711680
	});

	switch (error.constructor.name) {
		case "UserError":
			errorEmbed.description = error.message;
			break;

		case "MongooseError":
		case "MongooseNativeError":
			errorEmbed.description = errorDb;
			break;

		case "DiscordRESTError":
		case "DiscordHTTPError":
			errorEmbed.description = `${errorDiscordAPI}: ${error.message}`;
			break;

		default:
			errorEmbed.description = errorUnknown;
			break;
	}

	const errorId = uuid();

	errorEmbed.description += `\nError ID: \`${errorId}\``;
	console.error(`Error ${errorId}:`, error);

	channel.createMessage({ embeds: [errorEmbed] }).catch(() => {});
};

export default commandErrorHandler;
