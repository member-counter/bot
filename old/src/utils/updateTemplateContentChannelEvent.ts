import GuildService from "../services/GuildService";
import {
	GuildChannel,
	TextChannel,
	NewsChannel,
	VoiceChannel,
	CategoryChannel
} from "eris";

const counterPattern: RegExp = /\{.+\}/;
const disablePattern: RegExp = /\{disable\}/i;

const updateTemplateContent = async (channel: GuildChannel): Promise<void> => {
	if (
		channel instanceof TextChannel ||
		channel instanceof NewsChannel ||
		channel instanceof VoiceChannel ||
		channel instanceof CategoryChannel
	) {
		const guildSettings = await GuildService.init(channel.guild.id);

		if (channel instanceof TextChannel || channel instanceof NewsChannel) {
			const { topic, id } = channel;
			if (disablePattern.test(topic)) {
				await guildSettings.deleteCounter(id);
				await channel.edit({ topic: ":white_check_mark:" });
			} else if (counterPattern.test(topic)) {
				await guildSettings.setCounter(id, topic);
			}
		}

		if (channel instanceof CategoryChannel || channel instanceof VoiceChannel) {
			const { name, id } = channel;
			if (disablePattern.test(name)) {
				await guildSettings.deleteCounter(id);
				await channel.edit({ name: "✔" });
			} else if (counterPattern.test(name)) {
				await guildSettings.setCounter(id, name);
			}
		}
	}
};

export default updateTemplateContent;
