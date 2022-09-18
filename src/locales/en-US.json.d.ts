interface EnUS {
	langCode: "en-US";
	langName: "English, US";
	interaction: {
		commandHandler: {
			error: {
				title: "ERROR!";
				description: "Something went wrong, please, try again later\n\nError ID: {{ERROR_ID}}";
			};
		};
	};
	commands: {
		invite: {
			definition: {
				name: "invite";
				description: "Gives you an invite link to add the bot";
			};
			description: "Beep boop! Your invite link is ready:\n{{INVITE_URL}}";
			addToServer: "Add to server";
			addToServerAgain: "Add to this server again";
			joinSupportServer: "Join support server";
		};
		settings: {
			definition: {
				name: "settings";
				description: "Configure and see different aspects about the bot in this server";
			};
			buttons: {
				deleteSettings: "Restore settings";
				deleteSettingsConfirm: "Are you sure? All the data related to this server will be restored to its defaults (except block and premium status)";
				deleteSettingsDone: "All the data has been restored";
			};
			subcommands: {
				see: {
					title: "Settings for {{SERVER_NAME}} ({{SERVER_ID}})";
					language: {
						name: "Language";
						fromServerLanguage: "{{CURRENT_DISCORD_LANGUAGE}} (Server language)";
					};
					locale: {
						name: "Locale (Formatting for numbers, date, etc)";
						fromAvailableLanguages: "{{ LANG_NAME }} [{{ LANG_CODE }}]";
						fromSettingsLanguage: "{{CURRENT_SETTINGS_LANGUAGE}} (Settings language)";
						custom: "{{CURRENT}} (Custom)";
					};
					shortNumber: { name: "Short Number (Compact notation)" };
					customDigits: { name: "Custom Numbers (Digits)" };
				};
				set: {
					noChangesMade: "No changes were made";
					changesMade: "The following changes were made";
					options: {
						customDigits: {
							success: "Digits customized.";
							resetSuccess: "Numbers restored to the default ones.";
						};
					};
				};
				classicPremiumUpgrade: {
					success: "Done! The next step is invite the premium bot:\n{{BOT_LINK}}";
					errorCannotUpgrade: "You can't upgrade the server because it already has premium.";
					noServerUpgradesAvailable: "You can't do more server upgrades because you don't have more server upgrades available";
				};
				logs: {
					title: {
						hasLogs: "Latest logs for {{SERVER_NAME}} ({{SERVER_ID}})";
						noLogs: "No logs for {{SERVER_NAME}} ({{SERVER_ID}})";
					};
				};
			};
		};
		setup: {
			definition: {
				name: "setup";
				description: "Used to create some basic counter channels";
			};
		};
	};
	common: {
		error: {
			noDm: "This command can't be run in a DM channel";
			noPermissions: "You don't have the required permissions to run this command";
		};
		accept: "Accept";
		cancel: "Cancel";
		yes: "Yes";
		no: "No";
	};
	autocomplete: {
		settings: {
			language: { defaultServerLanguage: "Server language" };
			locale: {
				defaultSettingsLanguage: "Settings language";
				localeFromAvailableLanguages: "{{ LANG_NAME }} [{{ LANG_CODE }}]";
			};
		};
	};
	service: {
		guildSettings: { invalidLocale: "The specified language is not available" };
	};
}

declare const EnUS: EnUS;

export = EnUS;
