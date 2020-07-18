import getEnv from '../utils/getEnv';
import fetch from 'node-fetch';
import * as packageJSON from '../../package.json';
import Counter from '../typings/Counter';
import Constants from '../utils/Constants';

const MixerCounter: Counter = {
	aliases: ['mixerFollowers'],
	isPremium: true,
	isEnabled: true,
	lifetime: 1 * 60 * 1000,
	execute: async ({ guild, resource }) => {
		const response = await fetch(
			`https://mixer.com/api/v1/channels/${resource}`,
		).then((response) => response.json());

		return { mixerFollowers: response?.numFollowers };
	},
};

export default MixerCounter;
