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
            "name": "invite",
            "description": "Gives you an invite link to add the bot"
          },
          "description": "Your invite link is ready:\n{{INVITE_URL}}",
          "addToServer": "Add to server",
          "addToServerAgain": "Add to this server again",
          "joinSupportServer": "Join support server"
        },
        "info": {
          "definition": {
            "name": "info",
            "description": "List of useful links."
          },
          "embedReply": {
            "description": "[Add me to your server]({{BOT_INVITE_URL}})\n[Website]({{WEBSITE_URL}})\n[Support server]({{BOT_SUPPORT_URL}})\n[GitHub Repository]({{BOT_REPO_URL}})"
          }
        },
        "profile": {
          "definition": {
            "name": "profile",
            "description": "Shows related information between you and this bot."
          },
          "badges": "Badges",
          "deleteProfileModal": {
            "modalTitle": "Confirm data deletion",
            "removeDataConfirmation": "Please type exactly this text if you want to delete all your data: ```{{CONFIRMATION_STRING}}```\n:warning: **This action will remove all your data, are you sure you want to continue?",
            "removeDataConfirmationString": "I want to delete all of my data",
            "removeDataSuccess": "Your data has been removed successfully",
            "invalidTextInputProvided": "Please try again and provide a valid text"
          },
          "userNotFound": "User not found in the DB"
        }
      }
    }
  }
}

export default Resources;
