import Command from "../typings/Command";
import {
	CategoryChannel,
	TextChannel,
	NewsChannel,
	VoiceChannel,
	Constants
} from "eris";
import { table } from "table";
import embedBase from "../utils/embedBase";
import GuildService from "../services/GuildService";
import {
	loadLanguagePack,
	availableLanguagePacks
} from "../utils/languagePack";
import botHasPermsToEdit from "../utils/botHasPermsToEdit";
import UserError from "../utils/UserError";
import getEnv from "../utils/getEnv";
import Paginator from "../utils/paginator";
import safeDiscordString from "../utils/safeDiscordString";
import Emojis from "../utils/emojis";
import neededBotPermissions from "../utils/neededBotPermissions";
import getBotInviteLink from "../utils/getBotInviteLink";

const { PREMIUM_BOT_INVITE, BOT_OWNERS } = getEnv();

const seeSettings: Command = {
	aliases: ["seeSettings"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack, guildService }) => {
		const { channel } = message;

		const { guild } = channel;
		const {
			headerText,
			prefixText,
			langText,
			localeText,
			shortNumberText,
			allowedRolesText,
			noText,
			yesText,
			countersText,
			customNumbersText,
			warningNoPermsText,
			guildLogsText
		} = languagePack.commands.seeSettings.settingsMessage;

		const {
			prefix,
			language,
			locale,
			shortNumber,
			allowedRoles,
			counters,
			digits
		} = guildService;

		let generalSection = "";
		let countersSection = "";
		let logsSection: string[] = [];

		// format general settings
		generalSection += `${prefixText} \`${prefix}\`\n`;
		generalSection += `${langText} \`${language}\`\n`;
		generalSection += `${localeText} \`${locale}\`\n`;
		generalSection += `${shortNumberText} \`${
			shortNumber > -1 ? yesText : noText
		}\`\n`;
		generalSection += `${
			allowedRoles.length
				? allowedRolesText +
				  " " +
				  allowedRoles.map((role) => `<@&${role}>`).join(" ")
				: ""
		}\n`;
		generalSection += `${customNumbersText} ${digits.join(" ")}`;

		// format counters
		if (counters.size) {
			// If there is some counter with lack of perms, show the legend
			if (
				Array.from(counters).filter(([channelId]) => {
					const discordChannel = guild.channels.get(channelId);
					return !botHasPermsToEdit(discordChannel);
				}).length > 0
			) {
				countersSection += `> ${warningNoPermsText}\n\n`;
			}

			for (const [counter, content] of counters) {
				const discordChannel = guild.channels.get(counter);
				const { name, type } = discordChannel;
				const icon = ["\\#️⃣", " ", "\\🔊", " ", "\\📚", "\\📢", " "];

				countersSection += `${
					botHasPermsToEdit(discordChannel) ? "     " : " \\⚠️ "
				}- ${icon[type]} ${name} \`${counter}\`: \`\`\`${content}\`\`\`\n`;
			}
		}

		const latestLogs = await guildService.getLatestLogs(100);
		if (latestLogs.length) {
			const formatedLatestLogs = latestLogs
				.map(({ timestamp, text }) => `[${timestamp.toISOString()}] ${text}\n`)
				.join("");

			logsSection = safeDiscordString(formatedLatestLogs).map(
				(portion) => "```" + portion + "```"
			);
		}

		const embedPages = [
			...safeDiscordString(generalSection).map((text) => {
				return embedBase({
					title: `**${headerText}** ${guild.name} \`${guild.id}\``,
					description: text
				});
			}),
			...safeDiscordString(countersSection).map((text) => {
				return embedBase({
					title: `**${countersText}** ${guild.name} \`${guild.id}\``,
					description: text
				});
			}),
			...logsSection.map((text) => {
				return embedBase({
					title: `**${guildLogsText}** ${guild.name} \`${guild.id}\``,
					description: text
				});
			})
		];

		new Paginator(
			message.channel,
			message.author.id,
			embedPages,
			languagePack
		).displayPage(0);
	}
};

const resetSettings: Command = {
	aliases: ["resetSettings", "restoreSettings"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack, guildService }) => {
		const { channel, author } = message;
		const { guild } = channel;

		guildService.counters.forEach((content, channelId) => {
			if (guild.channels.has(channelId)) {
				const channel = guild.channels.get(channelId);
				if (
					channel instanceof VoiceChannel ||
					channel instanceof CategoryChannel
				) {
					channel
						.delete(`Reset requested by <@${author.id}>`)
						.catch(console.error);
				}
				if (channel instanceof TextChannel || channel instanceof NewsChannel) {
					channel
						.edit({ topic: "" }, `Reset requested by <@${author.id}>`)
						.catch(console.error);
				}
			}
		});

		await guildService.resetSettings();
		await channel.createMessage(languagePack.commands.resetSettings.done);
	}
};

