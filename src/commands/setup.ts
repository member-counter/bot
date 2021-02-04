import MemberCounterCommand from '../typings/MemberCounterCommand'
import CountService from '../services/CountService'
import { GuildChannel, PrivateChannel, TextChannel } from 'eris'
import GuildService from '../services/GuildService'
import Bot from '../bot'
import emojis from '../utils/emojis'
const setup: MemberCounterCommand = {
  aliases: ['setup'],
  denyDm: true,
  onlyAdmin: true,
  run: async ({ client, message, languagePack }) => {
    const { channel, content } = message
    const { loading, check_mark } = emojis
    let channelsToCreate = [
      {
        countTemplate: languagePack.commands.setup.memberCounter.countTemplate,
        creating: languagePack.commands.setup.memberCounter.creatingmemberCounter.replace(
          /{LOADING}/g,
          (message.channel instanceof GuildChannel &&
            message.channel
              .permissionsOf(message.channel.client.user.id)
              .has('externalEmojis')) ||
            message.channel instanceof PrivateChannel
            ? (message.channel instanceof GuildChannel &&
                message.channel
                  .permissionsOf(message.channel.client.user.id)
                  .has('externalEmojis')) ||
              message.channel instanceof PrivateChannel
              ? loading.string
              : loading.fallbackUnicodeEmoji
            : loading.fallbackUnicodeEmoji
        ),
        created: languagePack.commands.setup.memberCounter.createdmemberCounter.replace(
          /{CHECK_MARK}/g,
          (message.channel instanceof GuildChannel &&
            message.channel
              .permissionsOf(message.channel.client.user.id)
              .has('externalEmojis')) ||
            message.channel instanceof PrivateChannel
            ? check_mark.string
            : check_mark.fallbackUnicodeEmoji
        )
      },
      {
        countTemplate:
          languagePack.commands.setup.boostingCounter.countTemplate,
        creating: languagePack.commands.setup.boostingCounter.creatingboostingCounter.replace(
          /{LOADING}/g,
          (message.channel instanceof GuildChannel &&
            message.channel
              .permissionsOf(message.channel.client.user.id)
              .has('externalEmojis')) ||
            message.channel instanceof PrivateChannel
            ? loading.string
            : loading.fallbackUnicodeEmoji
        ),
        created: languagePack.commands.setup.boostingCounter.createdboostingCounter.replace(
          /{CHECK_MARK}/g,
          (message.channel instanceof GuildChannel &&
            message.channel
              .permissionsOf(message.channel.client.user.id)
              .has('externalEmojis')) ||
            message.channel instanceof PrivateChannel
            ? check_mark.string
            : check_mark.fallbackUnicodeEmoji
        )
      },
      {
        countTemplate: languagePack.commands.setup.rolesCounter.countTemplate,
        creating: languagePack.commands.setup.rolesCounter.creatingrolesCounter.replace(
          /{LOADING}/g,
          (message.channel instanceof GuildChannel &&
            message.channel
              .permissionsOf(message.channel.client.user.id)
              .has('externalEmojis')) ||
            message.channel instanceof PrivateChannel
            ? loading.string
            : loading.fallbackUnicodeEmoji
        ),
        created: languagePack.commands.setup.rolesCounter.createdrolesCounter.replace(
          /{CHECK_MARK}/g,
          (message.channel instanceof GuildChannel &&
            message.channel
              .permissionsOf(message.channel.client.user.id)
              .has('externalEmojis')) ||
            message.channel instanceof PrivateChannel
            ? check_mark.string
            : check_mark.fallbackUnicodeEmoji
        )
      },
      {
        countTemplate:
          languagePack.commands.setup.channelsCounter.countTemplate,
        creating: languagePack.commands.setup.channelsCounter.creatingchannelsCounter.replace(
          /{LOADING}/g,
          (message.channel instanceof GuildChannel &&
            message.channel
              .permissionsOf(message.channel.client.user.id)
              .has('externalEmojis')) ||
            message.channel instanceof PrivateChannel
            ? loading.string
            : loading.fallbackUnicodeEmoji
        ),
        created: languagePack.commands.setup.channelsCounter.createdchannelsCounter.replace(
          /{CHECK_MARK}/g,
          (message.channel instanceof GuildChannel &&
            message.channel
              .permissionsOf(message.channel.client.user.id)
              .has('externalEmojis')) ||
            message.channel instanceof PrivateChannel
            ? check_mark.string
            : check_mark.fallbackUnicodeEmoji
        )
      }
    ]

    if (channel instanceof GuildChannel) {
      const { client } = Bot
      const { guild } = channel
      const guildService = await GuildService.init(guild.id)
      const countService = await CountService.init(guild)
      let str = '_ _\n'
      const categoryName =
        languagePack.commands.setup.categoryName.countTemplate
      const msg = await channel.createMessage(
        languagePack.commands.setup.creatingCounts
      )
      str += languagePack.commands.setup.categoryName.creatingCategory.replace(
        /{LOADING}/g,
        (message.channel instanceof GuildChannel &&
          message.channel
            .permissionsOf(message.channel.client.user.id)
            .has('externalEmojis')) ||
          message.channel instanceof PrivateChannel
          ? loading.string
          : loading.fallbackUnicodeEmoji
      )
      const category = await guild.createChannel(categoryName, 4, {
        permissionOverwrites: [
          {
            id: client.user.id,
            type: 'member',
            allow: 0x00100000 | 0x00000400,
            deny: 0
          },
          {
            id: guild.id,
            type: 'role',
            allow: 0,
            deny: 0x00100000
          }
        ]
      })
      msg.edit(str)
      str = str.replace(
        languagePack.commands.setup.categoryName.creatingCategory.replace(
          /{LOADING}/g,
          (message.channel instanceof GuildChannel &&
            message.channel
              .permissionsOf(message.channel.client.user.id)
              .has('externalEmojis')) ||
            message.channel instanceof PrivateChannel
            ? loading.string
            : loading.fallbackUnicodeEmoji
        ),
        languagePack.commands.setup.categoryName.createdCategory.replace(
          /{CHECK_MARK}/g,
          (message.channel instanceof GuildChannel &&
            message.channel
              .permissionsOf(message.channel.client.user.id)
              .has('externalEmojis')) ||
            message.channel instanceof PrivateChannel
            ? check_mark.string
            : check_mark.fallbackUnicodeEmoji
        )
      )
      const categoryID = category.id
      channelsToCreate.forEach(async content => {
        str += content.creating
        msg.edit(str)
        guild
          .createChannel(
            await countService.processContent(content.countTemplate),
            2,
            {
              permissionOverwrites: [
                {
                  id: client.user.id,
                  type: 'member',
                  allow: 0x00100000 | 0x00000400,
                  deny: 0
                },
                {
                  id: guild.id,
                  type: 'role',
                  allow: 0,
                  deny: 0x00100000
                }
              ],
              parentID: categoryID
            }
          )
          .then(channel => {
            str = str.replace(content.creating, content.created)
            msg.edit(str)
            guildService.setCounter(channel.id, content.countTemplate)
          })
          .catch(guildService.log)
      })
      str += languagePack.commands.setup.createdCounts
      msg.edit(str)
    }
  }
}

export default [setup]
