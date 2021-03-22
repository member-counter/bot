import Eris from "eris";
import { ErisClient } from "../bot";
import getEnv from "../utils/getEnv";

const { DISCORD_PREFIX } = getEnv();

function setStatus(client: ErisClient, statusText: string) {
	let status = "online",
		text = statusText,
		type = 0,
		url: string;

	text = text.replace(/\{prefix\}/gi, DISCORD_PREFIX);

	// detect config
	const detectConfig = /\{(.+)\}/;
	if (text.match(detectConfig)) {
		const [requestedStatus, requestedType, requestedUrl] = text
			.match(detectConfig)[1]
			.split(";");
		const availableTypes = ["playing", "streaming", "listening", "watching"];

		if (
			["online", "idle", "dnd", "invisible"].includes(
				requestedStatus.toLowerCase()
			)
		) {
			status = requestedStatus.toLowerCase();
		}

		if (availableTypes.includes(requestedType)) {
			type = availableTypes.indexOf(requestedType);
			if (type === availableTypes.indexOf("streaming")) {
				url = requestedUrl;
			}
		} else {
			type = availableTypes.indexOf("online");
		}

		text = text.replace(detectConfig, "").trimStart();
	}

	client.editStatus(status as Eris.Status, {
		name: text,
		type: type as Eris.BotActivityType,
		url
	});
}

export default setStatus;
