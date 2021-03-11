import Command from "../typings/Command";
import UserService from "../services/UserService";
import Constants from "../utils/Constants";

// easter egg coded by my gf (line 13)
const patpat: Command = {
	aliases: ["patpat"],
	denyDm: false,
	run: async ({ message }) => {
		const userSettings = await UserService.init(message.author.id);
		await userSettings.grantBadge(Constants.UserBadges.PATPAT);

		await message.channel.createMessage("https://i.imgflip.com/2yya22.png");
		// i never thought i will ever been coding with a very cute guy -alex
	}
};

const patpatCommands = [patpat];

export default patpatCommands;