const lang: Command = {
	aliases: ["lang", "language"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack, guildService }) => {
		const { content, channel } = message;
		const { guild } = channel;
		const availableLanguages = availableLanguagePacks.sort();
		const [command, languageRequested]: any[] = content.split(/\s+/);
		let { errorNotFound: listOfLangPacks } = languagePack.commands.lang;

		if (availableLanguages.includes(languageRequested)) {
			await guildService.setLanguage(languageRequested);

			languagePack = loadLanguagePack(languageRequested);
			let { success } = languagePack.commands.lang;
			await channel.createMessage(success);
		} else {
			let langTable: string[][] = [];

			availableLanguages.forEach((availableLanguageCode, index) => {
				const guildLanguagePack = languagePack;
				const ilanguagePack = loadLanguagePack(availableLanguageCode);
				const isSelected =
					ilanguagePack.langCode === guildLanguagePack.langCode;

				langTable[index] = [
					`${isSelected ? " > " : "   "}` +
						ilanguagePack.langCode +
						`${isSelected ? " < " : "   "}`,
					`${ilanguagePack.langName} (${ilanguagePack.langCode.split("_")[1]})`
				];
			});
			let tableConfig = {
				border: {
					topBody: ` `,
					topJoin: ` `,
					topLeft: ` `,
					topRight: ` `,

					bottomBody: ` `,
					bottomJoin: ` `,
					bottomLeft: ` `,
					bottomRight: ` `,

					bodyLeft: ` `,
					bodyRight: ` `,
					bodyJoin: `│`,

					joinBody: `─`,
					joinLeft: ` `,
					joinRight: ` `,
					joinJoin: `┼`
				}
			};

			await channel.createMessage(
				`${listOfLangPacks}\`\`\`fix\n${table(langTable, tableConfig)}\`\`\``
			);
		}
	}
};

const prefix: Command = {
	aliases: ["prefix"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack, guildService }) => {
		const { channel, content } = message;
		const [command, newPrefix] = content.split(/\s+/g);

		if (newPrefix) {
			await guildService.setPrefix(newPrefix);
			await channel.createMessage(
				languagePack.commands.prefix.success.replace(
					"{NEW_PREFIX}",
					guildService.prefix
				)
			);
		} else {
			throw new UserError(languagePack.commands.prefix.noPrefixProvided);
		}
	}
};

const role: Command = {
	aliases: ["role", "roles"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack, guildService }) => {
		const { channel, content, roleMentions } = message;

		const { guild } = channel;
		const [command, action] = content.toLowerCase().split(/\s+/);

		let rolesMentioned: string[] = roleMentions;
		let newAllowedRoles: string[] = guildService.allowedRoles;

		switch (action) {
			case "allow":
				if (/all(\s|$)/g.test(content)) {
					// that filter is to remove @everyone
					newAllowedRoles = Array.from(guild.roles, (role) =>
						role[0].toString()
					);
					newAllowedRoles = newAllowedRoles.filter((role) => role !== guild.id);
				} else {
					roleMentions.forEach((role) => {
						if (!newAllowedRoles.includes(role)) newAllowedRoles.push(role);
					});
				}
				break;

			case "deny":
				if (/all(\s|$)/g.test(content)) {
					newAllowedRoles = [];
				} else {
					roleMentions.forEach((role) => {
						newAllowedRoles = newAllowedRoles.filter(
							(allowedRole) => role !== allowedRole
						);
					});
				}
				break;

			default:
				throw new UserError(languagePack.commands.role.invalidParams);
				return;
		}

		// save config
		if (newAllowedRoles.length > 0 || /all(\s|$)/g.test(content)) {
			await guildService.setAllowedRoles(newAllowedRoles);
			await channel.createMessage(languagePack.commands.role.rolesUpdated);
		} else {
			throw new UserError(languagePack.commands.role.errorNoRolesToUpdate);
		}
	}
};

const upgradeServer: Command = {
	aliases: ["upgradeServer", "serverupgrade"],
	denyDm: true,
	onlyAdmin: false,
	run: async ({ message, languagePack, guildService }) => {
		const { author, channel } = message;
		const {
			success,
			noServerUpgradesAvailable,
			errorCannotUpgrade
		} = languagePack.commands.upgradeServer;

		try {
			await guildService.upgradeServer(author.id);
			await channel.createMessage(
				success.replace(
					"{BOT_LINK}",
					PREMIUM_BOT_INVITE + `&guild_id=${guildService.id}`
				)
			);
		} catch (error) {
			switch (error.message) {
				case "alreadyUpgraded": {
					throw new UserError(
						errorCannotUpgrade +
							` ${PREMIUM_BOT_INVITE + `&guild_id=${guildService.id}`}`
					);
				}
				case "noUpgradesAvailable": {
					throw new UserError(
						noServerUpgradesAvailable.replace("{PREFIX}", guildService.prefix)
					);
				}
				default:
					throw error;
					break;
			}
		}
	}
};

