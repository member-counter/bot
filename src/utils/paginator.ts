import {
  Message,
  TextableChannel,
  GuildChannel,
  PrivateChannel,
  Client,
  EmojiOptions,
  EmbedOptions
} from 'eris'
import clonedeep from 'lodash.clonedeep';
import { ReactionCollector, MessageCollector } from 'eris-collector'
import emojis from './emojis'

class Paginator {
  private message: Message
  private channel: TextableChannel
  private client: Client
  private currentPage: number
  private pages: any[]
  private readonly totalPages: number
  private readonly timeoutTime: number
  private collector: ReactionCollector
  private readonly targetUserID: string
  private languagePack: any;

  public constructor(
    channel: TextableChannel,
    targetUserID: string,
    pages: EmojiOptions[],
    languagePack: any,
  ) {
    this.client = channel.client
    this.channel = channel
    this.targetUserID = targetUserID
    // EmbedList we will page over
    this.pages = pages
    this.currentPage = 0
    this.totalPages = pages.length

    // Timeout time in milliseconds to stop listening for reactions
    this.timeoutTime = 60 * 1000 * 5
    this.languagePack = languagePack;
  }

  /**
   * Sends Pager to channel
   */
  async displayPage(page) {
    // Clone the embed and modify it by adding a page indicator
    const embedToSend: EmbedOptions = clonedeep(this.pages[page]);
    this.appendPageCounter(embedToSend);

    // setup paginator in discord if it doesn't exists
    if (!this.message) {
      this.message = await this.channel.createMessage({ embed: embedToSend })
      // Create Reaction Collector to listen for user reactions
      this.createCollector()
      // Add reactions based on page counts
      await this.addReactions()
    } else {
      await this.message.edit({ embed: embedToSend })
    }

    // Return our message object if we want to parse it after pagination
    return this.message
  }
  /**
   * Initiates jumping to specified page
   */
  async jump() {
    // TODO use languagePack
    await this.message.channel
      .createMessage(
        `What page would you like to jump to? Say \`cancel\` or \`0\` to cancel the prompt. Your window to reply ends in 15 seconds.`
      )
      .then(async message => {
        const filter = m =>
          (isNaN(m.content) &&
            ['cancel'].includes(m.content) &&
            this.targetUserID === m.author.id) ||
          (!isNaN(m.content) && this.targetUserID === m.author.id)
        const collector = new MessageCollector(
          this.client,
          this.message.channel,
          filter,
          {
            time: 15000,
            max: 1
          }
        )
        collector.on('collect', m => {
          if (m.content === 'cancel') {
            collector.stop()
            message.delete()
            if (
              this.message.channel instanceof GuildChannel &&
              this.message.channel
                .permissionsOf(this.client.user.id)
                .has('manageMessages')
            ) {
              m.delete()
            }
          } else if (m.content === '0') {
            collector.stop()
            message.delete()
            if (
              this.message.channel instanceof GuildChannel &&
              this.message.channel
                .permissionsOf(this.client.user.id)
                .has('manageMessages')
            ) {
              m.delete()
            }
          } else {
            message.delete()
            if (
              this.message.channel instanceof GuildChannel &&
              this.message.channel
                .permissionsOf(this.client.user.id)
                .has('manageMessages')
            ) {
              m.delete()
            }
            if (Number(m.content) > this.totalPages) {
              // TODO use languagePack
              return message.channel
                .createMessage(
                  `The page to jump to must be less than or equal to ${this.totalPages}, Please try again.`
                )
                .then(message => {
                  setTimeout(() => {
                    message.delete()
                  }, 15000)
                })
            }
            if (Math.sign(m.content) === -1) {
              // TODO use languagePack
              return message.channel
                .createMessage(
                  `The page to jump to can't be negative, Please try again.`
                )
                .then(message => {
                  setTimeout(() => {
                    message.delete()
                  }, 15000)
                })
            }
            this.displayPage(Number(m.content) - 1)
          }
        })
      })
  }

