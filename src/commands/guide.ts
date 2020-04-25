import MemberCounterCommand from '../typings/MemberCounterCommand';

const guide: MemberCounterCommand = {
  aliases: ['guide', 'setup', 'intro'],
  denyDm: false,
  onlyAdmin: false,
  run: async ({ message, languagePack }) => {},
};

const guideCommand = [guide];

export default guideCommand;
