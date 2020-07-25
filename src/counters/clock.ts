import Counter from '../typings/Counter';

const ClockCounter: Counter = {
	aliases: ['clock'],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guildSettings, resource: timeZone }) => {
		// TODO website to select timezone https://member-counter.eduardozgz.com/utils/clock
		const coeff = 1000 * 60 * 5;
		const date = new Date();
		const rounded = new Date(Math.round(date.getTime() / coeff) * coeff)


		return new Intl.DateTimeFormat(guildSettings.locale, {
			hour: 'numeric',
			minute: 'numeric',
			timeZone,
		}).format(rounded);
	},
};

export default ClockCounter;
