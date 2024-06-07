interface Resources {
  "main": {
    "langCode": "en-US",
    "langName": "English, US",
    "interaction": {
      "commandHandler": {
        "error": {
          "title": "ERROR!",
          "description": "Something went wrong, please, try again later\n\nError ID: {{ERROR_ID}}"
        }
      },
      "commands": {
        "invite": {
          "definition": {
            "slash": {
              "name": "invite",
              "description": "Gives you an invite link to add the bot"
            }
          },
          "description": "Your invite link is ready:\n{{INVITE_URL}}",
          "addToServer": "Add to server",
          "addToServerAgain": "Add to this server again",
          "joinSupportServer": "Join support server"
        },
        "info": {
          "definition": {
            "slash": {
              "name": "info",
              "description": "List of useful links and other information."
            }
          },
          "embedReply": {
            "description": "[Add me to your server]({{BOT_INVITE_URL}})\n[Website]({{WEBSITE_URL}})\n[Support server]({{BOT_SUPPORT_URL}})\n[GitHub Repository]({{BOT_REPO_URL}})\n[Bot version: {{VERSION}}]({{VERSION_URL}})"
          }
        },
        "profile": {
          "definition": {
            "context": {
              "name": "Profile"
            },
            "slash": {
              "name": "profile",
              "description": "Shows related information between you and this bot.",
              "options": {
                "user": {
                  "name": "user",
                  "description": "The user whose profile you want to view."
                }
              }
            }
          },
          "badges": "Badges",
          "deleteProfileButton": "Delete data",
          "moreOptionsButton": "More options",
          "deleteProfilePrompt": {
            "title": "Are you sure you want to delete the data?",
            "description": "This action cannot be undone",
            "confirmButton": "Yes",
            "cancelButton": "Cancel",
            "removeDataSuccess": "The data has been removed successfully"
          },
          "userNotFound": "User not found"
        },
        "configure": {
          "definition": {
            "slash": {
              "name": "configure",
              "description": "Get the link to configure the bot on the website."
            }
          },
          "reply": "Click below to configure the bot at the dashbaord.\nYou can also setup some basic counters using the {{SETUP_COMMAND}} command without leaving Discord.",
          "dashboardButton": "Go to dashboard"
        },
        "setup": {
          "definition": {
            "slash": {
              "name": "setup",
              "description": "Setup some basic counters.",
              "subcommands": {
                "server": {
                  "name": "server",
                  "description": "Setup server related counters"
                },
                "youtube": {
                  "name": "youtube",
                  "description": "Setup YouTube related counters",
                  "options": {
                    "channelUrl": {
                      "name": "url",
                      "description": "The channel URL"
                    }
                  }
                },
                "twitch": {
                  "name": "twitch",
                  "description": "Setup Twitch related counters",
                  "options": {
                    "username": {
                      "name": "username",
                      "description": "The channel uusername"
                    }
                  }
                },
                "x-twitter": {
                  "name": "x-twitter",
                  "description": "Setup X (formerly known as Twitter) related counters.",
                  "options": {
                    "username": {
                      "name": "username",
                      "description": "The account @username"
                    }
                  }
                }
              }
            }
          },
          "status": {
            "creating": "Creating counters...",
            "completed": "Complete",
            "creatingCategory": "{{ICON}} Creating category",
            "createdCategory": "{{ICON}} Category created",
            "creatingChannel": "{{ICON}} Creating {{NAME}} counter",
            "createdChannel": "{{ICON}} {{NAME}} created",
            "configureSuggestion": "You should check out {{CONFIGURE_COMMAND}} for fully customizing the bot."
          },
          "templates": {
            "server": {
              "categoryName": "📊 Server Stats 📊",
              "counters": [
                {
                  "name": "online members",
                  "template": "Online: {{COUNTER}}"
                },
                {
                  "name": "members",
                  "template": "Members: {{COUNTER}}"
                },
                {
                  "name": "nitro boosters",
                  "template": "Boosters: {{COUNTER}}"
                },
                {
                  "name": "roles",
                  "template": "Roles: {{COUNTER}}"
                },
                {
                  "name": "channels",
                  "template": "Channels: {{COUNTER}}"
                }
              ]
            },
            "twitch": {
              "categoryName": "📊 {{COUNTER}} Twitch Stats 📊",
              "counters": [
                {
                  "name": "twitch followers",
                  "template": "{{COUNTER}} Followers"
                },
                {
                  "name": "twitch views",
                  "template": "{{COUNTER}} Views"
                }
              ]
            },
            "youtube": {
              "categoryName": "📊 {{COUNTER}} Youtube Stats 📊",
              "counters": [
                {
                  "name": "youtube subscribers",
                  "template": "{{COUNTER}} Subscribers"
                },
                {
                  "name": "youtube videos",
                  "template": "{{COUNTER}} Videos"
                },
                {
                  "name": "youtube views",
                  "template": "{{COUNTER}} Views"
                }
              ]
            },
            "x-twitter": {
              "categoryName": "📊 {{COUNTER}} Twitter Stats 📊",
              "counters": [
                {
                  "name": "twitter followers",
                  "template": "{{COUNTER}} Followers"
                }
              ]
            }
          }
        }
      }
    }
  }
}

export default Resources;
