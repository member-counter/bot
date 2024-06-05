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
        }
      }
    }
  }
}

export default Resources;
