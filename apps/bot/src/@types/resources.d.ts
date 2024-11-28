interface Resources {
  main: {
    interaction: {
      commandHandler: {
        error: {
          title: "ERROR!";
          description: "Something went wrong, please try again later.\n\nError ID: {{ERROR_ID}}";
        };
      };
      commands: {
        invite: {
          definition: {
            slash: {
              name: "invite";
              description: "Provides an invite link to add the bot.";
            };
          };
          description: "Your invite link is ready:\n{{INVITE_URL}}";
          addToServer: "Add to server";
          addToServerAgain: "Add to this server again";
          joinSupportServer: "Join support server";
        };
        info: {
          definition: {
            slash: {
              name: "info";
              description: "List of useful links and other information.";
            };
          };
          embedReply: {
            description: "[Add me to your server]({{BOT_INVITE_URL}})\n[Website]({{WEBSITE_URL}})\n[Support server]({{BOT_SUPPORT_URL}})\n[GitHub Repository]({{BOT_REPO_URL}})\n[Bot version: {{VERSION}}]({{VERSION_URL}})";
          };
        };
        profile: {
          definition: {
            context: {
              name: "Profile";
            };
            slash: {
              name: "profile";
              description: "Shows related information between you and this bot.";
              options: {
                user: {
                  name: "user";
                  description: "The user whose profile you want to view.";
                };
              };
            };
          };
          badges: "Badges";
          deleteProfileButton: "Delete data";
          moreOptionsButton: "More options";
          deleteProfilePrompt: {
            title: "Are you sure you want to delete the data?";
            description: "This action cannot be undone.";
            confirmButton: "Yes";
            cancelButton: "Cancel";
            removeDataSuccess: "The data has been removed successfully.";
          };
          userNotFound: "User not found";
        };
        configure: {
          definition: {
            slash: {
              name: "configure";
              description: "Get the link to configure the bot on the website.";
            };
          };
          reply: "Click below to configure the bot on the dashboard.\nYou can also set up some basic counters using the {{SETUP_COMMAND}} command without leaving Discord.";
          dashboardButton: "Go to dashboard";
        };
        setup: {
          definition: {
            slash: {
              name: "setup";
              description: "Set up some basic counters.";
              subcommands: {
                server: {
                  name: "server";
                  description: "Set up server-related counters.";
                };
                youtube: {
                  name: "youtube";
                  description: "Set up YouTube-related counters.";
                  options: {
                    channelUrl: {
                      name: "url";
                      description: "The channel URL.";
                    };
                  };
                };
                twitch: {
                  name: "twitch";
                  description: "Set up Twitch-related counters.";
                  options: {
                    username: {
                      name: "username";
                      description: "The channel username.";
                    };
                  };
                };
              };
            };
          };
          status: {
            creating: "Creating counters...";
            completed: "Creation completed.";
            creatingCategory: "{{ICON}} Creating category.";
            createdCategory: "{{ICON}} Category created.";
            failedCategory: "{{ICON}} Category failed.";
            creatingChannel: "{{ICON}} Creating {{NAME}} counter.";
            createdChannel: "{{ICON}} {{NAME}} created.";
            failedChannel: "{{ICON}} {{NAME}} failed.";
            configureSuggestion: "You should check out {{CONFIGURE_COMMAND}} for a more customized setup.";
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
  };
}

export default Resources;
