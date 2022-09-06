import _ from "lodash";
import {
	CommandInteraction,
	InteractionCollector,
	MessageActionRow,
	MessageButton,
	MessageEmbedOptions,
	MessageSelectMenu
} from "discord.js";
import logger from "../logger";

/**
 * @author VampireChicken12
 * @author eduardozgz
 */
class Paginator {
	private currentPage: number;
	private pages: MessageEmbedOptions[];
	private ephemeral: boolean;
	private commandInteraction: CommandInteraction;

	public constructor(
		commandInteraction: CommandInteraction,
		pages: MessageEmbedOptions[],
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
						const [type, id, page] = interaction.customId.split(":");
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
		const embedToSend: MessageEmbedOptions = _.cloneDeep(this.pages[page]);

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
	private generateComponents(showJump = false): MessageActionRow[] {
		const rows = [];
		// If more than 1 page, display navigation controls
		if (this.pages.length > 1) {
			rows.push(
				new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId(`paginator:${this.commandInteraction.id}:0:0`)
							.setLabel("First")
							.setStyle("PRIMARY")
							.setDisabled(this.currentPage === 0)
					)
					.addComponents(
						new MessageButton()
							.setCustomId(
								`paginator:${this.commandInteraction.id}:${
									this.currentPage - 1
								}:1`
							)
							.setLabel("Previous")
							.setStyle("PRIMARY")
							.setDisabled(this.currentPage === 0)
					)
					.addComponents(
						new MessageButton()
							.setCustomId(
								`paginator:${this.commandInteraction.id}:${
									this.currentPage + 1
								}:2`
							)
							.setLabel("Next")
							.setStyle("PRIMARY")
							.setDisabled(this.currentPage === this.pages.length - 1)
					)
					.addComponents(
						new MessageButton()
							.setCustomId(
								`paginator:${this.commandInteraction.id}:${
									this.pages.length - 1
								}:3`
							)
							.setLabel("Last")
							.setStyle("PRIMARY")
							.setDisabled(this.currentPage === this.pages.length - 1)
					)
					.addComponents(
						new MessageButton()
							.setCustomId(`paginator:${this.commandInteraction.id}:showJump`)
							.setLabel("Jump")
							.setStyle("PRIMARY")
							.setDisabled(showJump)
					)
			);

			if (showJump) {
				rows.push(
					new MessageActionRow().addComponents(
						new MessageSelectMenu()
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
	private appendPageCounter(embed: MessageEmbedOptions) {
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
