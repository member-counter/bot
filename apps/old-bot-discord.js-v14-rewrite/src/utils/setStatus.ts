import { Client, PresenceStatusData } from "discord.js";

const availableStatus = ["online", "idle", "dnd", "invisible"];
const availableTypes = ["playing", "streaming", "listening", "watching"];

function setStatus(client: Client, statusText: string) {
	let status = "online",
		text = statusText,
		type = 0,
		url: string;

	// detect config
	const detectConfig = /\{(.+)\}/;
	if (text.match(detectConfig)) {
		const [requestedStatus, requestedType, requestedUrl] = text
			.match(detectConfig)[1]
			.split(";");

		if (availableStatus.includes(requestedStatus.toLowerCase())) {
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

	client.user.setPresence({
		status: status as PresenceStatusData,
		activities: [
			{
				name: text,
				type,
				url
			}
		]
	});

	return { text, status, type: availableTypes[type] };
}

export default setStatus;