  /**
   * Creates the Reaction Collector to listen to reactions from user
   */
  createCollector() {
    // Filter reactions to the user that requested the embed
    const filter = (_m, _emoji, userID) => userID === this.targetUserID
    // Create Reaction Collector
    const collector = new ReactionCollector(this.client, this.message, filter, {
      time: this.timeoutTime
    })
    // Save collector to be used later in execution
    this.collector = collector
    // Handle actions based on selected reaction from user
    collector.on('collect', async (_m, react, _userId) => {
      // TODO test what the hell returns react so we can add fallback emojis
      console.info({ react })
      // If reaction is the back button and we are NOT on the first page, go back
      switch (react.name) {
        // If user hits back, go back 1 page
        case emojis.previousPage.reaction: {
          if (this.currentPage !== 0) await this.displayPage(--this.currentPage)

          break
        }
        // If user hits next, go forward 1 page
        case emojis.nextPage.reaction: {
          if (this.currentPage !== this.pages.length) await this.displayPage(++this.currentPage)

          break
        }
        // Go to first page
        case emojis.firstPage.reaction: {
          await this.displayPage(0)

          break
        }
        // Go to last page
        case emojis.lastPage.reaction: {
          await this.displayPage(this.pages.length - 1)

          break
        }
        case emojis.jumpPage.reaction: {
          await this.jump()

          break
        }
      }
      if (
        this.message.channel instanceof GuildChannel &&
        this.message.channel
          .permissionsOf(this.client.user.id)
          .has('manageMessages')
      ) {
        // TODO fix this
        await this.message.removeReaction(
          react.id ? react.name + ':' + react.id : react.name,
          this.targetUserID
        )
      }
    })

    // When the collector times out or the user hits stop, remove all reactions
    collector.on('end', () => {
      if (
        this.message.channel instanceof GuildChannel &&
        this.message.channel
          .permissionsOf(this.client.user.id)
          .has('manageMessages')
      ) {
        this.message.removeReactions()
      }
    })
  }
  /**
   * Adds needed reactions for pagination based on page count
   */
  async addReactions() {
    // If more than 1 page, display navigation controls
    if (this.totalPages > 1) {
      // If more than 5 pages display first and last button reactions
      if (this.totalPages >= 5) {
        // if bot can use custom emojis
        if (this.botCanUseCustomEmojis()) {
          await this.message.addReaction(emojis.firstPage.reaction)
          await this.message.addReaction(emojis.previousPage.reaction)
          await this.message.addReaction(emojis.nextPage.reaction)
          await this.message.addReaction(emojis.lastPage.reaction)
          await this.message.addReaction(emojis.jumpPage.reaction)
        } else {
          await this.message.addReaction(emojis.firstPage.fallbackUnicodeEmoji)
          await this.message.addReaction(emojis.previousPage.fallbackUnicodeEmoji)
          await this.message.addReaction(emojis.nextPage.fallbackUnicodeEmoji)
          await this.message.addReaction(emojis.lastPage.fallbackUnicodeEmoji)
          await this.message.addReaction(emojis.jumpPage.fallbackUnicodeEmoji)
        }
        // If less than 5 pages only shows back and next reactions
      } else {
        if (this.botCanUseCustomEmojis()) {
          await this.message.addReaction(emojis.previousPage.reaction)
          await this.message.addReaction(emojis.nextPage.reaction)
        } else {
          await this.message.addReaction(emojis.previousPage.fallbackUnicodeEmoji)
          await this.message.addReaction(emojis.nextPage.fallbackUnicodeEmoji)
        }
      }
    }
  }

  private botCanUseCustomEmojis() {
    return (this.channel instanceof GuildChannel && this.channel.permissionsOf(this.client.user.id).has('externalEmojis')) ||
      (this.channel instanceof PrivateChannel);
  }

  private appendPageCounter(embed: EmbedOptions) {
    if (embed.footer) {
      embed.footer.text += " - " + this.languagePack.functions.paginator.pageCounter.replace(/\{CURRENT_PAGE\}/, this.currentPage)
        .replace(/\{TOTAL_PAGES\}/, this.totalPages);
    }
    else {
      embed.footer = {
        text: this.languagePack.functions.paginator.pageCounter.replace(/\{CURRENT_PAGE\}/, this.currentPage)
          .replace(/\{TOTAL_PAGES\}/, this.totalPages)
      }
    }
  }
}
export default Paginator
