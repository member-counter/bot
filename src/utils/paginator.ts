import {
  Message,
  TextableChannel,
  GuildChannel,
  PrivateChannel,
  Client
} from 'eris'
import { ReactionCollector, MessageCollector } from 'eris-collector'
import emojis from './emojis'
class Paginator {
  private msg: Message

  private pages: any[]

  private page: number

  private readonly timeoutTime: number

  private collector: ReactionCollector
  private readonly userID: string

  private channel: TextableChannel
  private client: Client
  private readonly totalPages: number

  private originalMessage: Message

  private readonly footerText: string

  private reactions: {
    firstPage: any
    previousPage: any
    nextPage: any
    lastPage: any
    jumpPage: any
    loading: any
    bin: any
    check: any
    cross_mark: any
    queue_repeat: any
    track_repeat: any
    eraser: any
    backArrow: any
    upArrow: any
    downArrow: any
    stop: any
    note: any
    404: any
    warning: any
    rock: any
    paper: any
    scissors: any
    typescript: any
    incoming: any
    outgoing: any
  }

  public constructor (
    client: Client,
    msg: Message,
    pages: any[],
    footerText = ''
  ) {
    this.client = client
    this.msg = msg
    this.originalMessage = msg
    this.channel = msg.channel as TextableChannel
    this.userID = msg.author.id
    this.footerText = footerText
    // Current page of the embedList we are on
    this.page = 1

    // EmbedList we will page over
    this.pages = pages
    this.totalPages = pages.length
    this.reactions = emojis(client.guilds)

    // Timeout time in milliseconds to stop listening for reactions
    this.timeoutTime = 60 * 1000 * 5
  }
  /**
   * Sends Pager to channel
   */
  async send () {
    // Embed footer text
    const footerText = `Page ${this.page}/${this.totalPages} ${
      this.footerText !== '' ? `| ${this.footerText}` : ''
    }`
    // Send the first page of the embed list
    let msg
    if (!this.pages[0].footer) {
      this.pages[0].footer = {
        text: footerText,
        icon_url: this.pages[0].customImage || ''
      }
      msg = await this.channel.createMessage({ embed: this.pages[0] })
    } else {
      if (
        this.pages[0].footer.text.match(/\{CURRENT_PAGE\}/) &&
        this.pages[0].footer.text.match(/\{TOTAL_PAGES\}/)
      ) {
        this.pages[0].footer.text = this.pages[0].footer.text
          .replace(/\{CURRENT_PAGE\}/, this.page)
          .replace(/\{TOTAL_PAGES\}/, this.totalPages)
      } else {
        this.pages[0].footer.text =
          '{CURRENT_PAGE}/{TOTAL_PAGES} - ' + this.pages[0].footer.text
        this.pages[0].footer.text = this.pages[0].footer.text
          .replace(/\{CURRENT_PAGE\}/, this.page)
          .replace(/\{TOTAL_PAGES\}/, this.totalPages)
      }

      msg = await this.channel.createMessage({ embed: this.pages[0] })
    }
    // Assign the previously sent message as the target message
    this.msg = msg
    // Add reactions based on page counts
    await this.addReactions()
    // Create Reaction Collector to listen for user reactions
    this.createCollector(this.userID)
    // Return our message object if we want to parse it after pagination
    return msg
  }
  /**
   * Initiates jumping to specified page
   */
  async jump (userID: string) {
    await this.msg.channel
      .createMessage(
        `What page would you like to jump to? Say \`cancel\` or \`0\` to cancel the prompt. Your window to reply ends in 15 seconds.`
      )
      .then(async message => {
        const filter = m =>
          (isNaN(m.content) &&
            ['cancel'].includes(m.content) &&
            userID === m.author.id) ||
          (!isNaN(m.content) && userID === m.author.id)
        const collector = new MessageCollector(
          this.client,
          this.msg.channel,
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
              this.msg.channel instanceof GuildChannel &&
              this.msg.channel
                .permissionsOf(this.client.user.id)
                .has('manageMessages')
            ) {
              m.delete()
            }
          } else if (m.content === '0') {
            collector.stop()
            message.delete()
            if (
              this.msg.channel instanceof GuildChannel &&
              this.msg.channel
                .permissionsOf(this.client.user.id)
                .has('manageMessages')
            ) {
              m.delete()
            }
          } else {
            message.delete()
            if (
              this.msg.channel instanceof GuildChannel &&
              this.msg.channel
                .permissionsOf(this.client.user.id)
                .has('manageMessages')
            ) {
              m.delete()
            }
            if (Number(m.content) > this.totalPages) {
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
            this.select(Number(m.content))
          }
        })
      })
  }
  /**
   * Selects and shows the target page from this.pages
   * @param page page number of wanted index from this.pages
   */
  async select (page = 1) {
    this.page = page
    const footerText = `Page ${this.page}/${this.totalPages} ${
      this.footerText !== '' ? `| ${this.footerText}` : ''
    }`
    if (!this.pages[page - 1].footer) {
      this.pages[page - 1].footer = {
        text: footerText,
        icon_url: this.pages[page - 1].customImage || ''
      }
      await this.msg.edit({ embed: this.pages[page - 1] })
    } else {
      if (
        this.pages[page - 1].footer.text.match(/\{CURRENT_PAGE\}/) &&
        this.pages[page - 1].footer.text.match(/\{TOTAL_PAGES\}/)
      ) {
        this.pages[page - 1].footer.text = this.pages[page - 1].footer.text
          .replace(/\{CURRENT_PAGE\}/, this.page)
          .replace(/\{TOTAL_PAGES\}/, this.totalPages)
      } else {
        this.pages[page - 1].footer.text =
          '{CURRENT_PAGE}/{TOTAL_PAGES} - ' + this.pages[page - 1].footer.text
        this.pages[page - 1].footer.text = this.pages[page - 1].footer.text
          .replace(/\{CURRENT_PAGE\}/, this.page)
          .replace(/\{TOTAL_PAGES\}/, this.totalPages)
      }
      await this.msg.edit({ embed: this.pages[page - 1] })
    }
  }
  /**
   * Creates the Reaction Collector to listen to reactions from user
   * @param userId user ID of the member who originally requested the embed
   */
  createCollector (userId) {
    // Filter reactions to the user that requested the embed
    const filter = (_m, _emoji, userID) => userID === userId
    // Create Reaction Collector
    const collector = new ReactionCollector(this.client, this.msg, filter, {
      time: this.timeoutTime
    })
    // Save collector to be used later in execution
    this.collector = collector
    // Handle actions based on selected reaction from user
    collector.on('collect', async (_m, react, _userId) => {
      // If reaction is the back button and we are NOT on the first page, go back
      switch (react.name) {
        // If user hits stop, stop the collector and remove all reactions
        case this.reactions.stop.name: {
          this.collector.stop()
          await this.msg.reactions.removeAll()
          break
        }
        // If user hits back, go back 1 page
        case this.reactions.previousPage.name: {
          if (this.page !== 1) await this.select(this.page - 1)

          break
        }
        case '◀': {
          if (this.page !== 1) await this.select(this.page - 1)

          break
        }
        // If user hits next, go forward 1 page
        case this.reactions.nextPage.name: {
          if (this.page !== this.pages.length) await this.select(this.page + 1)

          break
        }
        case '▶': {
          if (this.page !== this.pages.length) await this.select(this.page + 1)

          break
        }
        // Go to first page
        case this.reactions.firstPage.name: {
          await this.select(1)

          break
        }
        case '⏮': {
          await this.select(1)

          break
        }
        // Go to last page
        case this.reactions.lastPage.name: {
          await this.select(this.pages.length)

          break
        }
        case '⏭️': {
          await this.select(this.pages.length)

          break
        }
        case this.reactions.jumpPage.name: {
          await this.jump(this.userID)

          break
        }
        case '↗': {
          await this.jump(this.userID)

          break
        }
      }
      if (
        this.msg.channel instanceof GuildChannel &&
        this.msg.channel
          .permissionsOf(this.client.user.id)
          .has('manageMessages')
      ) {
        await this.msg.removeReaction(
          react.id ? react.name + ':' + react.id : react.name,
          this.originalMessage.author.id
        )
      }
    })

    // When the collector times out or the user hits stop, remove all reactions
    collector.on('end', () => this.msg.removeReactions())
  }
  /**
   * Adds needed reactions for pagination based on page count
   */
  async addReactions () {
    // If more than 1 page, display navigation controls
    if (this.totalPages > 1) {
      // If more than 5 pages display first and last button reactions
      if (this.totalPages >= 5) {
        if (
          (this.msg.channel instanceof GuildChannel &&
            this.reactions.firstPage &&
            this.msg.channel
              .permissionsOf(this.client.user.id)
              .has('externalEmojis')) ||
          (this.msg.channel instanceof PrivateChannel &&
            this.reactions.firstPage)
        )
          await this.msg.channel.addMessageReaction(
            this.msg.id,
            this.reactions.firstPage.name + ':' + this.reactions.firstPage.id
          )
        else await this.msg.channel.addMessageReaction(this.msg.id, '⏮')
        if (
          (this.msg.channel instanceof GuildChannel &&
            this.reactions.previousPage &&
            this.msg.channel
              .permissionsOf(this.client.user.id)
              .has('externalEmojis')) ||
          (this.msg.channel instanceof PrivateChannel &&
            this.reactions.previousPage)
        )
          await this.msg.channel.addMessageReaction(
            this.msg.id,
            this.reactions.previousPage.name +
              ':' +
              this.reactions.previousPage.id
          )
        else await this.msg.channel.addMessageReaction(this.msg.id, '◀')
        if (
          (this.msg.channel instanceof GuildChannel &&
            this.reactions.nextPage &&
            this.msg.channel
              .permissionsOf(this.client.user.id)
              .has('externalEmojis')) ||
          (this.msg.channel instanceof PrivateChannel &&
            this.reactions.nextPage)
        )
          await this.msg.channel.addMessageReaction(
            this.msg.id,
            this.reactions.nextPage.name + ':' + this.reactions.nextPage.id
          )
        else await this.msg.channel.addMessageReaction(this.msg.id, '▶')
        if (
          (this.msg.channel instanceof GuildChannel &&
            this.reactions.lastPage &&
            this.msg.channel
              .permissionsOf(this.client.user.id)
              .has('externalEmojis')) ||
          (this.msg.channel instanceof PrivateChannel &&
            this.reactions.lastPage)
        )
          await this.msg.channel.addMessageReaction(
            this.msg.id,
            this.reactions.lastPage.name + ':' + this.reactions.lastPage.id
          )
        else await this.msg.channel.addMessageReaction(this.msg.id, '⏭️')
        if (
          (this.msg.channel instanceof GuildChannel &&
            this.reactions.jumpPage &&
            this.msg.channel
              .permissionsOf(this.client.user.id)
              .has('externalEmojis')) ||
          (this.msg.channel instanceof PrivateChannel &&
            this.reactions.jumpPage)
        )
          await this.msg.channel.addMessageReaction(
            this.msg.id,
            this.reactions.jumpPage.name + ':' + this.reactions.jumpPage.id
          )
        else await this.msg.channel.addMessageReaction(this.msg.id, '↗')
        // If less than 5 pages only shows back and next reactions
      } else {
        if (
          (this.msg.channel instanceof GuildChannel &&
            this.reactions.previousPage &&
            this.msg.channel
              .permissionsOf(this.client.user.id)
              .has('externalEmojis')) ||
          (this.msg.channel instanceof PrivateChannel &&
            this.reactions.previousPage)
        )
          await this.msg.channel.addMessageReaction(
            this.msg.id,
            this.reactions.previousPage.name +
              ':' +
              this.reactions.previousPage.id
          )
        else await this.msg.channel.addMessageReaction(this.msg.id, '◀')
        if (
          (this.msg.channel instanceof GuildChannel &&
            this.reactions.nextPage &&
            this.msg.channel
              .permissionsOf(this.client.user.id)
              .has('externalEmojis')) ||
          (this.msg.channel instanceof PrivateChannel &&
            this.reactions.nextPage)
        )
          await this.msg.channel.addMessageReaction(
            this.msg.id,
            this.reactions.nextPage.name + ':' + this.reactions.nextPage.id
          )
        else await this.msg.channel.addMessageReaction(this.msg.id, '▶')
      }
    }
  }
}
export default Paginator
