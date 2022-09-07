import {
	Message,
	TextableChannel,
	GuildChannel,
	PrivateChannel,
	Client,
	EmbedOptions
} from "eris";
import clonedeep from "lodash.clonedeep";
import { ReactionCollector, MessageCollector } from "eris-collector";
import Emojis from "./emojis";
import LanguagePack from "../typings/LanguagePack";

class Paginator {
	private message: Message;
	private channel: TextableChannel;
	private client: Client;
	private currentPage: number;
	private pages: EmbedOptions[];
	private readonly totalPages: number;
	private readonly timeoutTime: number;
	private readonly targetUserID: string;
	private languagePack: LanguagePack;
	private jumpPromptCollector: MessageCollector | null;

	public constructor(
		channel: TextableChannel,
		targetUserID: string,
		pages: EmbedOptions[],
		languagePack: any
	) {
		this.client = channel.client;
		this.channel = channel;
		this.targetUserID = targetUserID;
		this.jumpPromptCollector = null;
		// EmbedList we will page over
		this.pages = pages;
		this.currentPage = 1;
		this.totalPages = pages.length;

		// Timeout time in milliseconds to stop listening for reactions
		this.timeoutTime = 60 * 1000 * 5 * pages.length;
		this.languagePack = languagePack;
	}

	/**
	 * Sends Pager to channel
	 */
	async displayPage(page: number) {
		// Clone the embed and modify it by adding a page indicator
		const embedToSend: EmbedOptions = clonedeep(this.pages[page]);
		this.appendPageCounter(embedToSend);

		// setup paginator in discord if it doesn't exists
		if (!this.message) {
			this.message = await this.channel.createMessage({
				embeds: [embedToSend]
			});
			// Create Reaction Collector to listen for user reactions
			this.createCollector();
			// Add reactions based on page counts
			await this.addReactions();
		} else {
			await this.message.edit({ embeds: [embedToSend] });
		}

		// Return our message object if we want to parse it after pagination
		return this.message;
	}
	async createJumpPrompt() {
		const { cancelText } = this.languagePack.functions.paginator;
		await this.channel
			.createMessage(
				this.languagePack.functions.paginator.jumpPrompt.replace(
					"{CANCEL_STRING}",
					this.languagePack.functions.paginator.cancelText
				)
			)
			.then(async (message) => {
				const filter = (m) =>
					(isNaN(m.content) &&
						["cancel", cancelText].includes(m.content) &&
						this.targetUserID === m.author.id) ||
					(!isNaN(m.content) && this.targetUserID === m.author.id);
				const collector = new MessageCollector(
					this.client,
					this.channel,
					filter,
					{
						time: 15000,
						max: 1
					}
				);
				this.jumpPromptCollector = collector;
				collector.on("collect", (m) => {
					if (["cancel", "0", cancelText].includes(m.content)) {
						collector.stop();
						message.delete();
						if (this.botCanManageMessages) {
							m.delete();
						}
					} else {
						message.delete();
						if (this.botCanManageMessages) {
							m.delete();
						}
						if (Number(m.content) > this.totalPages) {
							return message.channel
								.createMessage(
									this.languagePack.functions.paginator.errorPageLengthExceeded.replace(
										/\{TOTAL_PAGES\}/,
										this.totalPages.toString()
									)
								)
								.then((message) => {
									setTimeout(() => {
										message.delete();
									}, 15000);
								});
						}
						if (Math.sign(m.content) === -1) {
							return message.channel
								.createMessage(
									this.languagePack.functions.paginator.errorNegativeInput
								)
								.then((message) => {
									setTimeout(() => {
										message.delete();
									}, 15000);
								});
						}
						this.currentPage = Number(m.content);
						this.displayPage(this.currentPage - 1);
					}
				});
				collector.on("end", () => {
					message.delete();
				});
			});
	}
	/**
	 * Initiates jumping to specified page
	 */
	async jumpPrompt() {
		if (this.jumpPromptCollector) {
			this.jumpPromptCollector.stop();
			await this.createJumpPrompt();
		} else {
			await this.createJumpPrompt();
		}
	}

