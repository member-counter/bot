interface Resources {
  "main": {
    "hooks": {
      "useConfirmOnLeave": "You have unsaved changes. Are you sure you want to leave this page?",
      "useFormManager": {
        "state": {
          "save": "Save",
          "saving": "Saving...",
          "saved": "Saved"
        }
      }
    },
    "components": {
      "Combobox": {
        "items": {
          "ChannelItem": {
            "selected": "Selected",
            "removeChannel": "Remove channel"
          },
          "DataSourceItem": {
            "selected": "Selected",
            "notSelected": "Not selected",
            "edit": "Edit counter",
            "remove": "Remove counter"
          },
          "GamedigItem": {
            "selected": "Selected",
            "remove": "Remove game"
          },
          "LocaleItem": {
            "selected": "Selected",
            "remove": "Remove locale"
          },
          "RoleItem": {
            "everyone": "Everyone",
            "selected": "Selected",
            "remove": "Remove role"
          },
          "TextItem": {
            "selected": "Selected",
            "remove": "Remove {{item}}"
          },
          "TimezoneItem": {
            "selected": "Selected",
            "remove": "Remove timezone"
          }
        },
        "placeholder": "Add...",
        "searchPlaceholder": "Search...",
        "noResults": "No results found."
      },
      "NavBar": {
        "supportEntry": "Support",
        "dashboardEntry": "Dashboard",
        "accountEntry": "Account"
      },
      "footer": {
        "usefulLinks": "Useful Links",
        "supportServer": "Support server",
        "documentation": "Documentation",
        "loginWithDiscord": "Login with Discord",
        "logout": "Logout",
        "legal": "Legal",
        "termsOfService": "Terms of Service",
        "cookiePolicy": "Cookie Policy",
        "privacyPolicy": "Privacy Policy",
        "acceptableUsePolicy": "Acceptable Use Policy",
        "improveMemberCounter": "Improve Member Counter",
        "codeRepository": "Code Repository",
        "translateBot": "Translate the bot",
        "donate": "Donate",
        "admin": "Admin",
        "manageUsers": "Manage users",
        "manageServers": "Manage servers",
        "manageHomePage": "Manage homepage",
        "manageDonations": "Manage donations",
        "sentry": "Sentry",
        "copyright": "© {{year}} Member Counter. All rights reserved. Created by <eduardozgzLink />.",
        "madePossibleThanksTo": "Made possible thanks to Alex, <vampireChickenLink />, <livingfloreLink />, Frosty, and <donorsLink>many more</donorsLink>."
      }
    },
    "pages": {
      "error": {
        "errors": {
          "NotAuthenticated": "You are not logged in.",
          "NotAuthorized": "You are not authorized to access this page.",
          "NotFound": "The page you are looking for could not be found.",
          "InternalServerError": "An unexpected error occurred."
        },
        "nav": {
          "homeBtn": "Go home",
          "tryAgainBtn": "Try again",
          "supportBtn": "Get support",
          "backBtn": "Go back"
        }
      },
      "dashboard": {
        "noServers": {
          "heading": "You aren't in any server. ",
          "subheading": "Why you don't start by creating a <CreateServerLink>new one</CreateServerLink> or by <JoinSupportServerLink>joining us</JoinSupportServerLink>?"
        },
        "servers": {
          "suggestedTopics": {
            "quickSetup": {
              "title": "Quick setup",
              "description": "Quickly create the most common counters in a few clicks. No imagination or brain required!",
              "label": "Hassle-free!"
            },
            "createFromScratch": {
              "title": "Create from scratch",
              "description": "Learn how to create your first custom counter in a few minutes.",
              "label": "Be unique!"
            },
            "advancedCounters": {
              "title": "Advanced counters",
              "description": "Get the most out of your counters, tailored to your needs.",
              "label": "Like a pro"
            },
            "queryHistoricalStatistics": {
              "title": "Query historical statistics",
              "description": "See how your counters and other common stats have evolved over time.",
              "label": "Coming Soon™"
            },
            "title": "Welcome back!",
            "subTitle": "Here are some suggestions for you:"
          },
          "inviteBotPage": {
            "title": "Let's set up the bot!",
            "subtitle": "Add Member Counter to {{serverName}} and enjoy real-time counters.",
            "addToServer": "Add to {{serverName}}",
            "noPermission": "You don't have enough permissions to add the bot. Please ask an administrator or someone with Manage Server permission to add this bot.",
            "useOrShareLink": "Use or share this link to add the bot.",
            "linkCopied": "The link has been copied to your clipboard.",
            "copyLink": "Copy invite link"
          },
          "inviteBotBanner": {
            "message": "It looks like the Member Counter Bot isn't in this server. Would you like to <LinkURL>add it</LinkURL>?",
            "closeBtn": "Close"
          },
          "forbiddenPage": {
            "message": "You don't have permission to manage this server.\nAsk an admin at {{guildName}} to give you Administrator or Manage Guild permissions.",
            "title": "Permission Denied"
          },
          "blockedBanner": {
            "text": "This server has been blocked for violating our <LinkTerms>Terms of Service</LinkTerms> or <LinkPolicy>Acceptable Use Policy</LinkPolicy>.<br />Reason given: {{reason}}<br />If you think this is a mistake, please contact our <SupportLink>support team</SupportLink>.",
            "termsOfService": "Terms of Service",
            "acceptableUsePolicy": "Acceptable Use Policy",
            "noReasonGiven": "No reason given",
            "supportTeam": "Support team"
          },
          "settings": {
            "title": "Server Settings",
            "save": "Save",
            "saved": "Saved",
            "block": {
              "blockButton": "Block server",
              "unblockButton": "Unblock server",
              "blockDialogTitle": "Do you really want to block this server?",
              "unblockDialogTitle": "Do you really want to unblock this server?",
              "blockDialogDescription": "The given reason will be displayed to the server administrators.",
              "unblockDialogDescription": "This server was blocked due to the following reason: {{reason}}",
              "reasonLabel": "Reason",
              "reasonPlaceholder": "Please specify a reason",
              "closeButton": "Close"
            },
            "reset": {
              "resetButton": "Reset settings",
              "dialogTitle": "Are you absolutely sure?",
              "dialogDescription": "This action cannot be undone. All the settings will be reset to the defaults.",
              "closeButton": "Close"
            },
            "sections": {
              "CustomDigits": {
                "customDigits": "Custom digits",
                "customDigitsDescription": "In counters that return a number, Member Counter will replace each digit with the ones you provide. This is useful if you want to display custom emojis or something else, such as \"unicode style fonts.\"",
                "screenReaderWarning": "Keep in mind that users using a screen reader (text-to-speech) may not be able to understand the customized digits and <demoLink>may hear something unintelligible</demoLink>. Screen readers are often used by people with visual disabilities.",
                "customizationRecommendation": "We do not recommend customizing any digit unless you are certain that nobody using a screen reader will have access to any counter."
              },
              "Locale": {
                "locale": "Locale",
                "description": "Changing this will affect how some counters are displayed.",
                "timeExample": "15:30h (or 3:30 PM) will be displayed as {{time}}",
                "numberExample": "439212 will be displayed as {{number}}",
                "searchPlaceholder": "Search locale..."
              },
              "UseCompactNotation": {
                "label": "Use compact notation for numbers",
                "description": "Counters that return numbers will be displayed in a more compact way.",
                "example1": "12300 will be displayed as {{number}}",
                "example2": "439212 will be displayed as {{number}}",
                "example3": "1500000 will be displayed as {{number}}"
              }
            }
          },
          "channels": {
            "sections": {
              "EditTemplate": {
                "template": "Template",
                "lastUpdated": "Last updated: {{lastTemplateUpdateDate}}"
              },
              "EnableTemplate": {
                "enableTemplate": "Enable template",
                "description": "When enabled, Member Counter will automatically update this channel's {{templateTarget}} to show the processed template.",
                "nameTarget": "name",
                "topicTarget": "topic"
              },
              "TemplateError": {
                "errorTitle": "The template had an error when it was last processed",
                "errorDescription": "An error occurred during the last template processing. Details are shown below.",
                "errors": {
                  "UNKNOWN": "An unknown error occurred.",
                  "UNKNOWN_DATA_SOURCE": "The counter provided is unknown or not recognized.",
                  "UNKNOWN_EVALUATION_RETURN_TYPE": "The type of value returned from evaluation is unknown.",
                  "FAILED_TO_RETURN_A_FINAL_STRING": "Failed to generate a final string from the evaluation.",
                  "DELIMITED_DATA_SOURCE_IS_ILLEGAL_JSON": "The counter is in a unrecognized format",
                  "DELIMITED_DATA_SOURCE_IS_INVALID": "The counter is invalid.",
                  "EVALUATION_RESULT_FOR_CHANNEL_NAME_IS_LESS_THAN_2_CHARACTERS": "The result for the channel name is less than 2 characters long.",
                  "NO_ENOUGH_PERMISSIONS_TO_EDIT_CHANNEL": "The bot does not have sufficient permissions to edit the channel.",
                  "MEMERATOR_MISSING_USERNAME": "The Memerator counter requires a username, which is missing.",
                  "REDDIT_MISSING_SUBREDDIT": "A subreddit must be provided for the Reddit coutner.",
                  "TWITCH_MISSING_USERNAME": "The Twitch counter requires a username to be set.",
                  "TWITCH_CHANNEL_NOT_FOUND": "The specified Twitch channel could not be found.",
                  "YOUTUBE_MISSING_CHANNEL_URL": "The YouTube counter requires a channel URL to be set.",
                  "YOUTUBE_INVALID_CHANNEL_URL": "The provided YouTube channel URL is invalid.",
                  "HTTP_MISSING_URL": "The HTTP counter requires a URL, which is missing.",
                  "HTTP_INVALID_RESPONSE_CONTENT_TYPE": "The content type of the HTTP response is invalid (not text/plain or application/json).",
                  "HTTP_INVALID_RESPONSE_STATUS_CODE": "The HTTP response status code is invalid (not 200).",
                  "HTTP_DATA_PATH_MANDATORY": "A data path must be specified for HTTP requests whose content type is application/json.",
                  "GAME_MISSING_ADDRESS": "The game counter requires a server address.",
                  "GAME_MISSING_PORT": "The game counter requires a server port.",
                  "GAME_MISSING_GAME_ID": "A game ID must be provided for the game counter.",
                  "BOT_HAS_NO_ENOUGH_PRIVILEGED_INTENTS": "The bot does not have enough privileged intents to use this counter.",
                  "BOT_IS_NOT_PREMIUM": "The bot is not a premium version and lacks certain features needed for this counter.",
                  "MEMBER_COUNT_NOT_AVAILABLE": "The member counts are not available at this moment."
                }
              }
            },
            "saved": "Saved",
            "save": "Save"
          },
          "ChannelNavItem": {
            "unsupportedChannelType": "This channel type is not supported yet.",
            "infoTooltip": {
              "enabled": "Counters are enabled in this channel",
              "issue": "There is an issue in this channel that requires your attention"
            }
          },
          "ServerNavMenu": {
            "channelList": "Channel list",
            "serverSettings": "Server settings",
            "loading": "Loading server data...",
            "unknownChannels": "Visit saved channels if the Discord channels are unable to load"
          },
          "TemplateEditor": {
            "DataSource": {
              "Format": {
                "DataSourceFormat": {
                  "useCompactNotation": "Use compact notation",
                  "select": "Select",
                  "defaultServerSettings": "Default to server settings",
                  "yes": "Yes",
                  "no": "No",
                  "overrideDefaultLocale": "Override default locale",
                  "searchLocale": "Search locale...",
                  "overrideDefaultDigits": "Override default digits"
                }
              },
              "Options": {
                "Pages": {
                  "MembersOptions": {
                    "CountOnlyBanned": {
                      "label": "Count only banned members"
                    },
                    "FilterByAccountType": {
                      "label": "Filter by account type",
                      "placeholder": "Select an account type",
                      "any": "Any",
                      "user": "User",
                      "bot": "Bot"
                    },
                    "FilterByConnectedTo": {
                      "label": "Filter by connected to a voice channel",
                      "dataSourceConfigWarning": "Remember to return a valid voice channel ID",
                      "addPlaceholder": "Add voice channel..."
                    },
                    "FilterByRole": {
                      "label": "Filter by role",
                      "dataSourceConfigWarning": "Remember to return a valid role ID",
                      "addPlaceholder": "Add role..."
                    },
                    "FilterByRoleFilterMode": {
                      "placeholder": "Select the filter mode",
                      "label": "Filter mode",
                      "anyMatch": "Any match",
                      "overlap": "Overlap"
                    },
                    "FilterByStatus": {
                      "label": "Filter by status",
                      "placeholder": "Select a status",
                      "any": "Any",
                      "online": "Online",
                      "idle": "Idle",
                      "dnd": "Do not disturb",
                      "offline": "Offline"
                    },
                    "FilterPlayingGame": {
                      "label": "Filter by playing a game",
                      "placeholder": "Add game..."
                    }
                  },
                  "BotStatsOptions": {
                    "display": "Display",
                    "selectPlaceholder": "Select something to display",
                    "servers": "Servers",
                    "users": "Users"
                  },
                  "ChannelOptions": {
                    "filterByCategory": "Filter by category",
                    "addCategoryPlaceholder": "Add category...",
                    "configWarning": "Remember to return a valid category ID"
                  },
                  "ClockOptions": {
                    "timezone": "Timezone",
                    "searchTimezonePlaceholder": "Search timezone...",
                    "configWarning": "Remember to return a valid timezone identifier"
                  },
                  "CountdownOptions": {
                    "defaultFormat": "%d days, %h hours and %m minutes left",
                    "targetDate": "Target date",
                    "datePlaceholder": "Or take date from a counter...",
                    "dateConfigWarning": "Remember to return a valid UNIX timestamp",
                    "format": "Format",
                    "formatInstructions": "Use <code>%d</code> to show the days left, <code>%h</code> for the hours left, and <code>%m</code> for the minutes left.",
                    "formatConfigWarning": "Remember to return a valid formatting string",
                    "livePreview": "Live preview",
                    "noPreview": "We can't show you a live preview when the target date or format is empty.",
                    "counterPreview": "We can't show you a live preview when the target date or format is the result of a counter, you must preview the whole template to see how it will look like."
                  },
                  "GameOptions": {
                    "game": "Game",
                    "searchPlaceholder": "Search...",
                    "gameWarning": "Remember to return a valid node-gamedig game type",
                    "address": "Address",
                    "addressWarning": "Remember to return a valid address",
                    "port": "Port (or query port)",
                    "portWarning": "Remember to return a valid port number"
                  },
                  "HttpOptions": {
                    "url": "URL (GET)",
                    "urlWarning": "Remember to return a valid URL",
                    "lifetime": "Lifetime (in seconds)",
                    "lifetimeDescription": "Specifies for how long the response of the specified URL will be cached.",
                    "lifetimeWarning": "Remember to return a valid number",
                    "dataPath": "Data path",
                    "dataPathDescription": "A path to get the desired value when the response's content type is JSON, the syntax is similar to the one used by JS to access properties and array items.",
                    "dataPathWarning": "Remember to return a data path",
                    "noPreview": "We can't show you a preview when the URL or data path is the result of a counter, you must preview the whole template to see how it will look like.",
                    "testResponse": "Test response",
                    "fetching": "Fetching...",
                    "fetch": "Fetch",
                    "emptyUrl": "Can't fetch, URL is empty",
                    "preview": "Preview"
                  },
                  "MathOptions": {
                    "operation": "Operation type",
                    "selectOperation": "Select a operation type",
                    "addition": "Addition",
                    "subtraction": "Substraction",
                    "multiplication": "Multiplication",
                    "division": "Division",
                    "modulo": "Modulo (Reminder of a division)",
                    "numberList": "Number list",
                    "numberWarning": "Remember to return a valid number",
                    "addNumber": "Add number..."
                  },
                  "MemeratorOptions": {
                    "display": "Display",
                    "selectDisplay": "Select something to display",
                    "followers": "Followers",
                    "memes": "Memes",
                    "username": "Username",
                    "usernameWarning": "Remember to return a valid username"
                  },
                  "NumberOptions": {
                    "number": "Number",
                    "numberWarning": "Remember to return a valid number",
                    "placeholder": "Enter a number or search a counter"
                  },
                  "RedditOptions": {
                    "display": "Display",
                    "selectPlaceholder": "Select something to display",
                    "members": "Members",
                    "membersOnline": "Members online",
                    "title": "Subreddit title",
                    "subreddit": "Subreddit name",
                    "subredditWarning": "Remember to return a valid subreddit",
                    "subredditPlaceholder": "Enter a subreddit or search a counter"
                  },
                  "ReplaceOptions": {
                    "inputText": "Input text",
                    "textPlaceholder": "Enter the text to replace",
                    "searchFor": "Search for",
                    "searchPlaceholder": "Enter the search term",
                    "replaceWith": "Replace with",
                    "replacementPlaceholder": "Enter the replacement text",
                    "removeReplacement": "Remove replacement",
                    "addReplacement": "Add replacement"
                  },
                  "TwitchOptions": {
                    "display": "Display",
                    "selectPlaceholder": "Select something to display",
                    "followers": "Followers",
                    "viewers": "Viewers",
                    "channelName": "Channel name",
                    "username": "Username",
                    "usernamePlaceholder": "Enter a username",
                    "usernameWarning": "Remember to return a valid username"
                  },
                  "YouTubeOptions": {
                    "display": "Display",
                    "selectPlaceholder": "Select something to display",
                    "subscribers": "Subscribers",
                    "views": "Views",
                    "videos": "Videos",
                    "channelName": "Channel name",
                    "channelUrl": "Channel URL",
                    "channelUrlPlaceholder": "Enter a channel URL",
                    "channelUrlWarning": "Remember to return a valid channel URL"
                  }
                }
              }
            },
            "AddDataSourceCombobox": {
              "searchPlaceholder": "Search counter...",
              "noItemsFound": "No counters found."
            },
            "emojiPicker": {
              "emojiPicker": "Emoji picker",
              "searchEmoji": "Search emoji"
            },
            "markButtons": {
              "bold": "bold",
              "italic": "italic",
              "underline": "underline",
              "strike": "strike",
              "spoiler": "spoiler"
            }
          }
        }
      },
      "account": {
        "deleteButton": {
          "deleteAccountBtn": "Delete account",
          "confirmTitle": "Are you absolutely sure?",
          "confirmDescription": "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
          "closeBtn": "Close"
        },
        "userBadges": {
          "donor": "You donated to support the development and maintenance of Member Counter.",
          "premium": "You are a premium user.",
          "betaTester": "You participated in a beta program.",
          "translator": "You helped translate the bot.",
          "contributor": "You implemented a feature or fixed a bug.",
          "bigBrain": "You suggested an idea that was implemented.",
          "bugCatcher": "You found and reported a bug.",
          "patPat": "You found a secret.",
          "foldingAtHome": "You contributed a WU in folding@home."
        },
        "page": {
          "avatarAlt": "{{username}}'s avatar",
          "logoutButton": "Logout"
        }
      },
      "admin": {
        "guilds": {
          "loadGuildInput": {
            "placeholder": "Paste server ID",
            "loadButton": "Load server"
          }
        },
        "users": {
          "delete": {
            "button": "Delete account",
            "dialogTitle": "Are you absolutely sure?",
            "dialogDescription": "This action cannot be undone.",
            "closeButton": "Close"
          },
          "manage": {
            "permissions": {
              "title": "Permissions",
              "seeUsers": "See users",
              "manageUsers": "Manage users",
              "seeGuilds": "See servers",
              "manageGuilds": "Manage servers",
              "manageHomePage": "Manage landing page",
              "manageDonations": "Manage donations"
            },
            "badges": {
              "title": "Badges",
              "donor": "Donor",
              "premium": "Premium",
              "betaTester": "Beta Tester",
              "translator": "Translator",
              "contributor": "Contributor",
              "bigBrain": "Big Brain",
              "bugCatcher": "Bug Catcher",
              "patPat": "Pat Pat",
              "foldingAtHome": "folding@home"
            },
            "transferAccount": "Transfer account",
            "pasteUserId": "Paste user ID",
            "saved": "Saved",
            "save": "Save"
          },
          "loadUser": "Load user",
          "recentUsers": "Recent users",
          "userNotRegistered": "This user isn't registered."
        },
        "homePage": {
          "demoServers": {
            "title": "Demo servers",
            "createInputPlaceholder": "New demo server name",
            "createBtn": "Create",
            "list": {
              "display": {
                "priority": "Priority: {{priority}}"
              }
            },
            "manage": {
              "title": "Edit demo server",
              "name": "Server name",
              "description": "Description",
              "priority": "Priority",
              "icon": "Icon URL",
              "channels": {
                "title": "Channels",
                "add": "Add channel",
                "channel": {
                  "name": "Name",
                  "type": "Type",
                  "types": {
                    "announcementChannel": "Announcement channel",
                    "voiceChannel": "Locked voice channel",
                    "categoryChannel": "Category channel",
                    "textChannel": "Text channel"
                  },
                  "topic": "Topic",
                  "showAsSkeleton": "Show as skeleton",
                  "remove": "Remove"
                }
              },
              "links": {
                "title": "Links",
                "add": "Add link",
                "link": {
                  "label": "Label",
                  "url": "URL",
                  "remove": "Remove"
                }
              },
              "saved": "Saved",
              "save": "Save"
            },
            "delete": {
              "button": "Delete demo server",
              "dialogTitle": "Are you absolutely sure?",
              "dialogDescription": "This action cannot be undone.",
              "closeButton": "Close"
            }
          }
        },
        "donations": {
          "registerDonation": "Register donation",
          "totalDonations": "Total donations: {{total}} ({{totalValue}}€)",
          "form": {
            "userId": "Discord user ID",
            "amount": "Amount",
            "currency": "Currency",
            "submitBtn": "Submit",
            "date": "Date",
            "note": "Note",
            "anonymous": "Anonymous",
            "saveBtn": "Save"
          },
          "new": {
            "title": "New donation"
          },
          "edit": {
            "title": "Edit donation"
          },
          "delete": {
            "button": "Delete demo server",
            "dialogTitle": "Are you absolutely sure?",
            "dialogDescription": "This action cannot be undone.",
            "closeButton": "Close"
          }
        }
      }
    },
    "common": {
      "unknownServer": "Unknown server",
      "unknownUser": "Unknown user {{id}}",
      "unknownChannel": "Unknown channel",
      "unknownChannelType": "Unknown channel type",
      "unknownRole": "Unknown role",
      "unknownDate": "Unknown date",
      "unknown": "Unknown",
      "unknownError": "Unknown error",
      "channelLabels": {
        "textChannel": "Text channel",
        "category": "Category",
        "voiceChannel": "Voice channel",
        "announcementChannel": "Announcement channel",
        "stageChannel": "Stage channel",
        "forumChannel": "Forum channel",
        "mediaChannel": "Media channel"
      }
    },
    "dataSourceMetadata": {
      "botStats": {
        "name": "Bot stats",
        "description": "Return the total number of users and servers the bot is currently in. (You probably don't need this)",
        "keywords": ""
      },
      "channels": {
        "name": "Channels",
        "description": "Count the number of channels within specified categories or overall.",
        "keywords": "channels,categories",
        "display": {
          "channelsUnderACategory": "Channels under a category"
        }
      },
      "clock": {
        "name": "Clock",
        "description": "Display a clock adjusted to your preferred timezone.",
        "keywords": "clock,timezone",
        "display": {
          "syntax": "Clock ({{timezone}})"
        }
      },
      "countdown": {
        "name": "Countdown",
        "description": "Create a countdown timer with a format tailored to your needs.",
        "keywords": "countdown,timer",
        "display": {
          "syntax": "Countdown to {{datetime}}"
        }
      },
      "game": {
        "name": "Game",
        "description": "Retrieve the current number of online players in your game server, compatible with more than 320 games.",
        "keywords": "game,players,online,server",
        "display": {
          "playerCountFor": "Player count for {{gameServerAddress}}"
        }
      },
      "http": {
        "name": "HTTP",
        "description": "Send a GET request to an endpoint and provide the result to this bot.",
        "keywords": "HTTP,GET,request,endpoint,API,fetch",
        "display": {
          "syntax": "HTTP {{hostname}}"
        }
      },
      "math": {
        "name": "Math",
        "description": "Perform math operations like addition, subtraction, multiplication, division, or modulus on a list of numbers.",
        "keywords": "math,calculator,operations,numbers,arithmetic,addition,subtraction,multiplication,division,modulus",
        "display": {
          "syntax": "{{operationType}} {{numbers}} {{undisplayableNumbers}}",
          "undisplayableNumbers": "and {{amount}} more",
          "operationType": {
            "add": "add",
            "subtract": "subtract",
            "multiply": "multiply",
            "divide": "divide",
            "modulo": "modulo"
          }
        }
      },
      "members": {
        "name": "Members",
        "description": "Count members, you can also filter them by their online status, specific roles and more.",
        "keywords": "members,filter,roles,online,status,banned,playing,offline,dnd,disturb,idle,afk,user,bot,connected",
        "display": {
          "bannedMembers": "banned members",
          "syntax": "{{accountType}} {{accountStatus}} {{roleFiltering}} {{connectedToAChannel}} {{playingAGame}}",
          "accountType": {
            "any": "members",
            "user": "users",
            "bot": "bots"
          },
          "accountStatus": {
            "any": "",
            "online": "online",
            "idle": "idle",
            "dnd": "DND",
            "offline": "offline"
          },
          "roleFiltering": {
            "any": "with roles",
            "overlapping": "with roles overlapping"
          },
          "connectedToAChannel": "connected to a channel",
          "playingAGame": "while playing a game"
        }
      },
      "memerator": {
        "name": "Memerator",
        "description": "Fetch the follower count and meme count for a Memerator account.",
        "keywords": "Twitch,follower,view,channel",
        "display": {
          "syntax": "Memerator {{returnKind}}",
          "returnKind": {
            "memes": "memes",
            "followers": "followers"
          }
        }
      },
      "nitroboosters": {
        "name": "Nitro Boosters",
        "description": "Retrieve the count of Nitro boosters for the server.",
        "keywords": "nitro,boosters,server"
      },
      "number": {
        "name": "Number",
        "description": "Apply number formatting to the given number.",
        "display": {
          "raw": "Number ({{number}})",
          "dataSource": "{{dataSourceDisplayName}} as number"
        },
        "keywords": "number,formatting"
      },
      "reddit": {
        "name": "Reddit",
        "description": "Retrieve the title of a subreddit along with the total number of members and the count of members currently online.",
        "keywords": "reddit,subreddit,members,online",
        "display": {
          "syntax": "Reddit {{returnKind}}",
          "returnKind": {
            "members": "members",
            "membersOnline": "online members",
            "title": "title"
          }
        }
      },
      "replace": {
        "name": "Replace",
        "description": "Text replacement, useful in conjunction with other nested counters for comprehensive text modification.",
        "keywords": "text,replacement,modification,string,substring",
        "display": {
          "syntax": "Replace {{replaceSyntax}}",
          "replaceSyntax": "“{{search}}” by “{{replacement}}”"
        }
      },
      "roles": {
        "name": "Roles",
        "description": "Count all roles present in the server.",
        "keywords": "roles"
      },
      "twitch": {
        "name": "Twitch",
        "description": "Retrieve follower count and total view count for a Twitch channel.",
        "keywords": "Twitch,follower,view,channel",
        "display": {
          "syntax": "Twitch {{returnKind}}",
          "returnKind": {
            "channelName": "channel name",
            "followers": "followers",
            "viewers": "viewers"
          }
        }
      },
      "unknown": {
        "name": "Unknown",
        "description": "Unknown counter. This is probably due to an error",
        "keywords": ""
      },
      "youtube": {
        "name": "YouTube",
        "description": "Fetch subscriber count, video count, and total views from a YouTube channel.",
        "keywords": "YouTube,subscriber,video,views,channel",
        "display": {
          "syntax": "YouTube {{returnKind}}",
          "returnKind": {
            "channelName": "channel name",
            "subscribers": "subscribers",
            "videos": "videos",
            "views": "views"
          }
        }
      }
    }
  }
}

export default Resources;
