import setupJobs from '../jobs';
import getBotInviteLink from '../utils/getBotInviteLink';

const ready = () => {
	console.log(`Bot ready`);
	console.log(`Invite link: ${getBotInviteLink()}`);
	setupJobs();
};

export default ready;