	/**
	 * Creates the Reaction Collector to listen to reactions from user
	 */
	createCollector() {
		// Filter reactions to the user that requested the embed
		const filter = (_m, _emoji, userID) => userID === this.targetUserID;
		// Create Reaction Collector
		const collector = new ReactionCollector(this.client, this.message, filter, {
			time: this.timeoutTime,
			dispose: true
		});
		const emojis = Emojis(this.botCanUseCustomEmojis);
		const reactionHandler = async (event, emoji) => {
			// Avoid double triggering because the bot is also removing the user's reaction, the bot removes the reaction when it has permissions to do it
			if (this.botCanManageMessages && event === "remove") return;
			// If reaction is the back button and we are NOT on the first page, go back
			switch (emoji.name) {
				// If user hits back, go back 1 page
				case emojis.previousPage.name: {
					if (this.currentPage !== 1)
						await this.displayPage(--this.currentPage - 1);

					break;
				}
				// If user hits next, go forward 1 page
				case emojis.nextPage.name: {
					if (this.currentPage !== this.pages.length)
						await this.displayPage(++this.currentPage - 1);

					break;
				}
				// Go to first page
				case emojis.firstPage.name: {
					this.currentPage = 1;
					await this.displayPage(this.currentPage - 1);

					break;
				}
				// Go to last page
				case emojis.lastPage.name: {
					this.currentPage = this.pages.length;
					await this.displayPage(this.currentPage - 1);

					break;
				}
				case emojis.jump.name: {
					await this.jumpPrompt();

					break;
				}
			}
			if (this.botCanManageMessages) {
				await this.message.removeReaction(
					emoji.id ? emoji.name + ":" + emoji.id : emoji.name,
					this.targetUserID
				);
			}
		};

		// When the collector times out or the user hits stop, remove all reactions
		collector.on("end", () => {
			if (this.botCanManageMessages) {
				this.message.removeReactions();
			}
		});

		// Handle actions based on selected reaction from user
		collector.on("collect", (message, emoji) =>
			reactionHandler("collect", emoji)
		);
		collector.on("remove", (emoji) => reactionHandler("remove", emoji));
	}
	/**
	 * Adds needed reactions for pagination based on page count
	 */
	async addReactions() {
		const emojis = Emojis(this.botCanUseCustomEmojis);
		// If more than 1 page, display navigation controls
		if (this.totalPages > 1) {
			// If more than 5 pages display first and last button reactions
			if (this.totalPages >= 5) {
				await this.message.addReaction(emojis.firstPage.reaction);
				await this.message.addReaction(emojis.previousPage.reaction);
				await this.message.addReaction(emojis.nextPage.reaction);
				await this.message.addReaction(emojis.lastPage.reaction);
				await this.message.addReaction(emojis.jump.reaction);
				// If less than 5 pages only shows back and next reactions
			} else {
				await this.message.addReaction(emojis.previousPage.reaction);
				await this.message.addReaction(emojis.nextPage.reaction);
			}
		}
	}

	get botCanUseCustomEmojis() {
		return (
			(this.channel instanceof GuildChannel &&
				this.channel
					.permissionsOf(this.client.user.id)
					.has("externalEmojis")) ||
			this.channel instanceof PrivateChannel
		);
	}
	get botCanManageMessages() {
		return (
			this.channel instanceof GuildChannel &&
			this.channel.permissionsOf(this.client.user.id).has("manageMessages")
		);
	}

	private appendPageCounter(embed: EmbedOptions) {
		if (embed.footer) {
			embed.footer.text =
				this.languagePack.functions.paginator.pageCounter
					.replace(/\{CURRENT_PAGE\}/, this.currentPage.toString())
					.replace(/\{TOTAL_PAGES\}/, this.totalPages.toString()) +
				" - " +
				embed.footer.text;
		} else {
			embed.footer = {
				text: this.languagePack.functions.paginator.pageCounter
					.replace(/\{CURRENT_PAGE\}/, this.currentPage.toString())
					.replace(/\{TOTAL_PAGES\}/, this.totalPages.toString())
			};
		}
	}
}
export default Paginator;
