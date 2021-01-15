import setupJobs from '../jobs';
import embedBase from '../utils/embedBase';
import getBotInviteLink from '../utils/getBotInviteLink';

const ready = () => {
	console.log(`Bot ready`);
	console.log(`Invite link: ${getBotInviteLink()}`);
	setupJobs();
	embedBase();
};

export default ready;
