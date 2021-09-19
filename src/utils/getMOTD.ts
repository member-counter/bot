import fetch from "node-fetch";
import getEnv from "./getEnv";

let motd = "";

// Get the last fetched MOTD, and fetch it again
export const getMotd = () => {
	fetch(getEnv().MOTD_URL)
		.then((r) => r.json())
		.then((body) => (motd = body.motd))
		.catch(console.error);
	return motd;
};

export default getMotd;
