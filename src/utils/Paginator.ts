import {
	ActionRowBuilder,
	ButtonBuilder,
	SelectMenuBuilder
} from "@discordjs/builders";
import {
	ButtonStyle,
	ChatInputCommandInteraction,
	InteractionCollector,
	APIEmbed
} from "discord.js";
import _ from "lodash";

import logger from "../logger";
import BaseEmbed from "./BaseMessageEmbed";

// TODO: i18n
/**
 * @author VampireChicken12
 * @author eduardozgz
 */
class Paginator {
	private currentPage: number;
	private pages: APIEmbed[] | BaseEmbed[];
	private ephemeral: boolean;
	private commandInteraction: ChatInputCommandInteraction;

	public constructor(
		commandInteraction: ChatInputCommandInteraction,
		pages: APIEmbed[] | BaseEmbed[],
		ephemeral = false
	) {
		this.commandInteraction = commandInteraction;
		this.ephemeral = ephemeral; // EmbedList we will page over
		this.pages = pages;
		this.currentPage = 0;

		// setup interaction collector
		if (pages.length > 1) {
			// Timeout time in milliseconds to stop listening for interactions
			const timeoutTime = 60 * 1000 * 5 * pages.length;

			new InteractionCollector(this.commandInteraction.client, {
				time: timeoutTime,
				filter: (interaction) => {
					if (!(interaction.isMessageComponent() || interaction.isSelectMenu()))
						return false;
					const [type, id] = interaction.customId.split(":");
					return (
						type === "paginator" &&
						id === this.commandInteraction.id &&
						interaction.user.id === commandInteraction.user.id
					);
				}
			})
				.on("collect", async (interaction) => {
					if (interaction.isButton()) {
						interaction.deferUpdate();
						const [, , page] = interaction.customId.split(":");
						if (page === "showJump") {
							this.commandInteraction.editReply({
								components: this.generateComponents(true)
							});
						} else {
							const pageInt = Number(page);
							this.displayPage(pageInt).catch(logger.error);
						}
					} else if (interaction.isSelectMenu()) {
						this.displayPage(Number(interaction.values[0]));
					}
				})
				.on("end", () => {
					this.commandInteraction.editReply({ components: [] });
				});
		}
	}

	/**
	 * Sends Pager to channel
	 */
	async displayPage(page: number) {
		this.currentPage = page;
		// Clone the embed and modify it by adding a page indicator
		const embedToSend: APIEmbed = _.cloneDeep(this.pages[page]) as APIEmbed;

		if (this.pages.length > 1) this.appendPageCounter(embedToSend);

		const components = this.generateComponents();

		// setup paginator in discord if it doesn't exists
		if (!this.commandInteraction.replied) {
			await this.commandInteraction.reply({
				embeds: [embedToSend],
				ephemeral: this.ephemeral,
				components
			});
			// Add reactions based on page counts
		} else {
			await this.commandInteraction.editReply({
				embeds: [embedToSend],
				components
			});
		}
	}
	/**
	 * Adds needed components for pagination based on page count
	 */
	private generateComponents(
		showJump = false
	): ActionRowBuilder<ButtonBuilder>[] {
		const rows = [];
		// If more than 1 page, display navigation controls
		if (this.pages.length > 1) {
			rows.push(
				new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId(`paginator:${this.commandInteraction.id}:0:0`)
							.setLabel("First")
							.setStyle(ButtonStyle.Primary)
							.setDisabled(this.currentPage === 0)
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId(
								`paginator:${this.commandInteraction.id}:${
									this.currentPage - 1
								}:1`
							)
							.setLabel("Previous")
							.setStyle(ButtonStyle.Primary)
							.setDisabled(this.currentPage === 0)
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId(
								`paginator:${this.commandInteraction.id}:${
									this.currentPage + 1
								}:2`
							)
							.setLabel("Next")
							.setStyle(ButtonStyle.Primary)
							.setDisabled(this.currentPage === this.pages.length - 1)
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId(
								`paginator:${this.commandInteraction.id}:${
									this.pages.length - 1
								}:3`
							)
							.setLabel("Last")
							.setStyle(ButtonStyle.Primary)
							.setDisabled(this.currentPage === this.pages.length - 1)
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId(`paginator:${this.commandInteraction.id}:showJump`)
							.setLabel("Jump")
							.setStyle(ButtonStyle.Primary)
							.setDisabled(showJump)
					)
			);

			if (showJump) {
				rows.push(
					new ActionRowBuilder().addComponents(
						new SelectMenuBuilder()
							.setCustomId(`paginator:${this.commandInteraction.id}`)
							.setPlaceholder("Select a page")
							.addOptions(
								_.uniq(
									_.range(0, 5).map((n) =>
										Math.floor(n * (this.pages.length / 5))
									)
								).map((page) => {
									return {
										label: `Page #${page + 1}`,
										value: page.toString()
									};
								})
							)
					)
				);
			}
		}

		return rows;
	}

	/**
	 * @param embed This object will be modified
	 */
	private appendPageCounter(embed: APIEmbed) {
		const pageText = "Page {CURRENT_PAGE}/{TOTAL_PAGES}"
			.replace(/\{CURRENT_PAGE\}/, (this.currentPage + 1).toString())
			.replace(/\{TOTAL_PAGES\}/, this.pages.length.toString());

		if (embed.footer) {
			embed.footer.text = pageText + " - " + embed.footer.text;
		} else {
			embed.footer = {
				text: pageText
			};
		}
	}
}
export default Paginator;