const setDigit: Command = {
	aliases: ["setDigit"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack, guildService }) => {
		const { channel, content } = message;
		const userWantsToReset = content.split(/\s+/)[1] === "reset";

		if (userWantsToReset) {
			await guildService.resetDigits();
			await channel.createMessage(languagePack.commands.setDigit.resetSuccess);
		} else {
			const digitsToSet = (() => {
				let [command, ...args]: any = content.split(" ");
				return args
					.join(" ")
					.split(",")
					.map((set) => set.trim())
					.map((set) => (set = set.split(/\s+/)))
					.map((set) => {
						if (!isNaN(parseInt(set[0], 10)) && set[1]) {
							return {
								digit: parseInt(set[0], 10),
								value: set[1]
							};
						} else {
							return null;
						}
					})
					.filter((digit) => digit !== null);
			})();

			if (digitsToSet.length > 0) {
				for (const digitToSet of digitsToSet) {
					await guildService.setDigit(digitToSet.digit, digitToSet.value);
				}
				await channel.createMessage(languagePack.commands.setDigit.success);
			} else {
				throw new UserError(languagePack.commands.setDigit.errorMissingParams);
			}
		}
	}
};

const shortNumber: Command = {
	aliases: ["shortNumber", "shortDigit"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack, guildService }) => {
		const { channel, content } = message;
		const [command, action] = content.split(/\s+/);

		const { guild } = channel;

		if (action === "enable" || action === "on") {
			await guildService.setShortNumber(1);
		} else if (action === "disable" || action === "off") {
			await guildService.setShortNumber(-1);
		} else {
			throw new UserError(languagePack.commands.shortNumber.errorInvalidAction);
		}

		await channel.createMessage(languagePack.commands.shortNumber.success);
	}
};

const locale: Command = {
	aliases: ["locale"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, languagePack, guildService }) => {
		const { channel, content } = message;
		const [command, locale] = content.split(/\s+/);

		const { guild } = channel;

		await guildService.setLocale(locale);

		await channel.createMessage(languagePack.commands.shortNumber.success);
	}
};

const block: Command = {
	aliases: ["block", "unblock"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, client, guildService }) => {
		const { channel, content, author } = message;
		const [command, guildId] = content.split(/\s+/);

		if (!BOT_OWNERS.includes(author.id)) return;

		const guildToPerformAction = await GuildService.init(guildId);

		if (command === `block`) {
			await guildToPerformAction.block();
			await client.guilds.get(guildId)?.leave();
		} else {
			await guildToPerformAction.unblock();
		}

		message.addReaction("✅");
	}
};

const checkPerms: Command = {
	aliases: ["checkPerms", "checkPermissions"],
	denyDm: true,
	onlyAdmin: true,
	run: async ({ message, client, languagePack, guildService }) => {
		const {
			content,
			channel,
			channel: { guild }
		} = message;
		const languagePackCheckPermissions = languagePack.commands.checkPermissions;
		const botMemberPermissions = guild.members.get(client.user.id).permissions;
		const canUseExternalEmojis = channel
			.permissionsOf(message.channel.client.user.id)
			.has("externalEmojis");
		const emojis = Emojis(canUseExternalEmojis);

		let messageBody = "";

		if (botMemberPermissions.has("administrator")) {
			messageBody += `${emojis.warning} ${emojis.warning} ${emojis.warning} ${languagePackCheckPermissions.adminWarning} ${emojis.warning} ${emojis.warning} ${emojis.warning}\n\n`;
		}

		messageBody += neededBotPermissions
			.map((permission) => {
				const {
					optional,
					name,
					description
				} = languagePackCheckPermissions.details[permission];
				let sectionBody = "";

				if (botMemberPermissions.has(permission)) {
					sectionBody += emojis.confirm;
				} else if (optional) {
					sectionBody += emojis.warning;
				} else {
					sectionBody += emojis.negative;
				}

				sectionBody += ` **__${name}__** ${
					optional ? languagePackCheckPermissions.optionalText : ""
				}\n`;
				sectionBody += `${description}\n`;

				sectionBody = sectionBody.replace(/\{PREFIX\}/gi, guildService.prefix);

				return sectionBody;
			})
			.join("\n");

		messageBody += "\n";
		messageBody += "\n";
		messageBody += languagePackCheckPermissions.footer;
		messageBody += "\n";
		messageBody += getBotInviteLink();

		if (botMemberPermissions.has("embedLinks")) {
			const embeds = safeDiscordString(messageBody).map((content) =>
				embedBase({ title: `Check permissions`, description: content })
			);
			new Paginator(
				message.channel,
				message.author.id,
				embeds,
				languagePack
			).displayPage(0);
		} else {
			safeDiscordString(messageBody).forEach((content) =>
				channel.createMessage(content)
			);
		}
	}
};

const settingsCommands = [
	seeSettings,
	resetSettings,
	prefix,
	lang,
	role,
	upgradeServer,
	setDigit,
	shortNumber,
	locale,
	block,
	checkPerms
];

export default settingsCommands;
