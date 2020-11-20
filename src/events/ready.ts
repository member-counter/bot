import setupJobs from '../jobs';
import getEnv from '../utils/getEnv';

const { DISCORD_CLIENT_ID } = getEnv();

const ready = () => {
	console.log(`Bot ready`);
	console.log(`Invite link: https://discordapp.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=8&scope=bot`);
	setupJobs();
};

export default ready;
