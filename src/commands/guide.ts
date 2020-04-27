import MemberCounterCommand from '../typings/MemberCounterCommand';
import ReactionManager from '../utils/ReactionManager';

const guide: MemberCounterCommand = {
  aliases: ['guide', 'setup', 'intro'],
  denyDm: false,
  onlyAdmin: false,
  run: async ({ message, languagePack }) => {
    const { channel } = message;
  },
};

const guideCommand = [guide];

export default guideCommand;
