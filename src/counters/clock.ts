import Counter from '../typings/Counter';

const ClockCounter: Counter = {
	aliases: ['clock'],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guildSettings, resource: timeZone }) => {
		return new Intl.DateTimeFormat(guildSettings.locale, {
			hour: 'numeric',
			minute: 'numeric',
			timeZone,
		}).format();
	},
};

export default ClockCounter;
