import MemberCounterCommand from '../typings/MemberCounterCommand';

// Commands
import statusCommands from './status';
import patpatCommands from './patpat';
import userCommands from './user';
import infoCommands from './info';
import helpCommands from './help';
import donateCommands from './donate';
import settingsCommands from './settings';
import countCommands from './counts';
import utilCommands from './utils';
import guideCommand from './guide';
import setupCommand from './setup';

const commands: Array<MemberCounterCommand> = [
  ...userCommands,
  ...statusCommands,
  ...patpatCommands,
  ...infoCommands,
  ...helpCommands,
  ...donateCommands,
  ...settingsCommands,
  ...countCommands,
  ...utilCommands,
  ...guideCommand,
  ...setupCommand
];

export default commands;