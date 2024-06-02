import { EmbedBuilder } from "@discordjs/builders";
import { bot } from "..";

import { Colors } from "../Constants";

class BaseEmbed extends EmbedBuilder {
	constructor(options?: ConstructorParameters<typeof EmbedBuilder>[0]) {
		super(options);
		if (!options?.color) {
			this.setColor(Colors.BLURPLE);
		}

		this.setFooter({
			text: "https://member-counter.eduardozgz.com",
			iconURL: bot.client.user?.displayAvatarURL({ extension: "jpeg" })
		});
	}
}

export default BaseEmbed;
