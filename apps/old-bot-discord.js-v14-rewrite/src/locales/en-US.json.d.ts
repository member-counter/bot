interface EnUS {
  langCode: 'en-US',
  langName: 'English, US',
  interaction: {
    commandHandler: {
      error: {
        title: 'ERROR!',
        description: 'Something went wrong, please, try again later\n\nError ID: {{ERROR_ID}}'
      }
    }
  },
  commands: {
    invite: {
      definition: {name: 'invite', description: 'Gives you an invite link to add the bot'},
      description: 'Beep boop! Your invite link is ready:\n{{INVITE_URL}}',
      addToServer: 'Add to server',
      addToServerAgain: 'Add to this server again',
      joinSupportServer: 'Join support server'
    },
    settings: {
      definition: {
        name: 'settings',
        description: 'Configure and see different aspects about the bot in this server'
      },
      buttons: {
        deleteSettings: 'Restore settings',
        deleteSettingsConfirm: 'Are you sure? All the data related to this server will be restored to its defaults (except block and premium status)',
        deleteSettingsDone: 'All the data has been restored'
      },
      subcommands: {
        see: {
          title: 'Settings for {{SERVER_NAME}} ({{SERVER_ID}})',
          language: {
            name: 'Language',
            fromServerLanguage: '{{CURRENT_DISCORD_LANGUAGE}} (Server language)'
          },
          locale: {
            name: 'Locale (Formatting for numbers, date, etc)',
            fromAvailableLanguages: '{{ LANG_NAME }} [{{ LANG_CODE }}]',
            fromSettingsLanguage: '{{CURRENT_SETTINGS_LANGUAGE}} (Settings language)',
            custom: '{{CURRENT}} (Custom)'
          },
          shortNumber: {name: 'Short Number (Compact notation)'},
          customDigits: {name: 'Custom Numbers (Digits)'}
        },
        set: {
          noChangesMade: 'No changes were made',
          changesMade: 'The following changes were made',
          options: {
            customDigits: {
              success: 'Digits customized.',
              resetSuccess: 'Numbers restored to the default ones.'
            }
          }
        },
        classicPremiumUpgrade: {
          success: 'Done! The next step is invite the premium bot:\n{{BOT_LINK}}',
          errorCannotUpgrade: 'You can\'t upgrade the server because it already has premium.',
          noServerUpgradesAvailable: 'You can\'t do more server upgrades because you don\'t have more server upgrades available'
        },
        logs: {
          title: {
            hasLogs: 'Latest logs for {{SERVER_NAME}} ({{SERVER_ID}})',
            noLogs: 'No logs for {{SERVER_NAME}} ({{SERVER_ID}})'
          }
        }
      }
    },
    setup: {
      definition: {name: 'setup', description: 'Used to create some basic counter channels'},
      status: {
        creatingCounts: 'Creating counters...',
        createdCounts: 'Complete',
        creatingCategory: '{LOADING} Creating category',
        createdCategory: '{CHECK_MARK} Category created'
      },
      subcommands: {
        server: {name: 'server', description: 'Used to setup server related counters'},
        youtube: {
          name: 'youtube',
          description: 'Used to setup server related counters',
          options: {
            'channel-url': {description: 'Please provide the following input: YouTube channel link'}
          }
        },
        twitch: {
          name: 'twitch',
          description: 'Used to setup twitch counters',
          options: {
            'channel-name': {description: 'Please provide the following input: Twitch channel name'}
          }
        },
        twitter: {
          name: 'twitter',
          description: 'Used to setup twitter counters',
          options: {
            'account-name': {description: 'Please provide the following input: Twitter account name'}
          }
        }
      },
      counterTemplates: {
        default: {
          categoryName: '📊 Server Stats 📊',
          counters: [
            {
              name: 'onlineMembers',
              template: 'Online: {onlineMembers}',
              statusCreating: '{LOADING} Creating online counter',
              statusCreated: '{CHECK_MARK} Online counter created'
            },
            {
              name: 'members',
              template: 'Members: {members}',
              statusCreating: '{LOADING} Creating member counter',
              statusCreated: '{CHECK_MARK} Members counter created'
            },
            {
              name: 'nitroBoosters',
              template: 'Boosters: {nitroBoosters}',
              statusCreating: '{LOADING} Creating booster counter',
              statusCreated: '{CHECK_MARK} Booster counter created'
            },
            {
              name: 'roles',
              template: 'Roles: {roles}',
              statusCreating: '{LOADING} Creating roles counter',
              statusCreated: '{CHECK_MARK} Roles counter created'
            },
            {
              name: 'channels',
              template: 'Channels: {channels}',
              statusCreating: '{LOADING} Creating channels counter',
              statusCreated: '{CHECK_MARK} Channels counter created'
            }
          ]
        },
        twitch: {
          categoryName: '📊 {twitchChannelName:{RESOURCE}} Twitch Stats 📊',
          counters: [
            {
              name: 'twitchFollowers',
              template: '{twitchFollowers:{RESOURCE}} Followers',
              statusCreating: '{LOADING} Creating follower counter',
              statusCreated: '{CHECK_MARK} Follower counter created'
            },
            {
              name: 'twitchViews',
              template: '{twitchViews:{RESOURCE}} Views',
              statusCreating: '{LOADING} Creating views counter',
              statusCreated: '{CHECK_MARK} Views counter created'
            }
          ]
        },
        youtube: {
          categoryName: '📊 {youtubeChannelName:{RESOURCE}} Youtube Stats 📊',
          counters: [
            {
              name: 'youtubeSubscribers',
              template: '{youtubeSubscribers:{RESOURCE}} Subscribers',
              statusCreating: '{LOADING} Creating subscriber counter',
              statusCreated: '{CHECK_MARK} Subscriber counter created'
            },
            {
              name: 'youtubeVideos',
              template: '{youtubeVideos:{RESOURCE}} Videos',
              statusCreating: '{LOADING} Creating video counter',
              statusCreated: '{CHECK_MARK} Video counter created'
            },
            {
              name: 'youtubeViews',
              template: '{youtubeViews:{RESOURCE}} Views',
              statusCreating: '{LOADING} Creating views counter',
              statusCreated: '{CHECK_MARK} Views counter created'
            }
          ]
        },
        twitter: {
          categoryName: '📊 {twitterName:{RESOURCE}} Twitter Stats 📊',
          counters: [
            {
              name: 'twitterFollowers',
              template: '{twitterFollowers:{RESOURCE}} Followers',
              statusCreating: '{LOADING} Creating follower counter',
              statusCreated: '{CHECK_MARK} Follower counter created'
            }
          ]
        }
      }
    },
    'check-permissions': {
      definition: {
        name: 'check-permissions',
        description: 'Checks if the bot has the correct permissions to work correctly.'
      },
      title: 'Check permissions',
      optionalText: '(Optional)',
      adminWarning: '**This bot has administrator permission, please toggle off the administrator permission and setup the right permissions**',
      footer: 'If you need to fix permissions problems, try inviting the bot again:',
      details: {
        ManageChannels: {
          name: 'Manage channels',
          description: 'Used to update the name/description of the channels to update the counters',
          optional: false
        },
        ViewChannel: {
          name: 'View channels',
          description: 'Used to update the name/description of the channels to update the counters, also used to receive commands',
          optional: false
        },
        Connect: {
          name: 'Connect',
          description: 'Used to update the name/description of the channels to update the counters',
          optional: false
        },
        ReadMessageHistory: {
          name: 'Read message history',
          description: 'Used to update counters in messages/embeds',
          optional: false
        },
        SendMessages: {
          name: 'Send messages',
          description: 'Used to reply to commands',
          optional: false
        },
        EmbedLinks: {name: 'Embed links', description: 'Used to reply to commands', optional: false},
        AddReactions: {
          name: 'Add reactions',
          description: 'Used to add reactions in commands to interact with it',
          optional: false
        },
        ManageMessages: {
          name: 'Manage messages',
          description: 'Used to remove reactions in a command',
          optional: true
        },
        ManageRoles: {
          name: 'Manage roles',
          description: 'Used by the setup command and to update channel permissions when you add a Premium bot',
          optional: false
        },
        BanMembers: {
          name: 'Ban members',
          description: 'Used to display the amount of banned members in the `{bannedMembers}` counter',
          optional: true
        }
      }
    },
    'lock-channel': {
      definition: {
        name: 'lock-channel',
        description: 'You can use this commands to show a lock pad (🔒) instead of a speaker (🔊) in voice channels.'
      },
      success: 'Done! Now, **for non admin users**, the channel will be displayed with a 🔒',
      errorNoPerms: 'I can\'t edit the channel {CHANNEL} due to lack of permissions'
    },
    base64: {definition: {name: 'base64', description: 'A base64 utility command'}},
    premium: {
      definition: {name: 'premium', description: 'Get information about Member Counter Premium.'},
      embedReply: {
        title: 'Member Counter Premium',
        description: '[Get the premium bot]({{GET_PREMIUM_BOT_URL}}) and enjoy:',
        fields: [
          {
            name: '**✅ ALL the counters**',
            value: 'Get access to **all** the counters that exists in the bot, like `{twitchFollowers}` or `{youtubeSubscribers}`',
            inline: false
          },
          {
            name: '**✅ More accurate**',
            value: 'Get more accurate counts in all members related counters',
            inline: false
          },
          {
            name: '**✅ Unlimited servers**',
            value: 'Pay only for the members and servers you have. For €5 EUR per 50,000 members and 5 servers, quarterly',
            inline: false
          },
          {
            name: '**✅ Custom bot**',
            value: 'Use your own bot account, with the profile picture and username of your choice',
            inline: false
          },
          {
            name: '**✅ Easy to setup**',
            value: 'In a few clicks, you can create your own Member Counter bot, and we will take care of updating it. Guide with screenshots included! Isn\'t this easier than self-hosting?',
            inline: false
          }
        ]
      }
    },
    profile: {
      definition: {
        name: 'profile',
        description: 'Shows related information between you and this bot.'
      },
      badges: 'Badges',
      credits: 'Credits',
      serverUpgradesAvailable: 'Server upgrades left',
      removeDataConfirmation: 'If you click the {{DELETE_DATA}} button. Please type exactly this text if you want to delete all your data: ```{{CONFIRMATION_STRING}}```\n:warning: **This action will remove all your data, your badges, server upgrades and credits will be lost forever, invoices will be kept for legal reasons, are you sure you want to continue? (Ignore or type \'{{CANCEL_STRING}}\' to cancel)**',
      cancelString: 'cancel',
      removeDataConfirmationString: 'I want to delete all of my data',
      removeDataSuccess: 'Your data has been removed successfully',
      removeDataCanceled: 'Canceled deleting your data',
      userNotFound: 'User not found in the DB',
      invalidTextInputProvided: 'Please try again and provide a valid text input either `{{CANCEL_STRING}}` or `{{CONFIRMATION_STRING}}`',
      buttons: {deleteData: {label: 'Delete data'}}
    },
    info: {
      definition: {name: 'info', description: 'List of useful links.'},
      embedReply: {
        description: '[Add me to your server]({{BOT_INVITE_URL}})\n[Website]({{WEBSITE}})\n[Get premium]({{GET_PREMIUM_BOT_URL}})\n[Support server]({{BOT_SERVER_URL}})\n[GitHub Repository](https://github.com/eduardozgz/member-counter-bot)'
      }
    },
    guide: {
      definition: {
        name: 'guide',
        description: 'Shows you a guide of how to use the bot and a list of available counters.'
      },
      pagesText: 'Page {CURRENT_PAGE}/{TOTAL_PAGES}',
      explanation: '**Thanks for adding Member Counter to your server!**\n__**Create/edit a counter**__\nFor this example we are gonna use `{members}`, which counts the total amount of members in your discord server, but you will find out more counters in the next pages\nYou can place that counter in one of the following places:\n\n- In a **voice** channel **name**\n- In a **category** channel **name**\n- In a **text** channel **topic**\n- In a **news** channel **topic**\n\nNow create a new channel, edit it, and write `{members}` in the name or topic, and click \'save changes\'\n\nYou can also add multiple counters in one name/topic, and combine them with your own content, here is a example:\n```\n{onlineMembers}/{members} Online Members, {youtubeSubscribers:https://www.youtube.com/user/enyay} Subscribers!\n{onlineMembersWithRole:614777997291028519,614816383053856769} Admins and mods are online!\n```\n\n> If you reach the character limit when you are editing a name/topic, please check `help editChannel`\n> You can see the current counter configurations with `seeSettings`, this is useful to add more counters without disabling the previous ones\n\n__**Remove a counter**__\nEdit the channel and write {disable} in the name/topic, Member Counter will replace it to a \\✅, that means that you removed all the counters of that channel successfully\n\nYou can also delete the channel directly',
      countersHeader: '__**Counters**__\n> You should enable the developer mode in Discord (User Settings \\> Appearance \\> Advanced \\> Developer Mode)\n> To get an ID, right click in a channel/role and click "Copy ID"\n\n> Those counters with a plus sign (\\+) are premium counters, get more info in `premium`\n\n> If you wanna change the number formatting in a counter independently of the server settings, visit this [page](https://member-counter.eduardozgz.com/utils/overwrite-settings), or do it manually by following this [instructions](https://github.com/eduardozgz/member-counter-bot/issues/98)\n\n',
      footerText: 'Please read the first page of guide to learn how to setup this counter',
      counters: {
        members: {
          name: 'members',
          description: 'Members in your server',
          detailedDescription: 'Counts how many members has a server',
          usage: ['{members}'],
          example: ['{members} Members']
        },
        approximatedOnlineMembers: {
          name: 'approximatedOnlineMembers',
          description: 'Approximated online members in your server',
          detailedDescription: 'Counts approximately how many members are online in the server',
          usage: ['{approximatedOnlineMembers}'],
          example: ['{approximatedOnlineMembers} Online']
        },
        onlineMembers: {
          name: 'onlineMembers',
          description: 'Online members in your server',
          detailedDescription: 'Counts how many members are online in the server',
          usage: ['{onlineMembers}'],
          example: ['{onlineMembers} Online']
        },
        offlineMembers: {
          name: 'offlineMembers',
          description: 'Offline members in your server',
          detailedDescription: 'Counts how many members are offline in the server',
          usage: ['{onlineMembers}'],
          example: ['{onlineMembers} Offline']
        },
        users: {
          name: 'users',
          description: 'Users in your server (excludes bot)',
          detailedDescription: 'Counts how many users (excluding bot accounts) are in the server',
          usage: ['{users}'],
          example: ['{users} Users']
        },
        onlineUsers: {
          name: 'onlineUsers',
          description: 'Online users in your server (excludes bot)',
          detailedDescription: 'Counts how many users (excluding bot accounts) are online in the server',
          usage: ['{users}'],
          example: ['{users} Online users']
        },
        offlineUsers: {
          name: 'offlineUsers',
          description: 'Offline users in your server (excludes bot)',
          detailedDescription: 'Counts how many users (excluding bot accounts) are offline in the server',
          usage: ['{users}'],
          example: ['{users} Offline']
        },
        bots: {
          name: 'bots',
          description: 'Bots in your server (excludes normal users)',
          detailedDescription: 'Counts how many bots (excluding normal accounts) are in the server',
          usage: ['{bots}'],
          example: ['{bots} Bots']
        },
        onlineBots: {
          name: 'onlineBots',
          description: 'Online bots in your server (excludes normal users)',
          detailedDescription: 'Counts how many bots (excluding normal accounts) are online in the server',
          usage: ['{bots}'],
          example: ['{bots} Online bots']
        },
        offlineBots: {
          name: 'offlineBots',
          description: 'Offline bots in your server (excludes normal users)',
          detailedDescription: 'Counts how many bots (excluding normal accounts) are offline in the server',
          usage: ['{bots}'],
          example: ['{bots} Offline bots']
        },
        roles: {
          name: 'roles',
          description: 'Roles in your server',
          detailedDescription: 'Counts how many roles are in the server',
          usage: ['{roles}'],
          example: ['{roles} Roles']
        },
        channels: {
          name: 'channels',
          description: 'Channels in your server (excludes categories) or under a category',
          detailedDescription: 'Counts how many channels (excluding category channels) are in the server, if you specify one or more category IDs after the `:`, separated by commas, only the channels under those specified categories will be counted',
          usage: ['{channels}', '{channels:categoryID1,categoryID2}'],
          example: [
            '{channels} Channels',
            '{channels:6509281904766437,5823659271648290} Tickets open'
          ]
        },
        membersWithRole: {
          name: 'membersWithRole:role1ID,role2ID',
          description: 'Members with a role or roles',
          detailedDescription: 'Counts how many members have a role or roles, write the roles IDs you wanna count after the `:`, and separate the IDs with commas',
          usage: ['{membersWithRole:role1ID,role2ID}'],
          example: ['{membersWithRole:6509281904766437,5823659271648290} Admins and mods']
        },
        onlineMembersWithRole: {
          name: 'onlineMembersWithRole:role1ID,role2ID',
          description: 'Online members with a role or roles',
          detailedDescription: 'Counts how many members with a role or roles are online, write the roles IDs you wanna count after the `:`, and separate the IDs with commas',
          usage: ['{onlineMembersWithRole:role1ID,role2ID}'],
          example: [
            '{onlineMembersWithRole:6509281904766437,5823659271648290} Online admins and mods',
            '{onlineMembersWithRole:5823659271648290} of {membersWithRole:5823659271648290} Admins are online'
          ]
        },
        offlineMembersWithRole: {
          name: 'offlineMembersWithRole:role1ID,role2ID',
          description: 'Offline members with a role or roles',
          detailedDescription: 'Counts how many members with a role or roles are offline, write the roles IDs you wanna count after the `:`, and separate the IDs with commas',
          usage: ['{offlineMembersWithRole:role1ID,role2ID}'],
          example: [
            '{offlineMembersWithRole:6509281904766437,5823659271648290} Offline admins and mods',
            '{offlineMembersWithRole:5823659271648290} of {membersWithRole:5823659271648290} Admins are offline'
          ]
        },
        connectedMembers: {
          name: 'connectedMembers:channel1ID,channel2ID',
          description: 'Connected members to voice channels',
          detailedDescription: 'Counts how many members are connected to all the voice channels or to the specified ones, write the channel IDs you wanna filter after the `:`, and separate the IDs with commas',
          usage: ['{connectedMembers}', '{connectedMembers:channel1ID,channel2ID}'],
          example: [
            '{connectedMembers} Talking',
            '{connectedMembers:5823659271648290} talking in the lounge'
          ]
        },
        bannedMembers: {
          name: 'bannedMembers',
          description: 'Amount of banned members in your server',
          detailedDescription: 'Counts how many members are banned, the bot must have ban permissions to get this count',
          usage: ['{bannedMembers}'],
          example: ['{bannedMembers} Banned', '{bannedMembers} have been hit with the ban hammer']
        },
        membersPlaying: {
          name: 'membersPlaying:game name',
          description: 'Amount of members playing a game',
          detailedDescription: 'Counts how many members are playing a game, you can add multiple games by separating them with a comma',
          usage: ['{membersPlaying:game name}', '{membersPlaying:game name, game name 2}'],
          example: [
            '{membersPlaying:Minecraft} Mining and crafting',
            '{membersPlaying: euro truck simulator 2, american truck simulator} Trucking'
          ]
        },
        'nitro-boosters': {
          name: 'nitro-boosters',
          description: 'Counts the total amount of members boosting this server',
          detailedDescription: 'Counts the total amount of members boosting this server',
          usage: ['{nitro-boosters}'],
          example: ['Awesome boosters: {nitro-boosters}']
        },
        youtubeSubscribers: {
          name: 'youtubeSubscribers:channelUrl',
          description: 'Amount of subscribers of a YouTube channel',
          detailedDescription: 'Counts how many subscribers has a YouTube channel, replace `channelUrl` with the desired channel url',
          usage: ['{youtubeSubscribers:channelUrl}'],
          example: ['Subscribers: {youtubeSubscribers:https://www.youtube.com/user/enyay}']
        },
        youtubeViews: {
          name: 'youtubeViews:channelUrl',
          description: 'Amount of views of a YouTube channel',
          detailedDescription: 'Counts how many views has a YouTube channel, replace `channelUrl` with the desired channel url',
          usage: ['{youtubeViews:channelUrl}'],
          example: ['Views: {youtubeViews:https://www.youtube.com/user/enyay}']
        },
        youtubeVideos: {
          name: 'youtubeVideos:channelUrl',
          description: 'Amount of videos of a YouTube channel',
          detailedDescription: 'Counts how many videos has a YouTube channel, replace `channelUrl` with the desired channel url',
          usage: ['{youtubeVideos:channelUrl}'],
          example: ['Videos: {youtubeVideos:https://www.youtube.com/user/enyay}']
        },
        youtubeChannelName: {
          name: 'youtubeChannelName:channelUrl',
          description: 'Displays the name of a YouTube channel',
          detailedDescription: 'Displays the name of a YouTube channel, replace `channelUrl` with the desired channel url',
          usage: ['{youtubeChannelName:channelUrl}'],
          example: ['{youtubeChannelName:https://www.youtube.com/user/enyay}']
        },
        twitchFollowers: {
          name: 'twitchFollowers:nickname',
          description: 'Amount of followers of a Twitch channel',
          detailedDescription: 'Counts how many followers has a Twitch channel, replace `nickname` with the desired channel name',
          usage: ['{twitchFollowers:nickname}'],
          example: ['{twitchFollowers:ninja} Followers']
        },
        twitchViews: {
          name: 'twitchViews:nickname',
          description: 'Amount of views of a Twitch channel',
          detailedDescription: 'Counts how many views has a Twitch channel, replace `nickname` with the desired channel name',
          usage: ['{twitchViews:nickname}'],
          example: ['{twitchViews:ninja} Views']
        },
        twitchChannelName: {
          name: 'twitchChannelName:nickname',
          description: 'Displays the name of a Twitch channel',
          detailedDescription: 'Displays the name of a Twitch channel, replace `nickname` with the desired channel name',
          usage: ['{twitchChannelName:nickname}'],
          example: ['{twitchChannelName:ninja}']
        },
        memeratorMemes: {
          name: 'memeratorMemes:username',
          description: 'Displays a [Memerator](https://memerator.me) user\'s meme count',
          detailedDescription: 'Displays a [Memerator](https://memerator.me) user\'s meme count, replace `username` with the desired profile name',
          usage: ['{memeratorMemes:username}'],
          example: ['Memes: {memeratorMemes:eduardozgz}']
        },
        memeratorFollowers: {
          name: 'memeratorFollowers:username',
          description: 'Displays a [Memerator](https://memerator.me) user\'s follower count',
          detailedDescription: 'Displays a [Memerator](https://memerator.me) user\'s follower count, replace `username` with the desired profile name',
          usage: ['{memeratorFollowers:username}'],
          example: ['Followers: {memeratorFollowers:eduardozgz}']
        },
        twitterFollowers: {
          name: 'twitterFollowers:username',
          description: 'Amount of followers of a Twitter user',
          detailedDescription: 'Counts how many followers has a Twitter user, replace `username` with the desired profile name',
          usage: ['{twitterFollowers:username}'],
          example: ['Followers: {twitterFollowers:0xEduardozgz}']
        },
        redditMembers: {
          name: 'redditMembers:subreddit',
          description: 'Counts the amount of members of a subreddit',
          detailedDescription: 'Counts the amount of members of a subreddit, replace `subreddit` with the desired subreddit',
          usage: ['{redditMembers:subreddit}'],
          example: ['Redditors: {redditMembers:science}']
        },
        redditMembersOnline: {
          name: 'redditMembersOnline:subreddit',
          description: 'Counts the amount of online members of a subreddit',
          detailedDescription: 'Counts the amount of members of a subreddit, replace `subreddit` with the desired subreddit',
          usage: ['{redditMembersOnline:subreddit}'],
          example: ['Online Redditors: {redditMembersOnline:science}']
        },
        redditTitle: {
          name: 'redditTitle:subreddit',
          description: 'Displays the title of a subreddit',
          detailedDescription: 'Displays the title of a subreddit, replace `subreddit` with the desired subreddit',
          usage: ['{redditMembersOnline:subreddit}'],
          example: ['{redditMembersOnline:science}']
        },
        instagramFollowers: {
          name: 'instagramFollowers:username',
          description: 'Counts the amount of followers in an Instagram account',
          detailedDescription: 'Counts the amount of followers in an Instagram account, replace `username` with the actual Instagram username',
          usage: ['{instagramFollowers:username}'],
          example: ['Followers: {instagramFollowers:eduardozgz}']
        },
        countdown: {
          name: 'countdown:targetDate:format',
          description: 'Shows a countdown that will decrease to the specified target date',
          detailedDescription: 'Shows a countdown that will decrease to the specified target date, you can easily [generate this counter here](https://member-counter.eduardozgz.com/utils/countdown) or manually creating it by replacing `targetDate` with the target date in a UNIX timestamp, and optionally `format` it with a custom format: use `%d` to show the days left, `%h` to show the hours left, `%m` to show the minutes left and `%s` to show the seconds left',
          usage: ['{countdown:targetDate:format}'],
          example: ['New year: {countdown:1640991600:%d days, %h hours, %m minutes}']
        },
        game: {
          name: 'game:gameId:address',
          description: 'Online players in a game server (Minecraft, Counter Strike, Rust, Ark, Team Fortress 2, GMOD, etc)',
          detailedDescription: 'Counts how many online players are in a game server (like Minecraft, Counter Strike, Rust, Ark, Team Fortress 2, GMOD, etc), replace `gameId` by one of the listed [here](https://github.com/gamedig/node-gamedig/#games-list) and `address` by the actual server address',
          usage: ['{game:gameId:address}'],
          example: ['{game:minecraft:mc.hypixel.net} Mining and crafting']
        },
        clock: {
          name: 'clock:timeZone',
          description: 'Shows a clock with the time of the specified timezone',
          detailedDescription: 'Shows a clock with the time of the specified timezone, you can easily [generate this counter here](https://member-counter.eduardozgz.com/utils/clock) or replace `timeZone` with a valid IANA timezone',
          usage: ['{clock:timeZone}'],
          example: ['Spain: {clock:Europe/Madrid}']
        },
        http: {
          name: 'http:options',
          description: 'Shows the result of a http request',
          detailedDescription: 'Shows the result returned by a http `GET` request. You can setup the `options` [here](https://member-counter.eduardozgz.com/utils/http), or create it manually: `options` is a JSON object encoded in base64 (you can use base64 command to achieve this), this object can have the following keys: `url`: A string; with the url of the resource, `parseNumber`: A boolean; if the result is a valid number, it will be parsed and customized according to your server\'s settings, `dataPath`: A string; if the response is a JSON object, you must specify the path to a key with a value that must be a string or number, the syntax of this path is similar to the syntax that JS uses to access properties and array items, `lifetime`: A number; specifies in seconds for how long the returned response will be cached and used, the default is 1 hour',
          usage: ['{http:options}'],
          example: [
            'Last subscriber: {http:eyJ1cmwiOiJodHRwczovL215YXBpLmNvbS92MS9zdWJzY3JpYmVycz9nZXQ9bGFzdCIsImRhdGFQYXRoIjoidXNlci5uYW1lIn0=}'
          ]
        },
        replace: {
          name: 'replace:text:oldValue;newValue',
          description: 'Replaces portions of the given text with the given values',
          detailedDescription: 'Replaces portions of the given text with the given values, this counter is useful alongside the `{http}` counter to for example, read data from an API, and depending on the returned response, translate the response to something more human friendly.\n`text` should be the original text or a counter like `{http}`, `oldValue` the value to search and `newValue` the value that will replace `oldValue`, you can replace multiple values by separating them with a comma as shown below in the examples.',
          usage: [
            '{replace:text:oldValue;newValue}',
            '{replace:text:oldValue;newValue,oldValue2;newValue2}'
          ],
          example: [
            '{replace:Hello\\, world!:Hello;Goodbye,world;discord}',
            'Weather in Madrid: {replace:{http:eyJ1cmwiOiJ3ZWF0aGVyLmFwaS9tYWRyaWQifQ==}:storm;🌩,sunny;☀,raining;🌧}'
          ]
        },
        escape: {
          name: 'escape:stringToEscape',
          description: 'Escapes common delimiters used by Member Counter',
          detailedDescription: 'Escapes automatically all the delimiters used by Member Counter when processing a counter. Like `:`,`;` or `,`. You may need this if you want to pass arguments with the mentioned delimiters without getting them parsed. This is specially useful when you can\'t control well the content of the string like in the `{http}` counter',
          usage: ['{escape:stringToEscape}'],
          example: ['{escape:Hello, world!}']
        },
        static: {
          name: 'static:data',
          description: 'Displays the given `data`',
          detailedDescription: 'Displays the given `data` with custom formatting based on the server settings if it\'s a number, text is also accepted',
          usage: ['{static:data}'],
          example: ['{static:420}', '{static:Hello world!}']
        },
        sum: {
          name: 'sum:value1,value2,more values',
          description: 'Sum of the specified values',
          detailedDescription: 'Sum of the specified values, done from the left to the right',
          usage: ['{sum:value1,value2,more values}'],
          example: ['2 + 2 = {sum:2,2}']
        },
        subtract: {
          name: 'subtract:value1,value2,more values',
          description: 'Subtracts the specified values',
          detailedDescription: 'Subtracts the specified values, done from the left to the right',
          usage: ['{subtract:value1,value2,more values}'],
          example: ['2 - 2 = {subtract:2,2}']
        },
        multiply: {
          name: 'multiply:value1,value2,more values',
          description: 'Multiplies the specified values',
          detailedDescription: 'Multiplies the specified values, done from the left to the right',
          usage: ['{multiply:value1,value2,more values}'],
          example: ['2 * 2 = {multiply:2,2}']
        },
        divide: {
          name: 'divide:value1,value2,more values',
          description: 'Divides the specified values',
          detailedDescription: 'Divides the specified values, done from the left to the right',
          usage: ['{divide:value1,value2,more values}'],
          example: ['10 / 2 = {divide:10,2}']
        },
        modulus: {
          name: 'modulus:value1,value2,more values',
          description: 'Gets the modulus of the specified values',
          detailedDescription: 'Gets the modulus of the specified values, done from the left to the right',
          usage: ['{modulus:value1,value2,more values}'],
          example: ['10 % 2 = {modulus:10,2}']
        }
      }
    },
    status: {definition: {name: 'status', description: 'Shows status of the bot'}}
  },
  common: {
    error: {
      noDm: 'This command can\'t be run in a DM channel',
      noPermissions: 'You don\'t have the required permissions to run this command',
      generic: 'Error'
    },
    accept: 'Accept',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No'
  },
  autocomplete: {
    settings: {
      language: {defaultServerLanguage: 'Server language'},
      locale: {
        defaultSettingsLanguage: 'Settings language',
        localeFromAvailableLanguages: '{{ LANG_NAME }} [{{ LANG_CODE }}]'
      }
    }
  },
  service: {
    guildSettings: {invalidLocale: 'The specified language is not available'},
    countService: {
      getCounts: {
        onlyPremium: 'Only Premium',
        unknownCounter: 'Unknown counter',
        disabled: 'Counter Disabled',
        noBanPerms: 'I need ban permissions to show this',
        invalidChannelLength: 'Invalid channel name length, please setup the counter again',
        notAvailable: 'Not available, please wait'
      }
    }
  }
}

declare const EnUS: EnUS;

export = EnUS;