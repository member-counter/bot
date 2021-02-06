import Eris from "eris";
import Bot from "../bot";
import { dominantColor } from "../utils/embedBase";
import ColorThief from "colorthief";

const userUpdate = (
	user: Eris.User,
	oldUser: { username: string; discriminator: string; avatar: string }
) => {
	// for some unknown reason, when the bot is updated, user is always undefined
	if (!user) {
		ColorThief.getColor(Bot.client.user.dynamicAvatarURL("png", 1024)).then(
			(colors: [number, number, number]) => {
				dominantColor.current =
					(colors[0] << 16) | (colors[1] << 8) | colors[2];
			}
		);
	}
};

export default userUpdate;
