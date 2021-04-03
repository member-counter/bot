import { EmbedOptions } from "eris";
import Bot from "../bot";
import ColorThief from "colorthief";
import getEnv from "./getEnv";

const { BOT_COLOR } = getEnv();

let dominantColor = {
	current: BOT_COLOR?.toString().length ? BOT_COLOR : null
};

const embedBase = (embedToAppend?: EmbedOptions): EmbedOptions => {
	if (!dominantColor.current) {
		ColorThief.getColor(Bot.client.user.dynamicAvatarURL("png", 1024)).then(
			(colors: [number, number, number]) => {
				dominantColor.current =
					(colors[0] << 16) | (colors[1] << 8) | colors[2];
			}
		);
	}

	return {
		color: dominantColor.current,
		footer: {
			icon_url:
				"https://cdn.discordapp.com/avatars/478567255198662656/97f5120bb63e1015d9ff5593f1fa9cae.png?size=64",
			// Don't be a dick, don't remove this :)
			text: "Member Counter bot by eduardozgz#5695"
		},
		...embedToAppend
	};
};

export default embedBase;
export { embedBase, dominantColor };
