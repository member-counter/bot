interface Resources {
  main: {
    interaction: {
      commandHandler: {
        error: {
          description: "Something went wrong, please try again later.\n\nError ID: {{ERROR_ID}}";
          title: "ERROR!";
        };
      };
      commands: {
        configure: {
          dashboardButton: "Go to dashboard";
          definition: {
            slash: {
              description: "Get the link to configure the bot on the website.";
              name: "configure";
            };
          };
          reply: "Click below to configure the bot on the dashboard.\nYou can also set up some basic counters using the {{SETUP_COMMAND}} command without leaving Discord.";
        };
        info: {
          definition: {
            slash: {
              description: "List of useful links and other information.";
              name: "info";
            };
          };
          embedReply: {
            description: "[Add me to your server]({{BOT_INVITE_URL}})\n[Website]({{WEBSITE_URL}})\n[Support server]({{BOT_SUPPORT_URL}})\n[GitHub Repository]({{BOT_REPO_URL}})\n[Bot version: {{VERSION}}]({{VERSION_URL}})";
          };
        };
        invite: {
          addToServer: "Add to server";
          addToServerAgain: "Add to this server again";
          definition: {
            slash: {
              description: "Provides an invite link to add the bot.";
              name: "invite";
            };
          };
          description: "Your invite link is ready:\n{{INVITE_URL}}";
          joinSupportServer: "Join support server";
        };
        profile: {
          badges: "Badges";
          definition: {
            context: {
              name: "Profile";
            };
            slash: {
              description: "Shows related information between you and this bot.";
              name: "profile";
              options: {
                user: {
                  description: "The user whose profile you want to view.";
                  name: "user";
                };
              };
            };
          };
          deleteProfileButton: "Delete data";
          deleteProfilePrompt: {
            cancelButton: "Cancel";
            confirmButton: "Yes";
            description: "This action cannot be undone.";
            removeDataSuccess: "The data has been removed successfully.";
            title: "Are you sure you want to delete the data?";
          };
          moreOptionsButton: "More options";
          userNotFound: "User not found";
        };
        setup: {
          definition: {
            slash: {
              description: "Set up some basic counters.";
              name: "setup";
              subcommands: {
                server: {
                  description: "Set up server-related counters.";
                  name: "server";
                };
                twitch: {
                  description: "Set up Twitch-related counters.";
                  name: "twitch";
                  options: {
                    username: {
                      description: "The channel username.";
                      name: "username";
                    };
                  };
                };
                youtube: {
                  description: "Set up YouTube-related counters.";
                  name: "youtube";
                  options: {
                    channelUrl: {
                      description: "The channel URL.";
                      name: "url";
                    };
                  };
                };
              };
            };
          };
          status: {
            completed: "Creation completed.";
            configureSuggestion: "You should check out {{CONFIGURE_COMMAND}} for a more customized setup.";
            createdCategory: "{{ICON}} Category created.";
            createdChannel: "{{ICON}} {{NAME}} created.";
            creating: "Creating counters...";
            creatingCategory: "{{ICON}} Creating category.";
            creatingChannel: "{{ICON}} Creating {{NAME}} counter.";
            failedCategory: "{{ICON}} Category failed.";
            failedChannel: "{{ICON}} {{NAME}} failed.";
          };
          templateCollection: {
            server: {
              categoryName: "📊 Server Stats 📊";
              templates: [
                {
                  name: "Online members";
                  template: "Online: {{COUNTER}}";
                },
                {
                  name: "Members";
                  template: "Members: {{COUNTER}}";
                },
                {
                  name: "Nitro boosters";
                  template: "Boosters: {{COUNTER}}";
                },
                {
                  name: "Roles";
                  template: "Roles: {{COUNTER}}";
                },
                {
                  name: "Channels";
                  template: "Channels: {{COUNTER}}";
                },
              ];
            };
            twitch: {
              categoryName: "📊 {{COUNTER}} Twitch Stats 📊";
              templates: [
                {
                  name: "Twitch followers";
                  template: "{{COUNTER}} Followers";
                },
                {
                  name: "Twitch viewers";
                  template: "Viewers: {{COUNTER}}";
                },
              ];
            };
            youtube: {
              categoryName: "📊 {{COUNTER}} YouTube Stats 📊";
              templates: [
                {
                  name: "YouTube subscribers";
                  template: "{{COUNTER}} Subscribers";
                },
                {
                  name: "YouTube videos";
                  template: "{{COUNTER}} Videos";
                },
                {
                  name: "YouTube views";
                  template: "{{COUNTER}} Views";
                },
              ];
            };
          };
        };
      };
    };
    jobs: {
      updateChannels: {
        computeError: "ERROR!";
      };
    };
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
      REDDIT_MISSING_SUBREDDIT: "A subreddit must be provided for the Reddit coutner.";
      TWITCH_CHANNEL_NOT_FOUND: "The specified Twitch channel could not be found.";
      TWITCH_MISSING_USERNAME: "The Twitch counter requires a username to be set.";
      UNKNOWN: "An unknown error occurred.";
      UNKNOWN_DATA_SOURCE: "The counter provided is unknown or not recognized.";
      UNKNOWN_EVALUATION_RETURN_TYPE: "The type of value returned from evaluation is unknown.";
      USER_NOT_FOUND: "User not found.";
      YOUTUBE_INVALID_CHANNEL_URL: "The provided YouTube channel URL is invalid.";
      YOUTUBE_MISSING_CHANNEL_URL: "The YouTube counter requires a channel URL to be set.";
    };
  };
}

export default Resources;
