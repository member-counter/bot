import Eris, { PrivateChannel, TextChannel } from "eris";
import LanguagePack from "../typings/LanguagePack";
import embedBase from "./embedBase";

const commandErrorHandler = async (
	channel: Eris.TextableChannel,
	languagePack: LanguagePack,
	prefix: string,
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
			errorEmbed.description = error.message.replace("{PREFIX}", prefix);
			break;

		case "MongooseError":
		case "MongooseNativeError":
			errorEmbed.description = errorDb;
			console.error(error);
			break;

		case "DiscordRESTError":
		case "DiscordHTTPError":
			errorEmbed.description = `${errorDiscordAPI}: ${error.message}`;
			break;

		default:
			errorEmbed.description = errorUnknown;
			console.error(error);
			break;
	}

	channel.createMessage({ embeds: [errorEmbed] }).catch(() => {});
};

export default commandErrorHandler;
