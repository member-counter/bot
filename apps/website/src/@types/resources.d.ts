interface Resources {
  "main": {
    "hooks": {
      "useConfirmOnLeave": "You have unsaved changes - are you sure you wish to leave this page?"
    },
    "components": {
      "NavBar": {
        "supportEntry": "Support",
        "dashboardEntry": "Dashboard",
        "accountEntry": "Account"
      }
    },
    "pages": {
      "error": {
        "errors": {
          "NotAuthenticated": "You are not logged in.",
          "NotAuthorized": "You are not authorized to access this page.",
          "NotFound": "The page you were looking for could not be found.",
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
        "servers": {
          "suggestedTopics": {
            "quickSetup": {
              "title": "Quick-setup",
              "description": "Quickly create the most common counters in a few clicks. No imagination or brain required!",
              "label": "Hassle free!"
            },
            "createFromScratch": {
              "title": "Create from scratch",
              "description": "Learn how to create your first custom counter in a few minutes",
              "label": "Be unique!"
            },
            "advancedCounters": {
              "title": "Advanced counters",
              "description": "Get the most out of your counters, tailored to your needs",
              "label": "Like a pro"
            },
            "queryHistoricalStatistics": {
              "title": "Query historical statistics",
              "description": "See how your counters and other common stats have evolved over time",
              "label": "Coming Soon™"
            },
            "title": "Welcome back!",
            "subTitle": "Here are some suggestions for you"
          },
          "inviteBotPage": {
            "title": "Let's set up the bot!",
            "subtitle": "Add Member counter to {{serverName}} and enjoy realtime counters.",
            "addToServer": "Add to {{serverName}}",
            "noPermission": "You don't have enough permissions to add the bot. Please ask an administrator or someone with Manage Server permission to add this bot.",
            "useOrShareLink": "Use or share this link to add the bot",
            "linkCopied": "The link has been copied to your clipboard",
            "copyLink": "Copy invite link"
          },
          "inviteBotBanner": {
            "message": "It looks like the Member Counter Bot isn't in this server. Would you like to <LinkURL>add it</LinkURL>?",
            "closeBtn": "Close"
          },
          "forbiddenPage": {
            "message": "You don't have permission to manage this server.\nAsk an admin at {guildName} to give you Administrator or Manage Guild permissions.",
            "title": "Permission Denied"
          },
          "blockedBanner": {
            "text": "This server has been blocked for violating our <LinkTerms>Terms of Service</LinkTerms> or <LinkPolicy>Acceptable Use Policy</LinkPolicy>.<br />Reason given: {{reason}}<br />If you think this is a mistake, please contact our <SupportLink>support team</SupportLink>.",
            "termsOfService": "Terms of Service",
            "acceptableUsePolicy": "Acceptable Use Policy",
            "noReasonGiven": "No reason given",
            "supportTeam": "support team"
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
          "donor": "You donated to support the development and maintenance of Member Counter",
          "premium": "You are a premium user",
          "betaTester": "You participated in a beta program",
          "translator": "You helped to translate the bot",
          "contributor": "You implemented a feature or fixed a bug",
          "bigBrain": "You suggested an idea and it was implemented",
          "bugCatcher": "You found and reported a bug",
          "patPat": "You found a secret",
          "foldingAtHome": "You contributed a WU in folding@home"
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
              "seeUsers": "See Users",
              "manageUsers": "Manage Users",
              "seeGuilds": "See Servers",
              "manageGuilds": "Manage Servers"
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
              "foldingAtHome": "Folding@Home"
            },
            "transferAccount": "Transfer account",
            "pasteUserId": "Paste user ID",
            "saved": "Saved",
            "save": "Save"
          },
          "loadUser": "Load user",
          "recentUsers": "Recent users",
          "userNotRegistered": "This user isn't registered."
        }
      }
    },
    "common": {
      "unknownServer": "Unknown server",
      "unknownUser": "Unknown user {{id}}",
      "channelLabels": {
        "textChannel": "Text channel",
        "category": "Category",
        "voiceChannel": "Voice channel",
        "announcementChannel": "Announcement channel",
        "stageChannel": "Stage channel",
        "forumChannel": "Forum channel",
        "mediaChannel": "Media channel"
      }
    }
  }
}

export default Resources;
