import { EmbedBuilder } from "@discordjs/builders";
import { Colors } from "../Constants";

class BaseEmbed extends EmbedBuilder {
	constructor(options?: ConstructorParameters<typeof EmbedBuilder>[0]) {
		super(options);
		if (!options?.color) {
			this.setColor(Colors.BLURPLE);
		}
	}
}

export default BaseEmbed;
