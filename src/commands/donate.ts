import Command from "../typings/Command";
import getEnv from "../utils/getEnv";
import Donation from "../typings/Donation";
import embedBase from "../utils/embedBase";
import fetch from "node-fetch";
import { EmbedField } from "eris";

const { DONATION_URL } = getEnv();

const donate: Command = {
	aliases: ["donate", "donators", "premium"],
	denyDm: false,
	run: async ({ message, languagePack }) => {
		const { channel } = message;
		const { emptyNote } = languagePack.commands.donate.misc;

		const donations: Array<Donation> = await fetch(
			"https://member-counter.eduardozgz.com/api/donation"
		).then((res) => res.json());

		let embed = embedBase(languagePack.commands.donate.embedReply);

		embed.url = DONATION_URL;
		embed.title = embed.title.replace("{DONATION_URL}", DONATION_URL);
		embed.fields = [];

		//put the donations in an embed
		donations.slice(0, 10).forEach((donation, i) => {
			let { note, user, amount, currency } = donation;

			if (note.length > 120) {
				note = note.slice(0, 120) + "...";
			}

			let field: EmbedField = {
				name: `**${i + 1}.** ${user} - ${amount} ${currency}`,
				value: note ? note : emptyNote,
				inline: false
			};
			embed.fields.push(field);
		});

		await channel.createMessage({ embed });
	}
};

const donateCommands = [donate];

export default donateCommands;
