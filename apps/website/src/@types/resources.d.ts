interface Resources {
  main: {
    common: {
      channelLabels: {
        announcementChannel: "Announcement channel";
        category: "Category";
        forumChannel: "Forum channel";
        mediaChannel: "Media channel";
        stageChannel: "Stage channel";
        textChannel: "Text channel";
        voiceChannel: "Voice channel";
      };
      knownError: "Error";
      knownErrors: {
        BOT_HAS_NO_ENOUGH_PRIVILEGED_INTENTS: "The bot does not have enough privileged intents to use this counter.";
        BOT_IS_NOT_PREMIUM: "The bot is not a premium version and lacks certain features needed for this counter.";
        DELIMITED_DATA_SOURCE_IS_ILLEGAL_JSON: "The counter is in a unrecognized format.";
        DELIMITED_DATA_SOURCE_IS_INVALID: "The counter is invalid.";
        EVALUATION_RESULT_FOR_CHANNEL_NAME_IS_LESS_THAN_2_CHARACTERS: "The result for the channel name is less than 2 characters long.";
        EVALUATION_TIMEOUT: "The evaluation took too long and timed out.";
        FAILED_TO_RETURN_A_FINAL_STRING: "Failed to generate a final string from the evaluation.";
        GAME_MISSING_ADDRESS: "The game counter requires a server address.";
        GAME_MISSING_GAME_ID: "A game ID must be provided for the game counter.";
        GAME_MISSING_PORT: "The game counter requires a server port.";
        HTTP_DATA_PATH_MANDATORY: "A data path must be specified for HTTP requests whose content type is application/json.";
        HTTP_INVALID_RESPONSE_CONTENT_TYPE: "The content type of the HTTP response is invalid (not text/plain or application/json).";
        HTTP_INVALID_RESPONSE_STATUS_CODE: "The HTTP response status code is invalid (not 200).";
        HTTP_MISSING_URL: "The HTTP counter requires a URL, which is missing.";
        MEMBER_COUNT_NOT_AVAILABLE: "The member counts are not available at this moment.";
        MEMERATOR_MISSING_USERNAME: "The Memerator counter requires a username, which is missing.";
        NO_ENOUGH_PERMISSIONS_TO_EDIT_CHANNEL: "The bot does not have sufficient permissions to edit the channel.";
        REDDIT_MISSING_SUBREDDIT: "A subreddit must be provided for the Reddit counter.";
        TWITCH_CHANNEL_NOT_FOUND: "The specified Twitch channel could not be found.";
        TWITCH_MISSING_USERNAME: "The Twitch counter requires a username to be set.";
        UNKNOWN: "An unknown error occurred.";
        UNKNOWN_DATA_SOURCE: "The counter provided is unknown or not recognized.";
        UNKNOWN_EVALUATION_RETURN_TYPE: "The type of value returned from evaluation is unknown.";
        USER_NOT_FOUND: "User not found.";
        YOUTUBE_INVALID_CHANNEL_URL: "The provided YouTube channel URL is invalid.";
        YOUTUBE_MISSING_CHANNEL_URL: "The YouTube counter requires a channel URL to be set.";
      };
      unknown: "Unknown";
      unknownChannel: "Unknown channel";
      unknownChannelType: "Unknown channel type";
      unknownDate: "Unknown date";
      unknownError: "Unknown error";
      unknownPublicBot: "Unknown Public Bot";
      unknownRole: "Unknown role";
      unknownServer: "Unknown server";
      unknownUser: "Unknown user {{id}}";
    };
    components: {
      Combobox: {
        items: {
          ChannelItem: {
            removeChannel: "Remove channel";
            selected: "Selected";
          };
          DataSourceItem: {
            edit: "Edit counter";
            notSelected: "Not selected";
            remove: "Remove counter";
            selected: "Selected";
          };
          GamedigItem: {
            remove: "Remove game";
            selected: "Selected";
          };
          LocaleItem: {
            remove: "Remove locale";
            selected: "Selected";
          };
          RoleItem: {
            everyone: "Everyone";
            remove: "Remove role";
            selected: "Selected";
          };
          TextItem: {
            remove: "Remove {{item}}";
            selected: "Selected";
          };
          TimezoneItem: {
            remove: "Remove timezone";
            selected: "Selected";
          };
        };
        noResults: "No results found.";
        placeholder: "Add...";
        searchPlaceholder: "Search...";
      };
      NavBar: {
        accountEntry: "Account";
        dashboardEntry: "Dashboard";
        supportEntry: "Support";
      };
      footer: {
        acceptableUsePolicy: "Acceptable Use Policy";
        admin: "Admin";
        codeRepository: "Code Repository";
        cookiePolicy: "Cookie Policy";
        copyright: "© {{year}} Member Counter. All rights reserved. Created by <eduardozgzLink />.";
        documentation: "Documentation";
        donate: "Donate";
        improveMemberCounter: "Improve Member Counter";
        legal: "Legal";
        loginWithDiscord: "Login with Discord";
        logout: "Logout";
        madePossibleThanksTo: "Made possible thanks to Alex, <vampireChickenLink />, <livingfloreLink />, Frosty, and <donorsLink>many more</donorsLink>.";
        manageDonations: "Manage donations";
        manageHomePage: "Manage homepage";
        manageServers: "Manage servers";
        manageUsers: "Manage users";
        privacyPolicy: "Privacy Policy";
        status: "Status";
        supportServer: "Support server";
        termsOfService: "Terms of Service";
        translateBot: "Translate the bot";
        usefulLinks: "Useful Links";
      };
    };
    dataSourceMetadata: {
      botStats: {
        description: "Return the total number of users and servers the bot is currently in. (You probably don't need this)";
        name: "Bot stats";
      };
      channels: {
        description: "Count the number of channels within specified categories or overall.";
        display: {
          channelsUnderACategory: "Channels under a category";
        };
        keywords: "channels,categories";
        name: "Channels";
      };
      clock: {
        description: "Display a clock adjusted to your preferred timezone.";
        display: {
          syntax: "Clock ({{timezone}})";
        };
        keywords: "clock,timezone";
        name: "Clock";
      };
      concat: {
        description: "Concatenate multiple strings into one.";
        display: {
          syntax: "Concatenate {{strings}} {{undisplayableStrings}}";
          undisplayableStrings: "and {{amount}} more";
        };
        keywords: "concat,concatenate,strings,combine,join,merge";
        name: "Concat";
      };
      countdown: {
        description: "Create a countdown timer with a format tailored to your needs.";
        display: {
          syntax: "Countdown to {{datetime}}";
        };
        keywords: "countdown,timer";
        name: "Countdown";
      };
      game: {
        description: "Retrieve the current number of online players in your game server, compatible with more than 320 games.";
        display: {
          playerCountFor: "Player count for {{gameServerAddress}}";
        };
        keywords: "game,players,online,server";
        name: "Game";
      };
      http: {
        description: "Send a GET request to an endpoint and provide the result to this bot.";
        display: {
          syntax: "HTTP {{hostname}}";
        };
        keywords: "HTTP,GET,request,endpoint,API,fetch";
        name: "HTTP";
      };
      math: {
        description: "Perform math operations like addition, subtraction, multiplication, division, or modulus on a list of numbers.";
        display: {
          operationType: {
            add: "add";
            divide: "divide";
            modulo: "modulo";
            multiply: "multiply";
            subtract: "subtract";
          };
          syntax: "{{operationType}} {{numbers}} {{undisplayableNumbers}}";
          undisplayableNumbers: "and {{amount}} more";
        };
        keywords: "math,calculator,operations,numbers,arithmetic,addition,subtraction,multiplication,division,modulus";
        name: "Math";
      };
      members: {
        description: "Count members, you can also filter them by their online status, specific roles and more.";
        display: {
          accountStatus: {
            dnd: "DND";
            idle: "idle";
            offline: "offline";
            online: "online";
          };
          accountType: {
            any: "members";
            bot: "bots";
            user: "users";
          };
          bannedMembers: "banned members";
          connectedToAChannel: "connected to a channel";
          playingAGame: "while playing a game";
          roleFiltering: {
            any: "with roles";
            overlapping: "with roles overlapping";
          };
          syntax: "{{accountType}} {{accountStatus}} {{roleFiltering}} {{connectedToAChannel}} {{playingAGame}}";
        };
        keywords: "members,filter,roles,online,status,banned,playing,offline,dnd,disturb,idle,afk,user,bot,connected";
        name: "Members";
      };
      memerator: {
        description: "Fetch the follower count and meme count for a Memerator account.";
        display: {
          returnKind: {
            followers: "followers";
            memes: "memes";
          };
          syntax: "Memerator {{returnKind}}";
        };
        keywords: "memerator,follower,view,channel";
        name: "Memerator";
      };
      nitroboosters: {
        description: "Retrieve the count of Nitro boosters for the server.";
        keywords: "nitro,boosters,server";
        name: "Nitro Boosters";
      };
      number: {
        description: "Apply number formatting to the given number.";
        display: {
          dataSource: "{{dataSourceDisplayName}} as number";
          raw: "Number ({{number}})";
        };
        keywords: "number,formatting";
        name: "Number";
      };
      reddit: {
        description: "Retrieve the title of a subreddit along with the total number of members and the count of members currently online.";
        display: {
          returnKind: {
            members: "members";
            membersOnline: "online members";
            title: "title";
          };
          syntax: "Reddit {{returnKind}}";
        };
        keywords: "reddit,subreddit,members,online";
        name: "Reddit";
      };
      replace: {
        description: "Text replacement, useful in conjunction with other nested counters for comprehensive text modification.";
        display: {
          replaceSyntax: "“{{search}}” by “{{replacement}}”";
          syntax: "Replace {{replaceSyntax}}";
        };
        keywords: "text,replacement,modification,string,substring";
        name: "Replace";
      };
      roles: {
        description: "Count all roles present in the server.";
        keywords: "roles";
        name: "Roles";
      };
      twitch: {
        description: "Retrieve follower count and total view count for a Twitch channel.";
        display: {
          returnKind: {
            channelName: "channel name";
            followers: "followers";
            viewers: "viewers";
          };
          syntax: "Twitch {{returnKind}}";
        };
        keywords: "Twitch,follower,view,channel";
        name: "Twitch";
      };
      unknown: {
        description: "Unknown counter. This is probably due to an error";
        name: "Unknown";
      };
      youtube: {
        description: "Fetch subscriber count, video count, and total views from a YouTube channel.";
        display: {
          returnKind: {
            channelName: "channel name";
            subscribers: "subscribers";
            videos: "videos";
            views: "views";
          };
          syntax: "YouTube {{returnKind}}";
        };
        keywords: "YouTube,subscriber,video,views,channel";
        name: "YouTube";
      };
    };
    hooks: {
      useConfirmOnLeave: "You have unsaved changes. Are you sure you want to leave this page?";
      useFormManager: {
        state: {
          save: "Save";
          saved: "Saved";
          saving: "Saving...";
        };
      };
    };
    pages: {
      account: {
        deleteButton: {
          closeBtn: "Close";
          confirmDescription: "This action cannot be undone. This will permanently delete your account and remove your data from our servers.";
          confirmTitle: "Are you absolutely sure?";
          deleteAccountBtn: "Delete account";
        };
        page: {
          avatarAlt: "{{username}}'s avatar";
          logoutButton: "Logout";
        };
        userBadges: {
          betaTester: "You participated in a beta program.";
          bigBrain: "You suggested an idea that was implemented.";
          bugCatcher: "You found and reported a bug.";
          contributor: "You implemented a feature or fixed a bug.";
          donor: "You donated to support the development and maintenance of Member Counter.";
          foldingAtHome: "You contributed a WU in folding@home.";
          patPat: "You found a secret.";
          premium: "You are a premium user.";
          translator: "You helped translate the bot.";
        };
      };
      admin: {
        donations: {
          delete: {
            button: "Delete donation";
            closeButton: "Close";
            dialogDescription: "This action cannot be undone.";
            dialogTitle: "Are you absolutely sure?";
          };
          edit: {
            title: "Edit donation";
          };
          form: {
            amount: "Amount";
            anonymous: "Anonymous";
            currency: "Currency";
            currencyDecimals: "Currency decimals";
            date: "Date";
            note: "Note";
            saveBtn: "Save";
            userId: "Discord user ID";
          };
          new: {
            title: "New donation";
          };
          registerDonation: "Register donation";
          totalDonations: "Total donations: {{total}} ({{totalValue}})";
        };
        guilds: {
          loadGuildInput: {
            loadButton: "Load server";
            placeholder: "Paste server ID";
          };
        };
        homePage: {
          demoServers: {
            createBtn: "Create";
            createInputPlaceholder: "New demo server name";
            delete: {
              button: "Delete demo server";
              closeButton: "Close";
              dialogDescription: "This action cannot be undone.";
              dialogTitle: "Are you absolutely sure?";
            };
            list: {
              display: {
                priority: "Priority: {{priority}}";
              };
            };
            manage: {
              channels: {
                add: "Add channel";
                channel: {
                  isRulesChannel: "Show as rules channel";
                  name: "Name";
                  remove: "Remove";
                  showAsSkeleton: "Show as skeleton";
                  topic: "Topic";
                  type: "Type";
                  types: {
                    announcementChannel: "Announcement channel";
                    categoryChannel: "Category channel";
                    textChannel: "Text channel";
                    voiceChannel: "Locked voice channel";
                  };
                };
                title: "Channels";
              };
              description: "Description";
              icon: "Icon URL";
              language: "Language";
              links: {
                add: "Add link";
                link: {
                  label: "Label";
                  remove: "Remove";
                  url: "URL";
                };
                title: "Links";
              };
              name: "Server name";
              priority: "Priority";
              save: "Save";
              saved: "Saved";
              title: "Edit demo server";
            };
            title: "Demo servers";
          };
          headings: [
            "Display your server’s member count dynamically",
            "Show off your YouTube subscriber count",
            "Monitor your Minecraft server's player count",
            "Show off how many people is watching your Twitch channel",
            "Display any data you want in your Discord server",
            "Track how many players your FiveM server has",
            "Show a clock adjusted to your preferred timezone",
            "Create countdowns for events or special occasions",
            "Monitor player stats across 320+ game servers",
            "Fetch and display data from any API endpoint",
            "Perform and display math operations on your data",
            "Format numbers and display them beautifully",
            "Highlight your server's Nitro boosters",
          ];
          supportedCounters: {
            andMuchMore: {
              description: "Discover even more features and counters that can enhance your experience. Stay tuned for updates!";
              title: "And Much More!";
            };
            clock: {
              description: "View the time in any timezone with our customizable clock. Perfect for coordinating across different regions.";
              title: "Clock";
            };
            countdown: {
              description: "Create and manage countdown timers tailored to your specific events or deadlines.";
              title: "Countdown";
            };
            discordMembers: {
              description: "Count and filter members by online status, roles, and other criteria to get precise insights about your community.";
              title: "Discord Members";
            };
            game: {
              description: "Monitor your game server’s activity with real-time player counts for over 320 supported games.";
              title: "Game";
            };
            http: {
              description: "Execute GET requests and receive data directly from any endpoint, streamlining your integration needs.";
              title: "HTTP";
            };
            math: {
              description: "Perform a range of mathematical operations including addition, subtraction, multiplication, and more on multiple numbers.";
              title: "Math";
            };
            nitroBoosters: {
              description: "Track the number of Nitro boosters in your server to gauge community support and engagement.";
              title: "Nitro Boosters";
            };
            reddit: {
              description: "Get statistics on any subreddit, including title, member count, and online members.";
              title: "Reddit";
            };
            replace: {
              description: "Modify text dynamically with our powerful replacement tool, ideal in conjunction with the HTTP counter.";
              title: "Replace";
            };
            twitch: {
              description: "Monitor Twitch channel metrics such as follower count and view statistics to stay updated on your favorite streamers.";
              title: "Twitch";
            };
            youtube: {
              description: "Retrieve key metrics from YouTube channels including subscriber count, video count, and overall views.";
              title: "YouTube";
            };
          };
        };
        users: {
          delete: {
            button: "Delete account";
            closeButton: "Close";
            dialogDescription: "This action cannot be undone.";
            dialogTitle: "Are you absolutely sure?";
          };
          loadUser: "Load user";
          manage: {
            badges: {
              betaTester: "Beta Tester";
              bigBrain: "Big Brain";
              bugCatcher: "Bug Catcher";
              contributor: "Contributor";
              donor: "Donor";
              foldingAtHome: "folding@home";
              patPat: "Pat Pat";
              premium: "Premium";
              title: "Badges";
              translator: "Translator";
            };
            pasteUserId: "Paste user ID";
            permissions: {
              manageDonations: "Manage donations";
              manageGuilds: "Manage servers";
              manageHomePage: "Manage landing page";
              manageUsers: "Manage users";
              seeGuilds: "See servers";
              seeUsers: "See users";
              title: "Permissions";
            };
            save: "Save";
            saved: "Saved";
            transferAccount: "Transfer account";
          };
          recentUsers: "Recent users";
          userNotRegistered: "This user isn't registered.";
        };
      };
      dashboard: {
        noServers: {
          heading: "You aren't in any server. ";
          subheading: "Why you don't start by creating a <CreateServerLink>new one</CreateServerLink> or by <JoinSupportServerLink>joining us</JoinSupportServerLink>?";
        };
        servers: {
          ChannelNavItem: {
            infoTooltip: {
              enabled: "Counters are enabled in this channel";
              issue: "There is an issue in this channel that requires your attention";
            };
            unsupportedChannelType: "This channel type is not supported yet.";
          };
          ServerNavMenu: {
            channelList: "Channel list";
            loading: "Loading server data...";
            serverSettings: "Server settings";
            unknownChannels: "Visit saved channels if the Discord channels are unable to load";
          };
          TemplateEditor: {
            AddDataSourceCombobox: {
              noItemsFound: "No counters found.";
              searchPlaceholder: "Search counter...";
            };
            DataSource: {
              Format: {
                DataSourceFormat: {
                  defaultServerSettings: "Default to server settings";
                  no: "No";
                  overrideDefaultDigits: "Override default digits";
                  overrideDefaultLocale: "Override default locale";
                  searchLocale: "Search locale...";
                  select: "Select";
                  useCompactNotation: "Use compact notation";
                  yes: "Yes";
                };
              };
              Options: {
                Pages: {
                  BotStatsOptions: {
                    display: "Display";
                    selectPlaceholder: "Select something to display";
                    servers: "Servers";
                    users: "Users";
                  };
                  ChannelOptions: {
                    addCategoryPlaceholder: "Add category...";
                    configWarning: "Remember to return a valid category ID";
                    filterByCategory: "Filter by category";
                  };
                  ClockOptions: {
                    configWarning: "Remember to return a valid timezone identifier";
                    searchTimezonePlaceholder: "Search timezone...";
                    timezone: "Timezone";
                  };
                  ConcatOptions: {
                    addString: "Add text...";
                    stringList: "Text list";
                  };
                  CountdownOptions: {
                    counterPreview: "We can't show you a live preview when the target date or format is the result of a counter, you must preview the whole template to see how it will look like.";
                    dateConfigWarning: "Remember to return a valid UNIX timestamp";
                    datePlaceholder: "Or take date from a counter...";
                    defaultFormat: "%d days, %h hours and %m minutes left";
                    format: "Format";
                    formatConfigWarning: "Remember to return a valid formatting string";
                    formatInstructions: "Use <code>%d</code> to show the days left, <code>%h</code> for the hours left, and <code>%m</code> for the minutes left.";
                    livePreview: "Live preview";
                    noPreview: "We can't show you a live preview when the target date or format is empty.";
                    targetDate: "Target date";
                  };
                  GameOptions: {
                    address: "Address";
                    addressWarning: "Remember to return a valid address";
                    game: "Game";
                    gameWarning: "Remember to return a valid node-gamedig game type";
                    port: "Port (or query port)";
                    portWarning: "Remember to return a valid port number";
                    searchPlaceholder: "Search...";
                  };
                  HttpOptions: {
                    dataPath: "Data path";
                    dataPathDescription: "A path to get the desired value when the response's content type is JSON, the syntax is similar to the one used by JS to access properties and array items.";
                    dataPathWarning: "Remember to return a data path";
                    emptyUrl: "Can't fetch, URL is empty";
                    fetch: "Fetch";
                    fetching: "Fetching...";
                    lifetime: "Lifetime (in seconds)";
                    lifetimeDescription: "Specifies for how long the response of the specified URL will be cached.";
                    lifetimeWarning: "Remember to return a valid number";
                    noPreview: "We can't show you a preview when the URL or data path is the result of a counter, you must preview the whole template to see how it will look like.";
                    preview: "Preview";
                    testResponse: "Test response";
                    url: "URL (GET)";
                    urlWarning: "Remember to return a valid URL";
                  };
                  MathOptions: {
                    addNumber: "Add number...";
                    addition: "Addition";
                    division: "Division";
                    modulo: "Modulo (Reminder of a division)";
                    multiplication: "Multiplication";
                    numberList: "Number list";
                    numberWarning: "Remember to return a valid number";
                    operation: "Operation type";
                    selectOperation: "Select a operation type";
                    subtraction: "Substraction";
                  };
                  MembersOptions: {
                    CountOnlyBanned: {
                      label: "Count only banned members";
                    };
                    FilterByAccountType: {
                      any: "Any";
                      bot: "Bot";
                      label: "Filter by account type";
                      placeholder: "Select an account type";
                      user: "User";
                    };
                    FilterByConnectedTo: {
                      addPlaceholder: "Add voice channel...";
                      dataSourceConfigWarning: "Remember to return a valid voice channel ID";
                      label: "Filter by connected to a voice channel";
                    };
                    FilterByRole: {
                      addPlaceholder: "Add role...";
                      dataSourceConfigWarning: "Remember to return a valid role ID";
                      label: "Filter by role";
                    };
                    FilterByRoleFilterMode: {
                      anyMatch: "Any match";
                      label: "Filter mode";
                      overlap: "Overlap";
                      placeholder: "Select the filter mode";
                    };
                    FilterByStatus: {
                      any: "Any";
                      dnd: "Do not disturb";
                      idle: "Idle";
                      label: "Filter by status";
                      offline: "Offline";
                      online: "Online";
                      placeholder: "Select a status";
                    };
                    FilterPlayingGame: {
                      label: "Filter by playing a game";
                      placeholder: "Add game...";
                    };
                  };
                  MemeratorOptions: {
                    display: "Display";
                    followers: "Followers";
                    memes: "Memes";
                    selectDisplay: "Select something to display";
                    username: "Username";
                    usernameWarning: "Remember to return a valid username";
                  };
                  NumberOptions: {
                    number: "Number";
                    numberWarning: "Remember to return a valid number";
                    placeholder: "Enter a number or search a counter";
                  };
                  RedditOptions: {
                    display: "Display";
                    members: "Members";
                    membersOnline: "Members online";
                    selectPlaceholder: "Select something to display";
                    subreddit: "Subreddit name";
                    subredditPlaceholder: "Enter a subreddit or search a counter";
                    subredditWarning: "Remember to return a valid subreddit";
                    title: "Subreddit title";
                  };
                  ReplaceOptions: {
                    addReplacement: "Add replacement";
                    inputText: "Input text";
                    removeReplacement: "Remove replacement";
                    replaceWith: "Replace with";
                    replacementPlaceholder: "Enter the replacement text";
                    searchFor: "Search for";
                    searchPlaceholder: "Enter the search term";
                    textPlaceholder: "Enter the text to replace";
                  };
                  TwitchOptions: {
                    channelName: "Channel name";
                    display: "Display";
                    followers: "Followers";
                    selectPlaceholder: "Select something to display";
                    username: "Username";
                    usernamePlaceholder: "Enter a username";
                    usernameWarning: "Remember to return a valid username";
                    viewers: "Viewers";
                  };
                  YouTubeOptions: {
                    channelName: "Channel name";
                    channelUrl: "Channel URL";
                    channelUrlPlaceholder: "Enter a channel URL";
                    channelUrlWarning: "Remember to return a valid channel URL";
                    display: "Display";
                    selectPlaceholder: "Select something to display";
                    subscribers: "Subscribers";
                    videos: "Videos";
                    views: "Views";
                  };
                };
              };
            };
            emojiPicker: {
              emojiPicker: "Emoji picker";
              searchEmoji: "Search emoji";
            };
            markButtons: {
              bold: "bold";
              italic: "italic";
              spoiler: "spoiler";
              strike: "strike";
              underline: "underline";
            };
          };
          blockedBanner: {
            acceptableUsePolicy: "Acceptable Use Policy";
            noReasonGiven: "No reason given";
            supportTeam: "Support team";
            termsOfService: "Terms of Service";
            text: "This server has been blocked for violating our <LinkTerms>Terms of Service</LinkTerms> or <LinkPolicy>Acceptable Use Policy</LinkPolicy>.<br />Reason given: {{reason}}<br />If you think this is a mistake, please contact our <SupportLink>support team</SupportLink>.";
          };
          channels: {
            save: "Save";
            saved: "Saved";
            sections: {
              EditTemplate: {
                lastUpdated: "Last updated: {{lastTemplateUpdateDate}}";
                template: "Template";
              };
              EnableTemplate: {
                description: "When enabled, Member Counter will automatically update this channel's {{templateTarget}} to show the processed template.";
                enableTemplate: "Enable template";
                nameTarget: "name";
                topicTarget: "topic";
              };
              TemplateError: {
                errorDescription: "An error occurred during the last template processing. Details are shown below.";
                errorTitle: "The template had an error when it was last processed";
              };
            };
          };
          forbiddenPage: {
            message: "You don't have permission to manage this server.\nAsk an admin at {{guildName}} to give you Administrator or Manage Guild permissions.";
            title: "Permission Denied";
          };
          inviteBotBanner: {
            closeBtn: "Close";
            message: "It looks like the Member Counter Bot isn't in this server. Would you like to <LinkURL>add it</LinkURL>?";
          };
          inviteBotPage: {
            addToServer: "Add to {{serverName}}";
            copyLink: "Copy invite link";
            linkCopied: "The link has been copied to your clipboard.";
            noPermission: "You don't have enough permissions to add the bot. Please ask an administrator or someone with Manage Server permission to add this bot.";
            subtitle: "Add Member Counter to {{serverName}} and enjoy real-time counters.";
            title: "Let's set up the bot!";
            useOrShareLink: "Use or share this link to add the bot.";
          };
          settings: {
            block: {
              blockButton: "Block server";
              blockDialogDescription: "The given reason will be displayed to the server administrators.";
              blockDialogTitle: "Do you really want to block this server?";
              closeButton: "Close";
              reasonLabel: "Reason";
              reasonPlaceholder: "Please specify a reason";
              unblockButton: "Unblock server";
              unblockDialogDescription: "This server was blocked due to the following reason: {{reason}}";
              unblockDialogTitle: "Do you really want to unblock this server?";
            };
            reset: {
              closeButton: "Close";
              dialogDescription: "This action cannot be undone. All the settings will be reset to the defaults.";
              dialogTitle: "Are you absolutely sure?";
              resetButton: "Reset settings";
            };
            save: "Save";
            saved: "Saved";
            sections: {
              CustomDigits: {
                customDigits: "Custom digits";
                customDigitsDescription: 'In counters that return a number, Member Counter will replace each digit with the ones you provide. This is useful if you want to display custom emojis or something else, such as "unicode style fonts."';
                customizationRecommendation: "We do not recommend customizing any digit unless you are certain that nobody using a screen reader will have access to any counter.";
                screenReaderWarning: "Keep in mind that users using a screen reader (text-to-speech) may not be able to understand the customized digits and <demoLink>may hear something unintelligible</demoLink>. Screen readers are often used by people with visual disabilities.";
              };
              Locale: {
                description: "Changing this will affect how some counters are displayed.";
                locale: "Locale";
                numberExample: "439212 will be displayed as {{number}}";
                searchPlaceholder: "Search locale...";
                timeExample: "15:30h (or 3:30 PM) will be displayed as {{time}}";
              };
              UseCompactNotation: {
                description: "Counters that return numbers will be displayed in a more compact way.";
                example1: "12300 will be displayed as {{number}}";
                example2: "439212 will be displayed as {{number}}";
                example3: "1500000 will be displayed as {{number}}";
                label: "Use compact notation for numbers";
              };
            };
            title: "Server Settings";
          };
          suggestedTopics: {
            advancedCounters: {
              description: "Get the most out of your counters, tailored to your needs.";
              label: "Like a pro";
              title: "Advanced counters";
            };
            createFromScratch: {
              description: "Learn how to create your first custom counter in a few minutes.";
              label: "Be unique!";
              title: "Create from scratch";
            };
            queryHistoricalStatistics: {
              description: "See how your counters and other common stats have evolved over time.";
              label: "Coming Soon™";
              title: "Query historical statistics";
            };
            quickSetup: {
              description: "Quickly create the most common counters in a few clicks. No imagination or brain required!";
              label: "Hassle-free!";
              title: "Quick setup";
            };
            subTitle: "Here are some suggestions for you:";
            title: "Welcome back!";
          };
        };
      };
      error: {
        errors: {
          InternalServerError: "An unexpected error occurred.";
          NotAuthenticated: "You are not logged in.";
          NotAuthorized: "You are not authorized to access this page.";
          NotFound: "The page you are looking for could not be found.";
        };
        nav: {
          backBtn: "Go back";
          homeBtn: "Go home";
          supportBtn: "Get support";
          tryAgainBtn: "Try again";
        };
      };
      status: {
        affectedServers: "Affected discord servers:";
        assignedDiscordServers: "Assigned to this child:";
        child: "Child #{{index}}";
        childDiscordServers: "{{count}} Discord servers {{unavailableCount}}";
        childDiscordUnavailableServers: "({{unavailableCount}} unavailable)";
        childDiscordUsers: "{{count}} Users";
        discordClientStatus: {
          Connecting: "Connecting";
          Disconnected: "Disconnected";
          Identifying: "Identifying";
          Idle: "Idle";
          Nearly: "Idle";
          Ready: "Ready";
          Reconnecting: "Reconnecting";
          Resuming: "Resuming";
          WaitingForGuilds: "Waiting for guilds";
        };
        memoryUsage: "{{usage}} ({{peak}} peak)";
        memoryUsageTooltip: "Memory usage";
        partialOutage: "There is a partial outage";
        serverInformation: {
          cpuInfo: "{{cores}} Cores\nLoad {{load}}";
          cpuLabel: "CPU";
          hostname: "Name";
          memoryInfo: "{{memory}}\n{{usage}}% Usage";
          memoryLabel: "Memory";
          title: "Server information";
        };
        statusUnavailable: "Status unavailable";
      };
    };
  };
}

export default Resources;
